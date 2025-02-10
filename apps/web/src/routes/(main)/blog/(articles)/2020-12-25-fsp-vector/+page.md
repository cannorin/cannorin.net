---
title: FSharpPlus に型安全な固定長リストが実装されるまでの話
description: SRTP と型プロバイダを使った黒魔術が盛りだくさんです
date: !!timestamp 2020-12-25T00:00:00.0000000+09:00
category: Programming
tags: ["F#", "SRTP"]
---

この記事は [F# Advent Calendar 2020](https://qiita.com/advent-calendar/2020/fsharp) の25日目の記事です．

今年の4月に[型システム祭りオンライン](https://opt.connpass.com/event/169724/)で発表した内容をもとにしています．スライドの内容に比べて大幅に加筆されていますが，忙しくて読む暇がない！という方向けに当該スライドも貼っておきます．

<script async class="speakerdeck-embed" data-slide="1" data-id="cdaf450125fa4655b57870cd3641d8a5" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

----

## FSharpPlus と私について

私です．ブログ記事には書き忘れたんですが去年の夏ぐらいから [FSharpPlus](https://github.com/fsprojects/FSharpPlus) のメンテナをやっています[^ionide]．

[^ionide]: [Ionide のとき](/blog/2019-07-08-ionide-vim) は記事にしたのにね

[FSharpPlus](https://github.com/fsprojects/FSharpPlus) というのは，F# の標準ライブラリの拡張版として開発されているライブラリで，

* 標準ライブラリに足りていない関数（`String.toLower` など）
* 対応する型ならなんでも使える，ジェネリックな関数と演算子（配列にもリストにも使える `map` など）
* Haskell や Scala でみられるような型クラスと，さまざまなモナド
* `NonEmptyList` などの便利なデータ型

などを含んでいます．FSharpPlus をプロジェクトに追加するだけで，F# のかゆいところに手が届くだけでなく，他の言語でみられるような強力な抽象化機能を使えるようになるわけです．しかも他の言語の概念・用語をそのまま輸入するのではなく，既存の F# のスタイルとなるべく近くなるように工夫されています．

> F#+ is a base library that aims to take F# to the next level of functional programming.
>
> What if we imagine F# as more than it is?
>
> F#+ builds upon FSharp, using generic programming techniques to help you avoid boiler plate code. However, by naming conventions and signatures it can be seen to 'enhance' rather than 'replace' existing patterns as much as possible.

> F#+ は F# でより高度な関数型プログラミングをすることを目標とした標準ライブラリです．
>
> もし F# が現状以上に強力な言語だったとしたら……？
>
> F#+ を使えば F# の言語機能が拡張されて，ジェネリックプログラミングの手法によって冗長なコードを削減することができるようになります．しかし，F# 既存のプログラミングパターンを「置き換える」のではなく，むしろ「強化する」ものと言えるように，できる限り命名規則や関数のシグネチャを工夫しています．

今回は，去年の9月くらいから実装を開始し今年の4月にマージされた，[型レベルリテラルと自然数依存のベクトル・行列型](https://github.com/fsprojects/FSharpPlus/pull/192) の話です．

## 背景

ある日のこと，あるユーザが [FSharpPlus に型安全な固定長ベクトル・行列が欲しい](https://github.com/fsprojects/FSharpPlus/issues/178) という feature request を投げてきた．
ここで言う「型安全」とは，境界外アクセスや（行列演算の）次元の不一致などのエラーを実行時例外としてではなく，コンパイル時に検出してコンパイルエラーにできるということだ．
この種の安全性を保証するのはとても難しいことで，具体的には

1. ベクトルの長さや行列の次元の数値をコンパイル時に扱う（加減乗除などの演算ができるともっとよい）
2. 長さや次元の情報を使って，境界外アクセスなどを静的に検出してコンパイルエラーを出す

の2つができなければならない．
これらを自然に実現できる言語はだいたい[依存型や篩型](/blog/2018-07-07-difference)などの強力な型システムを搭載している．当然 F# はそれらをサポートしていないので，F# の言語機能の範囲内でなんとかしなければならない．

さらに FSharpPlus は標準ライブラリの拡張版として作られているものなので，F# ユーザにとって馴染みのあるような API を提供する必要がある．例え裏でどんな黒魔術をしていようとも，ユーザを混乱させないためにその事実をなるべく隠して，扱いやすい形にしなければならないわけだ．

この feature request はたまたまその方面に明るかった私が担当することになった．そして，Haskell の同様のライブラリでも採用されている **型レベルリテラル** と **型レベル計算** を用いて実装することにした．つまり，

1. ベクトル長や行列の次元は型レベルリテラルで管理する（加減乗除は型レベル計算で行う）
2. 境界外アクセスなどの検出は型レベル計算で静的アサーションを行ってチェックする

ということになる．

## 実現できたこと

先に何が実現できたのかについて紹介しておこう．

* 型レベル自然数・ブール値と，それらに対する演算
* 型安全かつ実行時の効率低下を最小限に抑えた固定長ベクトル・行列
* それらを使うための簡潔で直観的な記法・API
* 上記全てをライブラリとして実装（言語拡張ではない！）

百聞は一見にしかずということで，実際に固定長ベクトルを使ったコードをお見せしよう．

```fsharp
let v = vector (1, 2, 3)
// val v: Vector<int, S<S<S<Z>>>> = [| 1; 2; 3 |]

let a = v |> Vector.Get<2>.Invoke
// val a: int = 3

let b = v |> Vector.Get<3>.Invoke
// error FS0001: この式に必要な型は
//    'True'
// ですが、ここでは次の型が指定されています
//    'False'
```

いい感じの記法でベクトルを定義すると勝手に型とベクトルの長さが推論されて，いい感じに要素アクセスもできて，境界外ならコンパイルエラーになってくれる[^vector-err]！

[^vector-err]: コンパイルメッセージはちょっとわかりにくいかもしれない．要は静的アサーションの条件式が `False` を返したというエラーだ．もっと改善できないかは調査中

行列はどうだろう．

```fsharp
let m1 =
  matrix (
    (1, 2, 3),
    (4, 5, 6)
  )
// val m1: Matrix<int, S<S<Z>>, S<S<S<Z>>>>
// = [[1; 2; 3]
//    [4; 5; 6]]

let m2 =
  matrix (
    (1, 0),
    (0, 0),
    (0, 1)
  )
// val m2: Matrix<int, S<S<S<Z>>>, S<S<Z>>>
// = [[1; 0]
//    [0; 0]
//    [0; 1]]

let m3 = m1 |*| m2
// val m3: Matrix<int, S<S<Z>>, S<S<Z>>>
// = [[1; 3]
//    [4; 6]]

let m4 = m1 |*| m3
// error FS0001: 型が一致しません。
//    'Matrix<int,S<S<S<Z>>>,'a>'
// という指定が必要ですが、
//    'Matrix<int,S<S<Z>>,S<S<Z>>>'
// が指定されました。型 'S<Z>' は型 'Z' と一致しません
```

こちらもいい感じ．ちなみに `|*|` はベクトル同士の積を計算する演算子だ．

実用重視ということで，[`Vector`](http://fsprojects.github.io/FSharpPlus/reference/fsharpplus-data-vector.html) モジュールと [`Matrix`](http://fsprojects.github.io/FSharpPlus/reference/fsharpplus-data-matrix.html) モジュールには，コレクションとして当然用意されてほしい `map` などの関数が，F# の標準ライブラリと同じような命名規則で用意されている．
さらに `Functor` や `Applicative` などの FSharpPlus 組み込みの型クラスもデフォルトで対応している．気になったあなたは今すぐ FSharpPlus のプレリリース版をインストールして固定長ベクトルと行列を使ってみよう！

[`dotnet add package FSharpPlus --prerelease`](https://www.nuget.org/packages/FSharpPlus)

ひととおり紹介が済んだところで，ここからはこれらをどのように実現したのかを順番に解説していく．

## 型レベル自然数とそれに対する演算

ベクトル長や行列の次元を型で管理するためには，型レベル自然数が必要である．
ペアノ自然数を使って型レベルで自然数を作ると，まぁ次のようになるだろう．

```fsharp
type S<'n> = S of 'n
type Z     = Z

let three = S (S (S Z))
// val three: S<S<S<Z>>> = S (S (S Z))
```

表現自体は簡単なのだが，問題は演算をどのように実装するかだ．例えば，ペアノ算術上での加算は次のように定義されている．

$$
\begin{aligned}
  0 + x    &= x \\
  S(x) + y &= S (x + y) \\
\end{aligned}
$$

この加算を上の型レベル自然数に対して定義するには，どうにかして F# 上で型を再帰的に操作してあげる必要がある．F# で型を操作する（ある型から別の型を作る）には関数呼び出しを使うしかない（引数の型が入力，戻り値の型が出力）．この場合は引数の型に対するパターンマッチを行い，その結果に応じて戻り値の型を変えるような関数を作る必要がある．

型に対するパターンマッチとは，すなわちオーバーロード解決である．

F# では `inline` キーワードと SRTP を使うことでオーバーロードされた関数・演算子を定義することができる．例えば，F# において `+` という演算子は，右辺か左辺の型が `static member` として `+` を定義しているかどうかをコンパイル時にチェックして，解決先の実装を呼び出すコードをインライン展開するようになっている．

```fsharp
let inline (+) (x: ^T) (y: ^U) : ^V =
  ((^T or ^U): (static member (+): ^T * ^U -> ^V) x,y)

let a = 1 + 2
// int 型は組み込みで static member (+) を定義しているので使える
// val a: int = 3

type MyType = { value: int } with
  static member (+) (x: MyType, y: MyType) =
    { value = x.value + y.value }

let b = { value = 1 } + { value = 2 }
// ユーザ定義の MyType 型も static member (+) を定義してあるので使える
// val b: MyType = { value = 3 }
```

では，与えられた型レベル自然数の加算を行う演算子 `+^` を定義しよう．
上の例と同様に，型 `S<'n>` と `Z` それぞれに対応する `static member` を追加する．
再帰的に計算を行うには，`static member` の内部で `+^` を使って，再帰的にオーバーロード解決を起こさせてやればよい．
そういうわけで，型レベル自然数同士の加算は定義に忠実に素直に書けてしまう．

```fsharp
let inline ( +^ ) (x: ^X) (y: ^Y) =
  (^X: (static member ( +^ ): _*_->_) x,y)

type S<'n> with
  static member inline ( +^ ) (S x, y) = S (x +^ y)

type Z     with
  static member inline ( +^ ) (Z, y)   = y

let three = S (S Z) + S Z
/// val three: S<S<S<Z>>> = S (S (S Z))
```

実は加算以外は一筋縄では行かなかったりするのだが，それらに用いたテクニックについては明文化がなかなか難しいので割愛したい．気になる方は[実装](https://github.com/fsprojects/FSharpPlus/blob/master/src/FSharpPlus/TypeLevel/TypeNat.fs)を見てみてほしい．

## 型レベルブール値を用いた静的アサーション

さて，我々は型レベル自然数同士を比較して静的アサーションをしたいので，型レベルブール値とそれに対する演算も作ってあげる必要がある．ブール値は自然数と違って再帰的な構造になっていないので，実装は比較的簡単である．

```fsharp
type True = True
type False = False

let inline ( &&^ ) (x: ^X) (y: ^Y) =
  (^X: (static member ( &&^ ): _*_->_) x,y)

type True with
  static member ( &&^ ) (True, True)   = True
  static member ( &&^ ) (True, False)  = False

type False with
  static member ( &&^ ) (False, True)  = False
  static member ( &&^ ) (False, False) = False

let b = True &&^ False
// val b: False = False
```

これがあれば，自然数同士の比較を実装した上で，静的アサーションができる．

```fsharp
// 静的アサーション用の関数．引数の型が True に評価されることを要求する．
let inline Assert (_: True) = ()

type S<'n> with
  static member inline ( <^ ) (Z, S _) = True
  static member inline ( <^ ) (S x, S y) = x <^ y

type Z with
  static member inline ( <^ ) (_, Z) = False

Assert (S Z <^ S (S Z)) // OK
Assert (S (S Z) <^ S Z) // NG（コンパイルエラー）
```

ここでは `<` に相当する演算子 `<^` を実装したが，等価判定などのその他の比較演算子も同様に実装できる（ここでは割愛）．これで，

1. ベクトル長や行列の次元は型レベルリテラルで管理する（加減乗除は型レベル計算で行う）
2. 境界外アクセスなどの検出は型レベル計算で静的アサーションを行ってチェックする

の2つを行うための道具が揃ったことになる[^actual-impl]．

[^actual-impl]: なお，実際の FSharpPlus における[実装](https://github.com/fsprojects/FSharpPlus/blob/master/src/FSharpPlus/TypeLevel/TypeNat.fs)では，上で挙げたサンプルコードとは違う形で定義されている演算子が多いことをおことわりしておく．これは，これらの演算子を使ったインライン関数を定義した時に，「早すぎるオーバーロード解決」が起こって型変数に望まない形で制約がかかってしまうのを防ぐためのものである．具体的には，（実装が同じものを除いた）全ての種類の演算子をインライン関数でラップした[テストコード](https://github.com/fsprojects/FSharpPlus/blob/master/tests/FSharpPlus.Tests/TypeLevel.fs)のコンパイルがきちんと通るように定義してある

## 型レベル自然数から通常の自然数への変換，型レベル自然数のシングルトン値

なお，便利のために型レベル自然数から通常の自然数へ変換できるようにしておこう．
これも再帰的にオーバーロード解決を走らせるだけである．

```fsharp
// 型レベルの値を通常の値に変換するための関数
let inline RuntimeValue (x: ^X) = (^X: (static member RuntimeValue: ^X -> _) x)

type S<'n> with
  static member inline RuntimeValue (S x: S< ^X >) = 1 + RuntimeValue x

type Z with
  static member inline RuntimeValue Z = 0

let a = RuntimeValue (S (S (S Z)))
// val a: int = 3
```

`RuntimeValue` はインライン関数なので，実は `RuntimeValue (S (S (S Z)))` は 直接 `3` としてコンパイルされる．`1 + 1 + 1` のような処理が実行時に走ったりはしないので効率が良い．

また，型レベル自然数は型それ自身 `S<S<S<Z>>>` とその型を持つただ一つの値 `S (S (S Z))` の2つの形態がある．
F# では関数呼び出しによるオーバーロード解決でしか新しい型を作れないので，型レベル自然数の値の方を主に取り扱うことになるが，一方で型パラメータとして渡された場合など，値の部分を伴わない形で型レベル自然数を渡されることがある．
そのときに，型から対応する値を生成できれば都合がいい．対応する値はただ一つなので，**型レベル自然数のシングルトン値** と呼ぶことにしよう．

任意の型レベル自然数からそのシングルトン値を得る関数 `Singleton` も再帰的にオーバーロード解決をかけて簡単に定義できる．

```fsharp
// 型レベル自然数の型のみからシングルトン値を得る関数
let inline Singleton< ^X when ^X: (static member Singleton: ^X -> ^X) > =
  (^X: (static member Singleton: _ -> _) Unchecked.defaultof< ^X >)

type S<'n> with
  static member inline Singleton (_: S< ^X >) =
    S (Singleton< ^X >)

type Z with
  static member inline Singleton (_: Z) = Z

let b = Singleton<S<S<S<Z>>>>
// val b: S<S<S<Z>>> = S (S (S Z))
```

例によって「戻り値の型によってオーバーロードが決まる」タイプの関数なので，[12日の記事](/blog/2020-12-17-typeclass)で説明したように，欲しい戻り値の型をダミー引数として渡させることでオーバーロードを解決している．

また `Singleton` もインライン展開されるので `Singleton<S<S<S<Z>>>>` は直接 `S (S (S Z))` としてコンパイルされる．

これらの道具を使って，固定長のベクトルと行列を実装していくことになる．ただし，ベクトルと行列でやることはそんなに変わらないので，固定長ベクトルの実装についてのみ説明をする．

## 固定長ベクトルを実装，しかし……

道具が揃ってしまえばやることはシンプルである．

* 配列をラップして，新しくベクトル型を作る．
* ベクトル型では，要素の型に加えて，ベクトルの長さを型レベル自然数で持つようにする．
* ベクトルに対する演算を行う時に，型レベル自然数を使って，ベクトルの長さに関する制約を静的アサーションする．

ベクトルの長さが絡むような演算はいろいろ考えられるが，簡単なものとして要素へのアクセスを例として説明する．
これらを素直に実装すれば以下のようになる．

```fsharp
type Vector<'t, 'length> = {
  items:  't[]    // 要素を格納する配列
  length: 'length // 長さを表す型レベル自然数
}

module Vector =
  // 型レベル自然数 index を指定して，index 番目の要素を取り出す関数
  let inline get (index: ^index) (vec: Vector<'t, ^length>) : 't =

    // index と length を比較して，配列の範囲内へのアクセスかを静的にチェックする
    Assert (index <^ vec.length)

    // 実際に index 番目の要素を取得して返す
    vec.items.[RuntimeValue index]
```

これを使ってみよう．

```fsharp
let vec = { items = [| 1; 2; 3 |]; length = S (S (S Z)) }

let a = vec |> Vector.get (S (S Z))
// val a: int = 3

let b = vec |> Vector.get (S (S (S Z)))
// compilation error
```

う〜〜〜〜む．やりたいことはできているのだが，明らかな問題点が2つある．

1. ベクトルの作成時に型レベル自然数を手動で入力させているようでは型安全ではない．
2. 要素数が定数の時に `S (S (S Z))` などと書くのが面倒くさい．

そこで以下の2つを行って，それぞれの問題を解決したい．

1. タプルを受け取って，そのタプルの arity を数えつつベクトルを作成する関数 `vector` を作る．
2. Type Provider を使って，`3` といったリテラルから型レベル自然数を作れるようにする．また，型レベル自然数をそのまま受け取る関数に加えて，Type Provider を使ってリテラルを入力させるバージョンの関数を用意する．

1 については [以前の記事](https://cannorin.github.io/blog/2019/fsharp-advent.html) で詳しく解説しているので，そちらを参照していただきたい．記事中の「例1: タプルの arity を数える」と「例2: 同じ型のみのタプルをリストに変換する」を使えばすぐ作れてしまうことは分かっていただけると思う．

実際，`vector` は `CountTuple` と `TupleToList` を用いて次のように実装されている．

```fsharp
let inline vector (definition: '``a * 'a * .. * 'a``) : Vector<'a, 'n> =
  { items = Array.ofList (TupleToList.Invoke definition);
    length = CountTuple.Invoke definition }
```

本記事では 2 について説明する．

## Type Provider を用いて型レベル自然数の入力をシンプルにする

Type Provider 自体の説明や，Type Providers の作り方に関する一般的な説明は知っているものとして，ここではしない．

Type Provider を使って型レベル自然数を作ることはそこまで難しくない．生成する型レベル自然数に対して，適切な `FSharp.Quotations.Expr` を作ってあげて，それを使ってあげればよい．FSharpPlus では以下のようにして `FSharp.Quotations.Expr` を構成している．

```fsharp
module internal ProviderUtils =
  let private sTy = typedefof<S<Z>>.GetGenericTypeDefinition()
  let private zTy = typeof<Z>
  let mutable private memot = Map.ofList [0, zTy]
  let rec createNatType n =
    match memot |> Map.tryFind n with
    | Some x -> x
    | None ->
      if n > 0 then
        let x = sTy.MakeGenericType(createNatType(n-1))
        memot <- memot |> Map.add n x
        x
      else
        zTy

  let mutable private memov = Map.ofList [0, <@@ Z @@>]
  let rec createNatValue n =
    match memov |> Map.tryFind n with
    | Some x -> x
    | None ->
      if n > 0 then
        let uci = createNatType n |> FSharpType.GetUnionCases
                                  |> Seq.head
        let x = Expr.NewUnionCase(uci, [createNatValue(n-1)])
        memov <- memov |> Map.add n x
        x
      else
        <@@ zTy @@>
```

この2つが出来てしまえば，例えば `ProvidedMethod` などで雑に作ってあげてもよいのだが，しかし

```fsharp
let three = TypeNat.Create<3>()
```

などというのは最後の `()` がなんとも気持ち悪いし，型名を書かないといけないときは結局 `S<S<S<Z>>>` と書かないといけないのも嫌だ．
そこで，`TypeNat<3>` という型自体が `S<S<S<Z>>>` を継承するようにして[^inherit]，`S<S<S<Z>>>` の代わりに `TypeNat<3>` と書けるようにした上で，

```fsharp
let three = TypeNat<3>.Value
```

として値も作れるようにする．

[^inherit]: レコードやヴァリアントは普通は継承してクラスを作ったりはできないのだが，Type Provider の `ProvidedType` の `baseType` にはできてしまう

これは `DefineStaticParameters` 内で返す `ty` を差し替えてしまえばよいだけなので，簡単に実装できる．

```fsharp
[<EditorBrowsable(EditorBrowsableState.Never); TypeProvider>]
type NatProvider (cfg) as this =
  inherit TypeProviderForNamespaces(cfg)
  let thisAsm = Assembly.GetExecutingAssembly()
  let root = "FSharpPlus.TypeLevel"
  let baseTy = typeof<obj>
  let prm = [ProvidedStaticParameter("value", typeof<int>)]
  let ty = ProvidedTypeDefinition(thisAsm, root, "TypeNat", Some baseTy)
  do ty.DefineStaticParameters(
      parameters = prm,
      instantiationFunction = (fun tyName prmValues ->
        match prmValues with
          | [| :? int as value |] ->
            if value < 0 then
              failwith "value is negative"
            let n = ProviderUtils.createNatValue value in
            let ty = ProvidedTypeDefinition(thisAsm, root, tyName, baseType = Some n.Type)
            let valuet = ProvidedProperty("Value", n.Type, isStatic = true, getterCode = fun _ -> Expr.Coerce(n, n.Type))
            let sing = ProvidedMethod("Singleton", [ ProvidedParameter("defaultValue", ty)], ty, (fun _ -> Expr.Coerce(n, ty)), isStatic = true)
            valuet.AddXmlDoc <| sprintf "The value-level representation of type-level natural '%i'." value
            ty.AddMember valuet
            ty.AddMember sing
            ty.AddXmlDoc <| sprintf "Type-level natural '%i'." value
            ty
          | _ -> failwith "unexpected parameter values"
        )
      )
  do this.AddNamespace(root, [ty])
```

問題なのが `vec |> Vector.Get<3>` のようなことをしたい場合だ．Type Provider はインラインメソッドを provide できないので，`Vector.Get<3>(vec)` のようなメソッドを生やすことはできない．対処法はいくつかあるが，綺麗に書けるようなものは1つしか見つけられなかった．

まず，次のような型を作っておく．

```fsharp
// この属性は IDE の補完候補に出てこないようにするためのもの
[<EditorBrowsable(EditorBrowsableState.Never)>]
module VectorProviderHelpers =
  // 中身が空のクラス
  type Get<'i>() = class end
```

その上で，次のような拡張メソッドを用意しておく．

```fsharp

[<Extension>] // この型に生えている静的メソッドを拡張メソッドとして扱う属性
[<EditorBrowsable(EditorBrowsableState.Never)>] // 同上
type VectorProviderHelpersImpl =

  [<Extension>]
  static member inline Invoke (_: unit -> Get< ^i >, vec) =
    Vector.get Singleton< ^i > vec
```

最後に Type Provider では，例えば `Vector.Get<3>` に対して次のようなメソッドを生成するようにする．

```fsharp
static member Get<3>() = new Get<S<S<S<Z>>>>();
```

するとどうなるか．仮にユーザが `let x = Vector.Get<3>()` としたとすると，`x` には `Get<S<S<S<Z>>>>` 型の値が代入される．
しかし，最後の `()` を書かない場合，`Vector.Get<3>` という式は全体として `unit -> Get<S<S<S<Z>>>>` という型を持つ．

ここで，先ほど我々は型 `unit -> Get<S<S<S<Z>>>>` に対して `Invoke` という拡張メソッドを定義した[^ext-method]．
`Invoke` は `Get<_>` に加えてベクトルを受け取り，`Get<_>` の中に入っている型レベル自然数のシングルトンを取得して，合わせて `Vector.get` を呼び出している．つまり，

```fsharp
let x1 = vec |> Vector.Get<3>.Invoke

let x2 = vec |> Vector.get (S (S (S Z)))
```

この2つは全く同じように働く（前者が後者に変換される）のだ．これで，型レベル自然数を書くのが面倒な問題が解決した．

[^ext-method]: 矢印型（関数型）にも拡張メソッドを生やせるのは私もビックリした

## まとめ・課題

今まで使ってきた SRTP と Type Provider はどちらもコンパイル時に処理されるので，この `Vector` の実行時オーバーヘッドとなりうる部分はラップされた配列 `items` を取り出す処理だけである．リフレクションや仮想呼び出しなどは一切使っていない．よって，配列の代わりに `Vector` を使うことによるオーバーヘッドはほぼ最小限に抑えられている．

それに加えて，`vector (1, 2, 3)` や `Vector.Get<2>.Invoke` のような簡潔で直観的な API を用意することが出来た．F# ユーザにとって使いやすいものになっていると言えるだろう．

そしてこのようなものを言語拡張に頼らず F# 自体の言語機能だけで実装できてしまうことは，F# の言語機能の隠された「強さ」を示している[^turing-complete]．

[^turing-complete]: 以前，F# 上で[型レベルラムダ計算](https://github.com/cannorin/FSharp.TypeLevel/)を実装した．おそらく F# の型システムは Turing 完全である

一方，課題もある．n = 100 程度から型レベル自然数同士の演算が導入する制約の個数が F# コンパイラの内部の制限を超えてしまうため，長さが100程度以上のベクトルを作ってもうまく使うことができない．これについては今後時間ができたら改善を試みてみたい．

## はい

よかったですね

----

[今年の F# Advent Calendar](https://qiita.com/advent-calendar/2020/fsharp) はたくさんの記事が集まってすごかったですね．私も精進しなくては……

参加した皆様方，お疲れ様でした．
