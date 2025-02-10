---
title: 任意長のタプルをサポートする SRTP 制約の書き方
description: F# の SRTP で任意長のタプル型を構築・操作する方法を解説
date: !!timestamp 2019-12-25T00:00:00.0000000+09:00
category: Programming
tags: ["F#", "SRTP"]
---

この記事は [以前 Qiita に投稿した記事](https://qiita.com/cannorin/items/aaf6abb2a7c1bc7793d4) の転載です．

------

あんまり一般受けするようなネタが思いつかなかったので，SRTP をゴリゴリ書いてる人向けの記事になってしまいました．ごめんなさい……

FSharpPlus で現在開発中の，[型レベルリテラルでの依存型エミュレーション](https://github.com/fsprojects/FSharpPlus/pull/192) で用いた技法です．

## タプル型の内部表現

F# においてタプル型は，

* 7-tuple までは `System.Tuple` の1〜7個版を用いる．
* 8-tuple 以上は ```Sytem.Tuple`8``` の8個目に，8番目以降の要素をネストさせて入れる．ちょうど 8-tuple の場合は，8番目は ```System.Tuple`1``` に入れる．

という内部表現になっている．例えば，

* `int*int*int` は ```System.Tuple`3[System.Int32,System.Int32,System.Int32]```
* `int*int*int*int*int*int*int*int` は ```System.Tuple`8[.., System.Tuple`2[System.Int32, System.Int32]]```

となる．単純な型レベルリストになっていないので SRTP で分解・構成するのは難しい．

しかも面倒なことに，F# の型システム上ではタプルと ```System.Tuple``` による表現は **8-tuple 以上の時のみ** 区別される．つまり，以下のようになる:

```fsharp
> let (a,b,c) = System.Tuple<_,_,_>(1,2,3);;
val c : int = 3
val b : int = 2
val a : int = 1

> let (a,b,c,d,e,f,g,h) = System.Tuple<_,_,_,_,_,_,_,_>(1,2,3,4,5,6,7,System.Tuple<_>(8));;

  let (a,b,c,d,e,f,g,h) = System.Tuple<_,_,_,_,_,_,_,_>(1,2,3,4,5,6,7,System.Tuple<_>(8));;
  ------------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

/home/alice/stdin(17,25): error FS0001: This expression was expected to have type
    ''a * 'b * 'c * 'd * 'e * 'f * 'g * 'h'
but here has type
    'System.Tuple<int,int,int,int,int,int,int,System.Tuple<int>>'

```

つまり，```Sytem.Tuple`8``` で n-tuple (n>7) の内部表現を作っても，それを n-tuple 型として扱うことはできない．

## 黒魔術 `retype`

そこで，undocumented な機能である inline IL を使って，内部的に同一であるような型を無理やり同一視する．

inline IL は `(# .. #)` で囲った中に直接 IL やその他の低レベル命令を書ける機能で，本来は標準ライブラリである `FSharp.Core` の内部でしか使うことができない．

```fsharp
#nowarn "0042"
let inline internal retype (x: 'T) : 'U =
  (# "" x: 'U #)
```


この関数 `retype` は，`'T` 型の値 `x` を無理やり `'U` 型として解釈する．キャストを行うわけではない (=型の内部表現を変えるわけではない) ので，OCaml の `Obj.magic` に近い挙動だ．

これを使ってやれば先ほどの例を動くようにできる．

```fsharp
> let (a:int,b:int,c:int,d:int,e:int,f:int,g:int,h:int) =
-   retype <| System.Tuple<_,_,_,_,_,_,_,_>(1,2,3,4,5,6,7,System.Tuple<_>(8));;
val h : int = 8
val g : int = 7
val f : int = 6
val e : int = 5
val d : int = 4
val c : int = 3
val b : int = 2
val a : int = 1
```

ただし，`val inline internal retype : x:'T -> 'U` なので，変換先の型がわかっている必要があり，それを注釈で明示してあげないといけない．

## タプルを分解する

タプルを構成する方法はわかったので，分解もしてみよう．

まず，n-tuple (n>7) 以上全てにマッチするオーバーロードを書くために，以下のヘルパー関数を導入する．

```fsharp
let inline whenNestedTuple (t: 't) =
  (^t: (member Item1: 't1) t), (^t: (member Item2: 't2) t), (^t: (member Item3: 't3) t),
  (^t: (member Item4: 't4) t), (^t: (member Item5: 't5) t), (^t: (member Item6: 't6) t),
  (^t: (member Item7: 't7) t), (^t: (member Rest: 'tr) t)

// val inline whenNestedTuple :
//   t: ^t -> 't1 * 't2 * 't3 * 't4 * 't5 * 't6 * 't7 * 'tr
//     when  ^t : (member get_Item1 :  ^t -> 't1) and
//           ^t : (member get_Item2 :  ^t -> 't2) and
//           ^t : (member get_Item3 :  ^t -> 't3) and
//           ^t : (member get_Item4 :  ^t -> 't4) and
//           ^t : (member get_Item5 :  ^t -> 't5) and
//           ^t : (member get_Item6 :  ^t -> 't6) and
//           ^t : (member get_Item7 :  ^t -> 't7) and
//           ^t : (member get_Rest :  ^t -> 'tr)
```

これは，```System.Tuple`8``` には7番目の要素までに対応する `Item1` ~ `Item7` というプロパティと8番目の要素が入った `Rest` というプロパティがあることを利用して，それぞれを分解するための関数だ．
わざわざ member constraints を使って書いているのは，SRTP は内部表現の型のみを見るので，8-tuple でも 9-tuple でも使えるからだ．

```fsharp
> whenNestedTuple (1,2,3,4,5,6,7,8,9);;
val it : int * int * int * int * int * int * int * (int * int) =
  (1, 2, 3, 4, 5, 6, 7, (8, 9))
```

あとは 8-tuple 以上のケースを `whenNestedTuple` を使ったオーバーロードにマッチさせて，いつものように SRTP を書いていくだけだ．

## 例1: タプルの arity を数える

```fsharp
type CountTuple =
  static member inline Invoke xs : int =
    let inline call_2 (a: ^a, b: ^b) = ((^a or ^b) : (static member CountTuple: _*_ -> _) b, a)
    let inline call (a: 'a, b: 'b) = call_2 (a, b)
    call (Unchecked.defaultof<CountTuple>, xs)

  static member inline CountTuple (t: 't, ct: ^CountTuple) =
    let _,_,_,_,_,_,_,tr : _*_*_*_*_*_*_* ^TR = whenNestedTuple t
    7 + ((^TR or ^CountTuple): (static member CountTuple: _*_->_) tr,ct)

  static member inline CountTuple (_: Tuple<_>, _: CountTuple) = 1
  static member inline CountTuple ((_, _), _: CountTuple) = 2
  static member inline CountTuple ((_, _, _), _: CountTuple) = 3
  static member inline CountTuple ((_, _, _, _), _: CountTuple) = 4
  static member inline CountTuple ((_, _, _, _, _), _: CountTuple) = 5
  static member inline CountTuple ((_, _, _, _, _, _), _: CountTuple) = 6
  static member inline CountTuple ((_, _, _, _, _, _, _), _: CountTuple) = 7
```

使用例:

```fsharp
> CountTuple.Invoke (1,2,3,4,5);;
val it : int = 5

> CountTuple.Invoke (1,2,3,4,5,6,7,8,9,0,1,2);;
val it : int = 12
```

## 例2: 同じ型のみのタプルをリストに変換する

```fsharp
type TupleToList =
  static member inline Invoke xs : 'x list =
    let inline call_2 (a: ^a, b: ^b) = ((^a or ^b) : (static member TupleToList: _*_ -> _) b, a)
    let inline call (a: 'a, b: 'b) = call_2 (a, b)
    call (Unchecked.defaultof<TupleToList>, xs)

  static member inline TupleToList (t: 't, ct: ^TupleToList) =
    let t1,t2,t3,t4,t5,t6,t7,tr : _*_*_*_*_*_*_* ^TR = whenNestedTuple t
    t1::t2::t3::t4::t5::t6::t7::((^TR or ^TupleToList): (static member TupleToList: _*_->_) tr,ct)

  static member inline TupleToList (x: Tuple<_>, _: TupleToList) = [x.Item1]
  static member inline TupleToList ((x1,x2), _: TupleToList) = [x1;x2]
  static member inline TupleToList ((x1,x2,x3), _: TupleToList) = [x1;x2;x3]
  static member inline TupleToList ((x1,x2,x3,x4), _: TupleToList) = [x1;x2;x3;x4]
  static member inline TupleToList ((x1,x2,x3,x4,x5), _: TupleToList) = [x1;x2;x3;x4;x5]
  static member inline TupleToList ((x1,x2,x3,x4,x5,x6), _: TupleToList) = [x1;x2;x3;x4;x5;x6]
  static member inline TupleToList ((x1,x2,x3,x4,x5,x6,x7), _: TupleToList) = [x1;x2;x3;x4;x5;x6;x7]
```

使用例:

```fsharp
> TupleToList.Invoke (1,2,3);;
val it : int list = [1; 2; 3]

> TupleToList.Invoke (1,2,3,4,5,6,7,8,9);;
val it : int list = [1; 2; 3; 4; 5; 6; 7; 8; 9]
```

## 例3: 型レベル自然数に応じた arity のタプルを作る

`retype` を使ってタプルを構成する例．

```fsharp
type S<'a> = S of 'a with static member Succ (S n) = S (S n)
type Z = Z with static member Succ Z = S Z

let inline succ (n: ^n) = (^n: (static member Succ:_->_) n)

type ArrayToTuple =
  static member inline Invoke (xs: 'x[], n, ?index) =
    let inline call_2 (_a: ^a, b: ^b) = ((^a or ^b): (static member ArrayToTuple:_*_*_->_) xs,b,defaultArg index 0)
    let inline call (a: 'a, b: 'b) = call_2 (a, b)
    call (Unchecked.defaultof<ArrayToTuple>, n) |> retype

  static member inline ArrayToTuple (xs:_[],S(S(S(S(S(S(S(S(n)))))))), i) =
    Tuple<_,_,_,_,_,_,_,_>(
      xs.[i],xs.[i+1],xs.[i+2],xs.[i+3],xs.[i+4],xs.[i+5],xs.[i+6],
      ArrayToTuple.Invoke(xs,succ n,i+7) // ここで S n とすると "早すぎるオーバーロード解決" が起こってしまう
    )

  static member inline ArrayToTuple (xs:_[], S Z, i) = Tuple<_>(xs.[i])
  static member inline ArrayToTuple (xs:_[], S (S Z), i) = (xs.[i], xs.[i+1])
  static member inline ArrayToTuple (xs:_[], S (S (S Z)), i) = (xs.[i], xs.[i+1], xs.[i+2])
  static member inline ArrayToTuple (xs:_[], S (S (S (S Z))), i) = (xs.[i], xs.[i+1], xs.[i+2], xs.[i+3])
  static member inline ArrayToTuple (xs:_[], S (S (S (S (S Z)))), i) = (xs.[i], xs.[i+1], xs.[i+2], xs.[i+3], xs.[i+4])
  static member inline ArrayToTuple (xs:_[], S (S (S (S (S (S Z))))), i) = (xs.[i], xs.[i+1], xs.[i+2], xs.[i+3], xs.[i+4], xs.[i+5])
  static member inline ArrayToTuple (xs:_[], S (S (S (S (S (S (S Z)))))), i) = (xs.[i], xs.[i+1], xs.[i+2], xs.[i+3], xs.[i+4], xs.[i+5], xs.[i+6])
```

使用例:

```fsharp
> let (a:int,b:int,c:int) = ArrayToTuple.Invoke ([|1;2;3|], S(S(S(Z))));;
val c : int = 3
val b : int = 2
val a : int = 1


> let (a:int,b:int,c:int,d:int,e:int,f:int,g:int,h:int,i:int,j:int) =
-   ArrayToTuple.Invoke ([|1;2;3;4;5;6;7;8;9;10|], S(S(S(S(S(S(S(S(S(S(Z)))))))))));;
val j : int = 10
val i : int = 9
val h : int = 8
val g : int = 7
val f : int = 6
val e : int = 5
val d : int = 4
val c : int = 3
val b : int = 2
val a : int = 1
```

## はい

よかったですね
