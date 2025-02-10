---
title: Dependent Types と Refinement Types の違い
description: Dependent Types (依存型) と Refinement Types (篩型) は目指すところは似ているが，導入スタイルに根本的な違いがある
date: !!timestamp 2018-07-07T05:42:46+09:00
category: Programming
tags: ["Type System"]
---

自分の tweets.zip をみてたら発掘された文章．

Dependent Types (依存型) と Refinement Types (篩型) は目指すところは似ているが，導入スタイルに根本的な違いがある．

## TL;DR

Refinement types は (Curry-style typing のように) extrinsic で，Dependent types は (Church-style typing のように) intrinsic である．

## 前提

一般に，プログラム言語への型の導入スタイルには Curry-style と Church-style の2種類がある．

* Curry-style: 型付けは *既に存在する項を* 分類するもの

* Church-style: *項が存在するとは* 型付けされているということ

前者は動的型付き言語での型アノテーションなどが当てはまり，型アノテーションを全部取り除いたとしてもプログラムの意味は全く変わらない．それは型というものが *外因的に(extrinsically)* 追加されたものだから．

後者は一般的な静的型付き言語が当てはまり，その中では型検査が通らないプログラムは invalid である．それは型というものがそもそも言語の一部 (計算対象となる "項") であり，*内因的に(intrinsically)* 存在しているものだから．

## Dependent Types

Dependent types とは，項に *依存して* 決まる型である．

たとえば，Idris における固定長リスト(ベクトル)の定義は次のような形をしている．

```haskell
data Vect : Nat -> Type -> Type where
  Nil  : Vect Z a
  (::) : a -> Vect n a -> Vect (S n) a
```

ここで `Vect` は型変数 `a` だけでなく，リストの長さを表す自然数 `n` をパラメータとして取る．すなわち自然数の項が与えられなければ型を構成できない．この点で型 `Vect` は項に依存しているといえる．

なお一般に普通の関数は項に依存する項，多相型を持つ項は型に依存する項，型コンストラクタは型に依存する型であり，dependent types はこの関係性のぽっかり空いた穴を埋める存在でもある．

## Refinement Types

Refinement types とは型を述語で *修飾する* ものである．

たとえば，Liquid Haskell において `Data.Vector` を長さで修飾するには次のようにする．

```haskell
module spec Data.Vector where

import GHC.Base

measure vlen   ::   (Vector a) -> Int
assume  length :: x:(Vector a) -> {v: Int | v = (vlen x)}
assume  !      :: x:(Vector a) -> {v: Int | 0 <= v && v < (vlen x)} -> a
```

ここでは `Vector a` の持つ property として `vlen` を定義しており(制約中に書けるように)，`length` 関数で得られる値が `vlen` と等しいこと，`!` 関数でインデックスアクセスをするときはインデックスが 0 以上 `vlen` 未満であることをそれぞれ仮定している．

Dependent types と大きく違うのは，こちらでは(実行時に)行われるのは本来の `Data.Vector` の動作そのものであり，ここで定義したこととは何も関係がないし，取り除いても全く同じ動作をする．また本来の `Data.Vector` の実装を検証しているわけでももちろんない．

## つまり

Dependent types は言語の一部である．一方，refinement types は言語の外側にある．この関係は Church-style typing と Curry-style typing との関係と同じかたちをしている．

そもそも Curry-style は型なしの項を *修飾* しているものであるから，refinement terms と呼ぶこともできる．一方 Church-style を雑に (type-)dependent terms と呼んでもそんなに間違ってはいないだろう(そもそも term/value-dependent types である)．

これを使えば，プログラム言語のスタイルを dependent/refinement，types/terms で 2x2 通り (+依存型も篩型もないもの) に大まかに分類することができる．

|              | D. Types | R. Types | (None) |
| ------------ | -------- | -------- | ------ |
| **D. Terms** | Dependent ML | Liquid Haskell | (ML) |
| **R. Terms** | NuPRL | ??? | (LISP) |

なお，dependent types と refinement types を両方持っていてもよく，F* などがそのような言語で実用的なものの例である．
