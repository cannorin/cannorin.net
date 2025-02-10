---
title: F# で型クラス
description: F# の言語機能の隠された真の力をお伝えするために、とりあえずは Haskell の do-notation のようなものを実現してみせよう
date: !!timestamp 2018-02-14T03:54:24+09:00
category: Programming
tags: ["F#", "SRTP"]
---

F# は OCaml を .NET に乗っけて色々足した言語だが、その過程で失ってしまったものもたくさんあり、 その中でも特に痛いのは functor がないことだ。

そして F# には高階型も型クラスもないので、われわれは例の interface でなんとか生き延びざるを得ない……

……わけでもない。

F# の言語機能の隠された真の力をお伝えするために、とりあえずは Haskell の do-notation のようなものを実現してみせよう。

まず、名前を言ってはいけない例のあの概念を表す "型クラス" を作る。

```fsharp
[<Struct>]
type MonadClass<'a, 'Ma, 'Mb> = {
  Bind: ('a -> 'Mb) -> 'Ma -> 'Mb
  Return: 'a -> 'Ma
}
```

コンテナ型 `M` に対する bind/return の実装を、型 `MonadClass<'a, M<'a>, M<'b>>` の値で持つことになる。

次に、既存の型を "インスタンス化" しておく。今回は `'a option` と `Result<'a, 'b>` を使う。

```fsharp
type MonadBuiltin = MonadBuiltin with
  static member MonadImpl (_: option<_>) =
    { Bind = Option.bind; Return = Some }

  static member MonadImpl (_: Result<_,_>) =
    { Bind = Result.bind; Return = Ok }
```

ダミーの引数でコンテナ型を明示的に指定させるのは、 F# コンパイラがオーバーロードを自動で解決できるようにするため。

たとえば引数を `unit` などにしてしまうと、どのオーバーロードを呼べば目的のコンテナ型に対する実装が手に入るのかが判断できなくなってしまう。

このビルトイン実装は後ほど使う。

そして、`^Builtin` 型もしくはコンテナ型 `^Ma` から bind/return の実装を取り出すインライン関数 `getImpl` を定義する。

インライン関数では **Statically Resolved Type Parameters (SRTP)** を型パラメータに取ることができて、通常の型パラメータが `'T` と 表記されるのに対して SRTP は `^T` と表記される。

```fsharp
let inline getImpl (builtin: ^Builtin)
                   (dummy: MonadClass< ^a, ^Ma, ^Mb >)
                   : MonadClass< ^a, ^Ma, ^Mb > =
  ((^Builtin or ^Ma):
     (static member MonadImpl: ^Ma -> MonadClass< ^a, ^Ma, ^Mb >) (Unchecked.defaultof< ^Ma >)
  )
```

SRTP は型が持っているメンバに対して制約をかけることができる。ここでは、メンバ `MonadImpl` を型 `^Builtin` もしくは `^Ma` が持っていることを要求している。

また SRTP はコンパイル時に消えてしまうので、`^Ma` と `^Mb` はここでは高階型ではないのだが、インライン展開後にはコンテナ型が具体化されて、結果的に高階型*だったことになる*。

ここでも `MonadBuiltin` と同様のテクニックで、ダミーの引数を使って入手する実装の型を指定している。

先ほど定義しておいたビルトイン実装と `getImpl` を組み合わせて、任意のコンテナ型に対する bind/return を定義する。

```fsharp
let inline bind_ (f: ^a -> ^Mb) (x: ^Ma) : ^Mb =
  (getImpl MonadBuiltin
           (Unchecked.defaultof<MonadClass< ^a, ^Ma, ^Mb >>)
  ).Bind f x

let inline return_ (x: ^a) : ^Ma =
  (getImpl MonadBuiltin
           (Unchecked.defaultof<MonadClass< ^a, ^Ma, _ >>)
  ).Return x
```

ここでもインライン関数を使って SRTP で制約をかけており、コンテナ型 `^Ma` は `MonadBuiltin` で bind/return をすでに実装してあるか、自分でメンバに実装を持っていなければならない。

最後に、モナ……コンピューテーション式を定義。

`do` は残念ながら予約語なので恐怖の the M-word で代用する。

```fsharp
type MonadBuilder () =
  member inline __.Bind (x, f) = bind_ f x
  member inline __.Return x = return_ x
  member inline __.ReturnFrom mx = mx

let monad = MonadBuilder ()
```

できた！

では、動かしてみよう。

```fsharp
monad {
  let! a = Some 21
  let! b = Some 2
  return a * b
} |> printfn "%A"

// Some 42

monad {
  let! a = Ok 42
  let! b = Error "err"
  return sprintf "%i, %i" a b
} |> printfn "%A"

// Error "err"
```

自作型を定義して、型クラス `MonadClass` のインスタンスにする。

```fsharp
type YesNo<'a> = Yes of 'a | No with
  static member MonadImpl(_: YesNo<'a>) =
    {
      Bind = fun f -> function Yes x -> f x | No -> No
      Return = Yes
    }
```

同じように使える。

```fsharp
monad {
  let! a = Yes 21
  let! b = Yes 2
  return a = b
} |> printfn "%A"

// Yes false
```

なお、 orphan instances は type extension で外部モジュールの型に追加したメンバでは SRTP のメンバ制約を満たすことができないことによって（偶然）防がれている。

外部モジュールの型を型クラスのインスタンスにするには、型クラスの定義と同時にビルトイン実装するか、それ自身で実装を持っていなければならない。

どちらもできないときは Haskell の場合と同様に、ラッパ型を作って包むしかない。
