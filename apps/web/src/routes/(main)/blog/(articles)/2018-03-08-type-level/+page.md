---
title: F# で型レベルプログラミング
description: 今F# で依存型をシミュレートしようと頑張ってるのだけど、その途中でちょっと面白いことができたのでそこだけ切り出してまとめておく
date: !!timestamp 2018-03-08T02:08:49+09:00
category: Programming
tags: ["F#", "SRTP"]
---

今 [F# で依存型をシミュレートしようと頑張ってる](https://github.com/cannorin/FSharp.Dependent) のだけど、その途中でちょっと面白いことができたのでそこだけ切り出してまとめておく。

F# で型レベルプログラミングができたのだ。

(依存型シミュレートはそれなりに納得できる形になったら記事にするよ！)

いつものように inline functions と SRTP を悪用していくわけだけど、F# の型引数にはある望まざる性質があるので、型を値として受け渡しするラッパを用意しておく。

```fsharp
[<Struct>]
type Ty<'Type> =
  override __.ToString() =  // 型の表示用
    typeof<'Type>.ToString()
                 .Replace("FSI_0001+", "")
                 .Replace("[", "<")
                 .Replace("]", ">")
                 .Replace("`1", "")
                 .Replace("`2", "")

let inline ty< ^Type > : Ty< ^Type > = Ty()
```

こいつは空っぽの struct なので、値レベルでは何もしない。ただ型を受け渡すだけの存在だ。

で、 F# で型の評価を進める、つまりある型から別の型を作る方法はあまり多くなくて、そのうち SRTP で制約として書けるものは「メンバを生やす」方法のみだ。

そこで、型 `A` に `Ty<A> -> Ty<B>` なるメンバ `eval` を生やすことにする。自明な例から行ってみよう。

```fsharp
type True = True with
  static member inline eval (_: Ty<True>) = ty<True>

type False = False with
  static member inline eval (_: Ty<False>) = ty<False>
```

また、 F# は型の評価を暗黙的に進めてくれないので、項の評価ですよと言いくるめて押し通す。

```fsharp
let inline eval (x: Ty< ^A >) : Ty< ^B > =
  (^A: (static member inline eval: Ty< ^A > -> Ty< ^B >) x)
```

inline functions はコンパイル時に展開されるし、 `eval` は型の変形しかしないので、実行時には何の処理も行われない。

で、`True` も `False` も正規形なので、 `eval`` しようがそのままだ。

```fsharp
let true_ = eval ty<True>
true_ |> printfn "%A" // True

let false_ = eval ty<False>
false_ |> printfn "%A" // False
```

また、[church encoding](https://en.wikipedia.org/wiki/Church_encoding) を知ってると話が早いのだけど、真偽値自体に car/cdr の機能を持たせておくととても便利である。どう便利かはすぐにわかる。

```fsharp
type True with
  static member inline ifThenElse (_: Ty<True>, x, y) = x

type False with
  static member inline ifThenElse (_: Ty<False>, x, y) = y
```

`True` が car、`False` が cdr の機能を持つ。

これを使うと、`Not` が書ける。

```fsharp
type Not<'a> = Not of 'a with
  static member inline eval (_: Ty<Not< ^A >>) : Ty< ^B >
    when ^A: (static member eval: Ty< ^A > -> Ty< ^Bool >) = // (1)
    (^Bool: (static member ifThenElse: Ty< ^Bool > * _ * _ -> Ty< ^B >) ty< ^Bool >, ty<False>, ty<True>) // (2)
```

**ここが今回の記事の要だ！！** `Not< ^A >` の `eval` において、

1. まず `Ty< ^A >` を `eval` してその結果 `Ty< ^Bool >` を取り出す。
2. `^Bool` がメンバ `ifThenElse` を持っているものとして、それを `(ty<False>, ty<True>)` に適用する。

ここで、もし `^Bool` が `True` だったら `ifThenElse` は car であり、`ty<False>` が取り出される。`False` だったらその逆になって、どちらでもなかったらコンパイルエラーになる。

```fsharp
let notTrue = eval ty<Not<True>>
notTrue |> printfn "%A" // False

let notNotTrue = eval ty<Not<Not<True>>> // 先に中身を eval するので入れ子も OK
notNotTrue |> printfn "%A" // True

// let error1 = eval ty<Not<bool>>
// ^ error FS0001: The type 'bool' does not support the operator 'eval'

type BadType = BadType with
  static member eval (_: Ty<BadType>) = ty<BadType>

// let error2 = eval ty<Not<BadType>>
// ^ error FS0001: The type 'BadType' does not support the operator 'ifThenElse'
```

つまり `eval` 結果の型のメンバ `ifThenElse` の有無によって型の型(カインド)を判別している。(Haskell では同じことを`-XDataKinds` でやる)

これが理解できれば、`And` も `Or` も同じことをするだけだ。

```fsharp
type And<'a, 'b> = And of 'a * 'b with
  static member inline eval (_: Ty<And< ^A, ^B >>) : Ty< ^C >
    when ^A: (static member eval: Ty< ^A > -> Ty< ^A' >)
     and ^B: (static member eval: Ty< ^B > -> Ty< ^B' >) =
    (^A': (static member ifThenElse: _*_*_ -> Ty< ^C >) ty< ^A' >,ty< ^B' >,ty<False>)

type Or<'a, 'b>  = Or of 'a * 'b with
  static member inline eval (_: Ty<Or< ^A, ^B >>) : Ty< ^C >
    when ^A: (static member eval: Ty< ^A > -> Ty< ^A' >)
     and ^B: (static member eval: Ty< ^B > -> Ty< ^B' >) =
    (^A': (static member ifThenElse: _*_*_ -> Ty< ^C >) ty< ^A' >,ty<True>,ty< ^B' >)

let x = eval ty<And<Not<False>, Or<Not<True>, True>>>
// not false && (not true || true)
x |> printfn "%A" // True
```

また、 if-then-else を型レベルに持ち上げることすらできる。

```fsharp
ype IfThenElse<'_bool, 'a, 'b> = IfThenElse of '_bool * 'a * 'b with
  static member inline eval (_: Ty<IfThenElse< ^X, ^A, ^B>>) : Ty< ^EvalAorB >
    when ^X: (static member eval: Ty< ^X > -> Ty< ^Bool >) =
    (^Bool: (static member ifThenElse: _*_*_ -> Ty< ^EvalAorB >) ty< ^Bool >,eval ty< ^A >,eval ty< ^B >)
    // 制約に絡まないなら eval は値レベルでやってもよい

// 適当な型定数
type A = A with static member eval _ = ty<A>
type B = B with static member eval _ = ty<B>

type Code =
  IfThenElse<
    Or<
      Not<True>,
      IfThenElse<
        Or<
          Not<True>, False>,
        BadType, Not<False>>>, // それぞれの型の一致は見ない。どうせ静的に決まる
    A, B>

let result = eval ty<Code>
result |> printfn "%A" // A
```

いよいよプログラミングらしくなってきた。

自然数も同様で、こちらも church encoding 的に、型自体に加算の機能をもたせる。

```fsharp
type Z = Z with
  static member eval (x: Ty<Z>) = x
  static member inline add (_: Ty<Z>, y) = eval y

type S<'n> = S of 'n with
  static member inline eval (_: Ty<S< ^N >>) : _
    when ^N: (static member eval: Ty< ^N > -> Ty< ^N' >) = ty<S< ^N' >>
  static member inline add (_: Ty<S< ^X >>, _: Ty< ^Y >) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >)
     and ^X': (static member add: Ty< ^X' > * Ty< ^Y > -> Ty< ^Z >) =
    ty<S< ^Z >>

type Add<'x, 'y> = Add of 'x * 'y with
  static member inline eval (_: Ty<Add< ^X, ^Y>>) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >) =
    (^X': (static member add: _*_ -> _) ty< ^X' >,ty< ^Y >)

type One = S<Z>
type Three = Add<One, Add<One, One>>
type Five = S<Add<Three, One>>

let five = eval ty<Five>
five |> printfn "%A" // S<S<S<S<S<Z>>>>>
```

減算はちょっと面倒だが、 `S< ^X > - S< ^Y >` と `^X - Z` だけを定義しておけば結果が負になるような減算は型エラー(メンバが見つからない)にすることができる。

```fsharp
type Z with
  static member inline sub (x, _: Ty<Z>) = eval x

type S<'n> with
  static member inline sub (_: Ty<S< ^X> >, _: Ty<S< ^Y >>) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >)
     and ^Y: (static member eval: Ty< ^Y > -> Ty< ^Y' >)
     and ^Y': (static member sub: Ty< ^X' > * Ty< ^Y' > -> Ty< ^Z >) =
    ty< ^Z >

type Sub<'x, 'y> = Sub of 'x * 'y with
  static member inline eval (_: Ty<Sub< ^X, ^Y>>) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >)
     and ^Y: (static member eval: Ty< ^Y > -> Ty< ^Y' >) =
    (^Y': (static member sub: _*_ -> _) ty< ^X' >,ty< ^Y' >)

type Two = Sub<Three, One>
type Six = Sub<Add<Five, Two>, One>

let six = eval ty<Six>
six |> printfn "%A" // S<S<S<S<S<S<Z>>>>>>

// let error = eval ty<Sub<Two, Six>>
// ^ Type constraint mismatch. The type 'Ty<Z>' is not compatible with type 'Ty<S<'a>>'
```

大小比較も同様。

```fsharp
type Z with
  static member inline gt (_: Ty<S<_>>, _: Ty<Z>) = ty<True>
  static member inline gt (_: Ty<Z>, _) = ty<False>

type S<'n> with
  static member inline gt (_: Ty<S< ^X >>, _: Ty<S< ^Y >>) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >)
     and ^Y: (static member eval: Ty< ^Y > -> Ty< ^Y' >)
     and (^X' or ^Y'): (static member gt: Ty< ^X' > * Ty< ^Y' > -> Ty< ^Z >) =
    ty< ^Z >

type GT<'x, 'y> = GT of 'x * 'y with
  static member inline eval (_: Ty<GT< ^X, ^Y>>) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >)
     and ^Y: (static member eval: Ty< ^Y > -> Ty< ^Y' >) =
    ((^X' or ^Y'): (static member gt: _*_ -> _) ty< ^X' >,ty< ^Y' >)

type LT<'x, 'y> = GT of 'x * 'y with
  static member inline eval (_: Ty<LT< ^X, ^Y>>) : _
    when ^X: (static member eval: Ty< ^X > -> Ty< ^X' >)
     and ^Y: (static member eval: Ty< ^Y > -> Ty< ^Y' >) =
    ((^X' or ^Y'): (static member gt: _*_ -> _) ty< ^Y' >,ty< ^X' >)

let y = eval ty<And<GT<Six, Three>, LT<Sub<Five, One>, Add<One, Three>>>>

y |> printfn "%A" // False
```

等値判定は正規形の型に判定関数を定義して、`eval` したあとそれを呼び出せばよいが、煩雑な割に別に結果は面白くないので省略する。

さて、 F# では制約解決器で無限ループを起こさせることができて(制約で自分自身を要求することで起こせる)、

```
error FS0465: Type inference problem too complicated (maximum iteration depth reached). Consider adding further type annotations.
```

というエラーメッセージが出る。この事実は、 F# の型レベル言語が turing complete であることを示唆している。例えば型レベルで de Bruijn indexed な型無しラムダ計算をできるのではないだろうか？そのうち、やってみるかも……(もしやってみてできたら教えてね)
