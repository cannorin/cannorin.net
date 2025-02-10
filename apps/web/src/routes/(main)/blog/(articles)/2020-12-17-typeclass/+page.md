---
title: F# で型クラス 2020
description: そろそろ F# での型クラスの実用的な作り方について書いておく
date: !!timestamp 2020-12-17T19:00:00.0000000+09:00
category: Programming
tags: ["F#", "SRTP"]
---

この記事は [F# Advent Calendar 2020](https://qiita.com/advent-calendar/2020/fsharp) の12日目の記事です．投稿が遅れたのは [Cyberpunk 2077](https://www.cyberpunk.net/) のせいであって，私のせいではありません．

昔このブログで [F# で型クラスを実現する方法](/blog/2018-02-14-typeclass) について書きましたが，FSharpPlus のメンテナになってからより実用的な手法を学んだので，改めて解説をしようというわけです．

この記事では SRTP 自体の解説はしません．

## 基本的な事項

まず，この手法は Haskell などで一般的な型クラスを **そのまま** F# 上で再現するものではない．具体的には，関数を一つだけ含む型クラスしか作れない．それでは複数の関数を含む型クラス[^1]はどうするのかというと，インスタンス側で複数の型クラスを実装してあげればよいので，特に困ることはない．

[^1]: Monad とか

前回紹介した手法では型クラスに対応したデータ型を作ってそこに関数を格納したが，関数呼び出しにオーバーヘッドが発生してしまっていた．この手法では関数呼び出しは全てインライン展開されるので，パフォーマンスへの影響は最小限になる．

また，この手法では型クラス同士の継承も自然に表現することができる．例えば，Monad を実装した型を自動的に Functor や Applicative にするということが可能である．FSharpPlus では[頻出する型クラスが一通り実装されている](https://fsprojects.github.io/FSharpPlus/abstractions.html)のでチェックしてみてほしい[^2]．

[^2]: この記事の手法で実装された Monad や Applicative といった型クラスを使いたいだけなら，自分で作らずに FSharpPlus をインストールしてしまえばいいということでもある．

この手法の欠点は，例えばモナドであれば「モナドである」ということを制約として表現する方法がなく，「bind と return を実装している」とするしかないことだ．とはいえ SRTP 制約自体がとても手書きできたものではなく，書かずにコンパイラの推論に任せることが多いので，このことで困ることはあまりないだろう．

また前回の手法と同様に，orphan instances を作ることはできない．

## SRTP によるオーバーロード解決の基本的な考え方

SRTP は型に対するパターンマッチを実現する．例えば，次のような型があるとする．

```fsharp
type S<'n> = S of 'n
type Z     = Z
```

これを使えば型レベル自然数[^3]が表現できる．例えば3は `S<S<S<Z>>>` である．

[^3]: これについての話はクリスマスの記事に．

型レベル自然数同士の足し算はどうすればいいだろうか？ SRTPを使って型レベルのパターンマッチを行い，再帰計算をしたいときは再帰的にオーバーロード解決を起こすようにすればよい．

```fsharp
let inline ( +^ ) (x: ^X) (y: ^Y) =
  (^X: (static member ( +^ ): _*_->_) x,y)

type S<'n> with
  static member inline ( +^ ) (S x, y) = S (x +^ y)

type Z     with
  static member inline ( +^ ) (Z, y)   = y

let three = S (S Z) + S Z /// S<S<S<Z>>>
```

今回は再帰呼び出しまでは行わないが，上の例とはまた違った複雑さをはらんでいる．それは orphan instances を作れないこと，つまり型クラスを定義しているモジュールの中で既存の型をインスタンス化しておく必要があることに由来している．

## 用語の導入

ある型クラスの関数 `foo` に対して，次の2つの型を導入したい．

* `FooImpl` 型
  - 型クラス実装時に用意する，オーバーロード解決の対象になる型．
  - 既存の型をインスタンス化するためのメソッドも，この型に定義する．
  - この記事では，この種の型を **Impl型** と呼びたい．
* `Foo` 型
  - メソッド `Foo.Invoke` を呼び出すことで `foo` を使う．
  - 別になくてもいいのだが，実用上は上の `FooImpl` 型と合体させてしまうのが扱いやすい．

## インスタンス化する既存の型の取り扱い方

ユーザ定義型は SRTP で受け取り，オーバーロード解決を起こさせればいいだけだが，既存の型をインスタンス化したい場合は複数の方法がある．

これはあなたが実装したいモナド（の関数）の種類によって変わってくる．
なお，「オーバーロード解決をかけるメソッドのシグネチャ」とは，

```fsharp
(^T: (static member ...: ...) ...)
```

の構文を使ってオーバーロード解決をかけたいメソッドのシグネチャのことであり，「ユーザ定義型で実装させたいメソッドのシグネチャ」とは，例えば自作型 `A` を作るとして，

```fsharp
type A = ... with
  static member ... (...) =
    ...
```

として型クラスをインスタンス化する際に書きたいメソッドのシグネチャのことである．

### 1. オーバーロード解決をかけるメソッドのシグネチャと，ユーザ定義型で実装させたいメソッドのシグネチャが同じでよい場合

このケースは単純である．

1. 既存の型用の解決対象のメソッドを含む Impl型
2. ユーザ定義型（自分自身で解決対象のメソッドを持つ）

の2択でオーバーロード解決をかければよい．オーバーロード解決の観点からは，この2つは同じ優先順位にある．

具体的には，次のような例である．

```fsharp
type BindImpl =
  static member ( >>= ) (m: _ option, f) = Option.bind f m
  static member ( >>= ) (m: _ list,   f) = List.collect f m

type Bind =
  static member inline Invoke (value: ^Ma, binder: 'a -> ^Mb) : ^Mb =
    // このヘルパー関数は書き方によって警告が出たり出なかったりする
    // 警告が出るのはオーバーロード解決が早く起こりすぎてしまうのが原因だが，
    // オーバーロード解決を遅延させる一般的な方法はよくわからない
    let inline call (_impl: ^impl, m: ^m, _r: ^r, f) =
      ((^impl or ^m or ^r): (static member (>>=): _*_->_) m,f)
    call (Unchecked.defaultof<BindImpl>, value, Unchecked.defaultof< ^Mb >, binder)

let inline (>>=) m f = Bind.Invoke (m, f)

type M<'t> = M of 't with
  static member (>>=) (M x, f) : M<_> = f x

let m1 = Some 2  >>= fun x -> Some (x + 1)
let m2 = [1;2;3] >>= fun x -> [x; x+1; x+2]
let m3 = M 2     >>= fun x -> M    (x + 1)
```

ここで起こっているオーバーロード解決は，ユーザ定義型 or `BindImpl` の2択である．
[F# で型クラス](/blog/2018-02-14-typeclass) でやったことがわかっていれば
特に理解に苦しむところはないと思う．

もしあなたが実装したいモナド（の関数）がこの類ならば，おめでとう．話はここでおしまいである．しかし実際は，これで
綺麗に実装できるのは `>>=` くらいしかない．

### 2. オーバーロード解決をかけるメソッドのシグネチャと，ユーザ定義型で実装させたいメソッドのシグネチャを別にしなければならない場合

ほとんどの関数がこのケースに該当する．このケースに該当するのは，オーバーロード解決において本来の引数以外にダミー引数を加えて表現しなければいけない情報が入っているときで，具体的には以下の通りである．

1. 戻り値の型に応じて呼び出すメソッドが変わるとき（例: `return`）
  - 戻り値の型を格納するダミー引数を加えないとオーバーロード解決ができない．
2. 他の型クラスと継承関係にあるとき (例: `fmap`)
  - ユーザ定義型が `>>=` と `return` だけを実装している場合は，それらを使いたい．
  - しかし，ユーザ定義型が明示的に `fmap` を定義している場合は，`>>=` と `return` を無視してそちらを使いたい．
  - オーバーロード解決の優先順位の情報をダミー引数で持つ必要がある．
3. 特定のクラス・インターフェースを継承していれば使えるようにしたいとき (例: `fold`)
  - ユーザ定義型が `seq` を継承している場合，`Seq.fold` を使いたい．
  - しかし，ユーザ定義型が明示的に `fold` を実装している場合，`seq<'t>` を継承していたとしても無視してそれを使いたい．
  - オーバーロード解決の優先順位の情報をダミー引数で持つ必要がある．

ユーザ定義型で実装するメソッドのシグネチャには上で述べたダミー引数を含めたくない[^4]．そのため，オーバーロード解決の対象になるメソッドとユーザ定義型で実装するメソッドのシグネチャが異なることになる．

[^4]: 含めてもいいが，インスタンス化が冗長になってしんどいし，オーバーロード解決が壊れかねない．

もっと言うと 1. はオーバーロード解決の優先順位の問題でもある．どういうことかというと，例えば `return` を素朴に実装しようとすると以下のようになるだろう．

```fsharp
type ReturnImpl =
  // 既存の型用
  static member        Return (_: 'a option, x: 'a) = Some x
  static member        Return (_: 'a list,   x: 'a) = [x]

  // ユーザ定義型用
  static member inline Return (_: ^Ma,       x: 'a) = (^Ma: (static member Return: 'a -> ^Ma) x)

type Return =
  static member inline Invoke (x: 'x) : ^Ma =
    let inline call_2 (_impl: ^a, output: ^b, x) = ((^a or ^b): (static member Return: _*_->_) output, x)
    let inline call   (impl: 'a, output: 'b, x) = call_2 (impl, output, x)
    call (Unchecked.defaultof<ReturnImpl>, Unchecked.defaultof< ^Ma >, x)

let inline return_ x = Return.Invoke x
```

しかしこれでは `option` と `list` の `Return` メソッドが呼ばれてくれない．なぜそうなるかというと，この場合のオーバーロード解決時の型の候補は Impl型 である `ReturmImpl` 一択であり，コンパイラは次に `ReturnImpl` に含まれる3つの `Return` メソッドを同じ優先順位で解決しようとする．
ここで SRTP はあくまで型パラメータなので，コンパイラは3つ目のオーバーロードが一番汎用性が高いと判断してそれを使ってしまう．しかし，`list` 型や `option` 型それ自身は `Return` メソッドを持たないため，制約解決に失敗する．
コンパイラが特定のオーバーロードを選んだ結果として SRTP の制約解決に失敗した場合は，オーバーロード解決にフォールバックせずにそのままエラーを吐き，型付けに失敗してしまうのだ．

この問題には別の解決方法もあるが，SRTPを含むメソッドの優先順位をそうでないメソッドよりも下げることでも解決できる．
というわけで，まずはオーバーロード解決の優先順位付けについて解説しようと思う．

## オーバーロード解決の優先順位付け

幸いなことに，ある方法を使えば，オーバーロード解決に対して優先順位を付けることができる．その方法とは，

1. Impl型を他の型の部分型にしておく．
2. オーバーロード解決対象になるメソッドのシグネチャに，Impl型をダミー引数として含めておく．
3. オーバーロード解決の優先順位が低いメソッドはシグネチャ中のImpl型のダミー引数の型を上位型に変える．より優先順位が低いメソッドはさらに上位の型を使う．

というものである．F# の制約解決器はどうやら「オーバーロードが見つからなかった場合，引数の型を上位型にしたものを探す」という挙動になっているらしく，後に解決して欲しいメソッドほど上位の型になるようなダミー引数を用意してあげることで優先順位を下げることができる．

次のようなヘルパー型を用意しておく．

```fsharp
type Default1 = class inherit Default2 end
and  Default2 = class inherit Default3 end
and  Default3 = class end
```

これをどう使うかというと，

* オーバーロード解決の対象になる型（ここでは `FooImpl` とする）は `Default1` 型を継承するようにする．
* オーバーロード解決対象のメソッドに一つダミー引数を増やす．
  - オーバーロード解決の優先度が一番高いメソッドは，そのダミー引数の型を `FooImpl` にする．
  - 優先度が次に高いメソッドは，そのダミー引数の型を `Default1` にする．
  - 優先度がその次に高いメソッドは，そのダミー引数の型を `Default2` にする．
  - ...

というようになる．もし `N+1` 段階の優先順位を付けたい場合， `DefaultN` 型まで作る必要がある．

## 優先度付きのメソッドの配置ルール

さて，F# コンパイラが意図通りにオーバーロードを解決してくれるようにするために，守るべきルールがある．

1. SRTP を含むオーバーロードは，同じ優先順位の中には一つしかないようにする．
  - 例えば `fmap` の場合，ユーザ定義の `fmap` を呼ぶためのメソッドと，ユーザ定義の `>>=` と `return` を使うメソッドは，別の優先順位に置かなければならない．
  - これは，F# は2つのメソッドのシグネチャの等価性を判断する時，型変数に付いている制約を考慮しないからである．全く異なるメンバー制約が付いた SRTP であっても，ただの型変数に変えた時に同じになるならば，同一のシグネチャと判断される．
  - F# においては同一のシグネチャを持つメソッドが複数存在することは許されないので，コンパイルエラーになる．
2. 同じ優先順位内に，以下に挙げる種類のオーバーロードを全く含まないか，2つ以上を含んでいる必要がある[^5]．
  * オーバーロード解決に関係する引数の型が，インターフェースもしくは継承が可能なクラスである．
  * オーバーロード解決に関係する引数の型が，型変数（現実的にはSRTP）である．

[^5]: これに関しては，優先順位が一番高い場合は絶対に従う必要があるようだが，それ以外の場合ではなくでも問題ないことが多々ある．怖い．

2.については，F# コンパイラ的には部分型制約も SRTP 制約も「解かなければいけない」という点で同じであるので，
オーバーロード解決の時点では同じ種類の物体と認識しているのだと思う．
F# コンパイラは，この種のオーバーロードが1個のみ存在しているならば無条件でマッチしようと試みて，失敗した場合他の候補を無視してコンパイルエラーを吐く．
しかしこの種のオーバーロードが2個以上存在し，かつ現在解決中の型がそのどちらにもマッチしないとき，両方とも無視してオーバーロード候補の探索を進める性質があるようだ．

もしインスタンス化する既存の型に継承可能なクラス[^6]やインターフェースが1つもない場合，ダミーのオーバーロードが2つ必要になる．それに用いるために，以下のダミー型を用意しておくとよい．
[^6]: `option` や `list` などは，内部的にはクラスで実装されているが，継承可能ではない．一方，`seq` はインターフェース．

```fsharp
type Dummy1<'t>(x: 't) = class member val Value1 = x end
type Dummy2<'t>(x: 't) = class member val Value2 = x end
```

ちなみに SRTP を使ったオーバーロードとダミーのインターフェースを使ったオーバーロードを同じ階層に置いても意図通り動作するようだ．もし不安ならば，

* SRTP（正確にはメンバ制約が付いている型変数）の制約を `when ^t: null and ^t: struct` に変える
* 戻り値の arity を変える（戻り値がただの値ならば1変数関数にするなど）

をしたオーバーロードを作ってあげればよい．これは

* オーバーロード解決の候補になる（引数の数が同じなため）
* 元の SRTP を使ったオーバーロードとシグネチャが異なる（戻り値の arity が異なるため）
* 絶対にマッチすることがない（ありえない制約を要求しているため）

ので，うまくダミーのオーバーロードとして機能する．例えば，

```fsharp
  static member inline Return (_: ReturnImpl, _: ^Ma, x: 'a) = (^Ma: (static member Return: 'a -> ^Ma) x)
```

に対しては，

```fsharp
  static member inline Return (_: ReturnImpl, _: ^Ma when ^Ma: struct and ^Ma: null, _) = id
```

としてあげるとよい．戻り値が `id` なので arity が異なることに注目．

## 実例: Foldable

例として `fold` を実装してみよう． `fold` に期待する挙動は以下のとおりだ．

* 既存の型として `list`, `option`, `[]`, `seq` をサポートしたい．
* ユーザ定義型がメンバーとして `Fold` を持っている場合，それを優先して使いたい．
* それ以外の場合，`seq` を継承しているなら `Seq.fold` を使いたい．

よって，メソッドの優先順位は次のようになるだろう．

* 優先順位0 (`Fold`):
  - `list`
  - `option`
  - `[]`
* 優先順位1 (`Default1`):
  - ユーザ定義型 (SRTP)
* 優先順位2 (`Default2`)
  - `seq` (インターフェース)

ルールに従い，優先順位1と優先順位2に一個ずつダミーのオーバーロードを追加することにする．
よって，`fold` の定義は以下のようになる[^7]．

[^7]: 面倒なので `FoldImpl` と `Fold` を分けずに一つの型で実装している．

```fsharp
type Fold =
  inherit Default1

  // 優先順位0
  static member        Fold (f, state, xs: _ list,      [<Optional>]_impl: Fold) = List.fold f state xs
  static member        Fold (f, state, xs: _[],         [<Optional>]_impl: Fold) = Array.fold f state xs
  static member        Fold (f, state, xs: _ option,    [<Optional>]_impl: Fold) = Option.fold f state xs

  // 優先順位1
  static member inline Fold (f: 's -> 'a -> 's, state: 's, xs: 'Fa, [<Optional>]_impl: Default1) = (^Fa: (static member Fold: _ * _ * ^Fa -> ^s) f,state,xs)
  static member        Fold (f, state, xs: Dummy1<_>, _impl: Default1) = f state xs.Value1

  // 優先順位2
  static member        Fold (f, state, xs: _ seq,  [<Optional>]_impl: Default2) = printfn "using Seq.fold"; Seq.fold f state xs
  static member        Fold (f, state, xs: Dummy1<_>, _impl: Default2) = f state xs.Value1

  static member inline Invoke (folder: 'State -> 'T -> 'State) (state: 'State) (foldable: 'FoldableT) : 'State =
    let inline call_2 (impl: ^a, input: ^b, f, x) = ((^a or ^b): (static member Fold: _*_*_*_ -> _) f,x,input,impl)
    let inline call   (impl: 'a, input: 'b, f, x) = call_2 (impl, input, f, x)
    call (Unchecked.defaultof<Fold>, foldable, folder, state)

let inline fold (f: 'State -> 'T -> 'State) (state: 'State) (foldable: 'FoldableT) : 'State = Fold.Invoke f state foldable
```

これを以下の例を使ってテストしてみる．

```fsharp
type C<'t> = { item: 't list } with
  interface System.Collections.Generic.IEnumerable<'t> with
    member this.GetEnumerator() = (this.item :> _ seq).GetEnumerator()
  interface System.Collections.IEnumerable with
    member this.GetEnumerator() = (this.item :> _ seq).GetEnumerator() :> _
  static member Fold (f, state, x: C<_>) =
    printfn "using C.Fold"
    List.fold f state x.item

// list, [], option
let p1 = fold (fun state x -> x :: state) [] [  1; 2; 3  ]
let p2 = fold (fun state x -> x :: state) [] [| 1; 2; 3 |]
let p3 = fold (fun state x -> x :: state) [] (Some 42)

// seq を継承している型
let p4 = fold (fun state x -> x :: state) [] (Set.ofList [ 1; 2; 3 ])

// seq を継承し，Fold も定義されている型
let p5 = fold (fun state x -> x :: state) [] { item = [ 1; 2; 3 ] }
```

なお，デバッグのために `Seq.fold` と `C.fold` には `printfn` を仕込んである．これは実行時に

```
using Seq.fold
using C.fold
```

を出力するので，正しいオーバーロードが選ばれていることがわかる．

## で，結局モナドはどう実装すればいいの

わかりやすいように実装すると，以下のようになるだろう．

```fsharp
type BindImpl =
  static member ( >>= ) (m: _ option,  f) = Option.bind f m
  static member ( >>= ) (m: _ list,    f) = List.collect f m
  static member ( >>= ) (m: _ seq,     f) = Seq.collect f m
  static member ( >>= ) (m: Dummy1<_>, f) = f m.Value1

type Bind =
  static member inline Invoke (value: ^Ma, binder: 'a -> ^Mb) : ^Mb =
    let inline call (_impl: ^impl, m: ^m, _r: ^r, f) =
      ((^impl or ^m or ^r): (static member (>>=): _*_->_) m,f)
    call (Unchecked.defaultof<BindImpl>, value, Unchecked.defaultof< ^Mb >, binder)

let inline (>>=) m f = Bind.Invoke (m, f)

type ReturnImpl =
  inherit Default1
  static member        Return (_: Default1, _: 'a option,   x: 'a) = Some x
  static member        Return (_: Default1, _: 'a list,     x: 'a) = [x]
  static member        Return (_: Default1, _: 'a seq ,     x: 'a) = Seq.singleton x
  static member        Return (_: Default1, _: Dummy1<'a>,  x: 'a) = new Dummy1<_>(x)

  static member inline Return (_: ReturnImpl, _: ^Ma, x: 'a) = (^Ma: (static member Return: 'a -> ^Ma) x)
  static member        Return (_: ReturnImpl, _: Dummy1<'a>, x: 'a) = new Dummy1<_>(x)

type Return =
  static member inline Invoke (x: 'x) : ^Ma =
    let inline call_2 (impl: ^a, output: ^b, x) = ((^a or ^b): (static member Return: _*_*_->_) impl,output,x)
    let inline call   (impl: 'a, output: 'b, x) = call_2 (impl, output, x)
    call (Unchecked.defaultof<ReturnImpl>, Unchecked.defaultof< ^Ma >, x)

let inline return_ x = Return.Invoke x

type M<'t> = M of 't with
  static member (>>=) (M x, f) : M<_> = f x
  static member Return x = M x

let m1 = Some 2  >>= fun x -> return_ (x + 1) // int option
let m2 = [1;2;3] >>= fun x -> return_ (x + 1) // int list
let m3 = M 2     >>= fun x -> return_ (x + 1) // M<int>
```

## はい

よかったですね
