---
title: 「動的型つき」の言語を「型なし」と呼ぶのはおかしい，のか？
description: Twitter（現・X）でのこの種の定期イベントはそろそろやめにしないか
date: !!timestamp 2023-08-19T16:15:00+09:00
category: Programming
tags: ["TypeScript", "Type System"]
---

ある日の Twitter （現・X）のタイムライン．

> 動的型付けのことを型なしと呼ぶことに対しては様々な角度から殴ることが可能ですがどの角度から殴られたいですか？

> 定期的に出現する「動的型つきの言語を『型なしの言語』と呼ぶのはおかしい」論がなぜか軒並みかなり自信を持ったような書きぶりなのが不思議（TaPLの1章だけでも読めばもっと整理された理解になると思うんですけど）

> 型なしのことを動的型付けと呼ぶの、安全ではない言語が幅を利かせていた頃の名残だと思ってる（偏見）

> 動的型付けは静的には型の整合性を検証しないけど、型自体は言語機能としても概念としてもきちんと持ってるわけで、それを「自分が所望する安全性を提供しないから」って理由で「型など存在しない」まで言い切るのは流石に暴論というかただのディスりに片足突っ込んでね、と。

お前ら，いい加減にせい！！！！！！！！！！ 何回目だよ[^1]！！！！！！！！！！

[^1]: 観測範囲では三回目．いい加減にしろ！

## 「型」とは何であるか

まず「型」という用語の定義についてハッキリさせておこう．おそらく全員に同意してもらえるであろう定義を提示する．

> 「型」とは，プログラム内で扱うデータを分類するものである

これに同意できないひとは，申し訳ないが回れ右してほしい．わたしには君を救うことはできない……

さて，実用的なプログラム言語であれば必ず `number` や `string` といった「プリミティヴ・データ型」なるものを持っているはずだ．
ここで JavaScript のような静的型検査をしないプログラム言語を考えてみると，変数 `foo` にデータが格納されているとして，`typeof foo` とかやると
`number` やら `string` やらが帰ってくる．プログラム中で扱うデータが分類できている．つまり，JavaScript に型はある！というのが，

> 動的型付けは静的には型の整合性を検証しないけど、型自体は言語機能としても概念としてもきちんと持ってる

派の主張であろう．そして，JavaScript を例にするが，静的型検査がないプログラム言語でも，型をチェックして安全に動くコードは書くことができる．

```javascript
// JavaScript
function greet(name) {
  if (typeof name !== "string") throw new Error("name is not a string");
  return `Hello, ${name}!`;
}
```

この状況を「型なし」と言ってしまうのは，確かにオカシイ気がする．

## 「型付け」とは何であるか

一方，両派がともに問題にしているのは「動的型付け」という用語の使い方だ．ここで，「動的型付け」とは「動的」に「型付け」をすることであろう．
「動的」は一般に「実行時」という意味と思ってよいだろう．逆に「静的」は「実行せずに」という意味である．残った「型付け」という用語について考えてみる．

「型」を「付け」ると言っているのだから，とりあえず *「型」なる何か* を *どこかに付ける* のであろう．ここで賢いあなたは「あれ？でもさっきの例だと，型って特に何もしなくても付いてたよ？」と思うかもしれない．その疑問は実は **この問題の核心を突いている** のだが，とりあえず置いておいてほしい．

「型付け」における「型」は一旦謎のままとして，ここでいう「型」なるものを付けたり付けなかったりできる言語として TypeScript を考えよう．例えば，以下の TypeScript コードには「型がついてない」ことに，皆さん同意できることであろう．

```typescript
// TypeScript
function greet(name) {
  return `Hello, ${name}!`;
}
```

このコードに「型がついてない」ことに同意できない人も，わたしには救えないので，回れ右してほしい．型，ついてないですね？ TypeScript コンパイラくんも `Parameter 'name' implicitly has an 'any' type.` とか言って怒っている．よろしい．では，型を付けてみよう．

```typescript
// TypeScript
function greet(name: string) {
  return `Hello, ${name}!`;
}
```

型，付けれましたね？ うむうむ，`: string` というものを *付けた* という確かな実感がある．これには TypeScript コンパイラくんも大満足．で，彼は何に怒っていたのだろう？彼は `Parameter 'name' implicitly has an 'any' type.` と言っていた．TypeScript において「`any` 型である」というのは「どんな種類のデータでもある可能性がある」という意味だ．つまり，これは「`name` にはどんなデータでも入ってくる可能性があるよ」，言い換えれば「`name` に入るのがどんな種類のデータなのかわからないよ」と言っている．そして我々が `: string` と付けたことによって，「`name` には `string` 型のデータしか入ってこない」と知ったので，彼は怒らなくなったのである．まとめると，以下の通りである．

> 「型付け」とは，データが分類できてない状況下で，何らかの手段[^2]で，分類できている状態にすることである

[^2]: 型注釈を書くでも，型推論してもらうでも，なんでもよいので

以上の定義も，まぁ全員に同意してもらえることだと思う．

## 「動的型付け」という言い回しは，「型なし」と同じ理由でオカシイ！

ここで問題となってくるのが，「あれ？でもさっきの例だと，型って特に何もしなくても付いてたよ？」という疑問である．`string` とか `number` とかって，*TypeScript コンパイラくんが知らないだけ* で，何もしなくても最初から決まっていなかったっけ？
実際，JavaScript の標準規格である [ECMAScript](https://262.ecma-international.org/14.0/) では，プログラム中で扱うデータは， `string` なり `number` なりに，最初から分類済である，ということになっている．

> Algorithms within this specification manipulate values each of which has an associated type. The possible value types are exactly those defined in this clause. Types are further subclassified into ECMAScript language types and specification types.

JavaScript で扱うデータは最初から分類済，ということは，先ほど書いた以下の JavaScript コードでは，**「分類できてないデータを改めて分類する」ような行為は一切していない** のだ．

```javascript
// JavaScript
function greet(name) {
  if (typeof name !== "string") throw new Error("name is not a string");
  return `Hello, ${name}!`;
}
```

ここでやっているのは，プログラムが預かり知らぬところで[^3] *最初から分類済である* ところの「型」を「チェック」しているのであって，「型付け」ではなく「型チェック」なのだ！
JavaScript プログラムは *最初からデータに型が付いている世界に生きている* のであって，これを「動的型付け」などと，あたかも型を *元々は付いてなくて，実行時になってから付けたかのように* 呼ぶのはおかしくないだろうか？

つまり，`string` や `number` などの型があるから「型なし」という言葉を使うのはオカシイ，と主張するならば， **型は最初からあるのだから「動的型付け」という言葉を使うのもオカシイ**，と主張しなければならないのだ！

[^3]: データの分類としての「型」にプログラムが干渉する余地はないということ．`typeof` を自分で実装したり，`typeof foo === "hogehoge"` になるような `foo` なり `hogehoge` を作ったりするのは不可能，と言ってもいい

## 「型付け」は，型をどこに付けているのか？

ところで，TypeScript は JavaScript に静的な型システムを追加した言語である．つまり，全てのデータには最初から型が付いているし，`typeof` でそれをチェックすることもできる．実際，「`name` の型は `any` ですよ」と明示的に書くことで[^4]，先ほどの JavaScript コードと同様のものが TypeScript でも書ける．

[^4]: 実は先ほどの例では，TypeScript コンパイラくんは「型注釈を（`: any` すらも）**明示的に書いていないこと**」に怒っている．嘘ついてごめん…… また，明示的に `any` を書く行為も ESLint で禁止できる

```typescript
// TypeScript
function greet2(name: any) {
  if (typeof name !== "string") throw new Error("name is not a string");
  return `Hello, ${name}!`;
}
```

一見 JavaScript と同じことをしているように見えるが，実は TypeScript はこの状況でも「型付け」を行う．
上のコードを [TypeScript Playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAcwE4FN1QEwAowCGAtugFyIFgCeAlIgN4BQiiMwiuUVADunMPmLo6AQgC8YxACIAzlFQwwyKXSgALVHADuiMOh0BRVJtS4phEqxm64UCojkKlKgNzNEGKCFRIABgAl0ABsguAAaRAASegt0AF8RXzc4oA) で書いたので，そこで確認してほしいのだが，`typeof name` の `name` の上にマウスを置くと `(parameter) name: any` と出るが，``` return `Hello, ${name}!` ``` の `name` の上に置くと `(parameter) name: string` と出る．
つまり上のコードでは，`name` が持っているデータの型を `typeof` で実行時にチェックするコードを書くことで，`name` が `if` 文より下では確かに `string` 型を持つことを，TypeScript コンパイラくんに教えてあげている（＝型付けを手伝っている）のだ．

上の例から，TypeScript コンパイラはデータそのものの型を気にしているというよりかは，それが入っている変数 `name` の型を気にしているのが分かると思う．データが手元にあればそのデータの型は分かって当たり前だが，ある変数にどのような型のデータが入ってくるかを *実行せず* に調べるのは，簡単にできることではなさそうだ．それを行うのが「型付け」だ． **「型付け」の対象はデータそのものではなく，定数や変数のような，データに直接対応するプログラムの構文である．** 「データに直接対応する構文」って定数や変数以外何があんねんと思う方は，

```typescript
// TypeScript

function greet(name: string) {
  return `Hello, ${name}!`;
}

console.log(greet(greet("World"))); // Hello, Hello, World!
```

というコードを考えてほしい．ここで，`"World"` という定数が `string` 型を持っているから `greet` の引数として渡せるのと同様に，`greet("World")` という **式** も `string` 型を持っている[^5]ので，再び `greet` の引数として渡すことができるのだ．

[^5]: これは，`greet` が文字列を `return` することから TypeScript コンパイラが推論してくれている

この意味でも，**JavaScript は TypeScript 的な「型付け」なる行為を断じて行っていない** ことが分かると思う．JavaScript が扱っている「型」はあくまでデータが持つ属性であって，データが入っている変数や，データを生成する式などは，型の概念と一切関係がない．変数にどういう型のデータが入ってくるか，なんて知ったことではないのだ．

また，上記の `typeof` を使った TypeScript コードのように，「データの型を *動的* にチェックすることで，構文に型付けをする」ことを「 *動的* 型付け」と呼んでいる，そして JavaScript をそのまま TypeScript として読んだときのように．「データの型の *動的* チェックしか，構文への型付けの手段がない」言語を「 *動的* 型つき言語」と呼んでいる人々もいるかもしれないが，この場合においても，実際の型付けは TypeScript コンパイラが *静的に* 行っているわけで，**紛らわしいからやめたほうがいい**，とわたしは思う．

> 「動的型付けされる」といった言い回しは誤っているといって差し支えなく、おそらく「動的検査される」と言い換えるべきである

って TaPL も言っている[^6]ことだし．

[^6]: [オーム社ウェブサイトの書籍ページ](https://www.ohmsha.co.jp/book/9784274069116/) からダウンロードできるサンプルで確認できる一文だ

## おまえはポジショントークをしているぞ

まとめよう．

* JavaScript プログラムくんの立場では，
  - データは最初から分類済である．つまり **全ては最初から「型が付いている＝型付き」** なのであって，断じて「型なし」ではなく，実行時に（＝動的に）改めて "型を付ける" などということもしない．
  - 変数はただのデータの入れ物であって，型とかは関係がない．
  - データに型を付けるのは JavaScript 処理系の内部実装が勝手にやってることであって，JavaScript プログラム的には知ったことではない．
  - `typeof` を使うと，データに（最初から）付いている型をプログラム内でチェックすることができる（＝「型チェック」）．

* TypeScript コンパイラくんの立場では，
  - 型注釈を書いたり，型推論したりすることで初めて，変数や式がどういう種類のデータを持つのか分かる． **その状態が「型が分かっている＝型付き」** なのであって，注釈が書いてない・推論もできないのであれば「型が分からない＝型なし」である．
  - そもそも型をつける対象は変数や式である．
  - 変数や式に型を付けるというのは，TypeScript コンパイラくんが自分でやらなければならない行為である．
  - `typeof` を使うと，「この範囲内ではこの型である」ことを TypeScript コンパイラに教えることができる．その正しさは，実行時に（JavaScript 的な意味での）型チェックを行うことで保証される（＝「動的な型付け」と言えなくもない？？）．

そして，Twitter（現・X）で頻繁に見かけるこの種の議論に対するわたしの意見は以下だ．

* 「『動的型つき』の言語を『型なし』と呼ばない」派の人は，JavaScript プログラムくんの立場だ．
  - 「型なし」という呼称に反対してもよい．
  - しかし，その立場に立つのならば，**そもそも「動的型付き」と呼ぶべきではない**．
* 「『動的型つき』の言語を『型なし』と呼ぶ」派の人は，TypeScript コンパイラくんの立場だ．
  - `any` 型が付いていても何もわからん，という意味で「型なし」と呼んでもいい．
  - 「動的型付き」って呼び方はおかしい！「型なし」のほうが適切だ！という意味で言っているなら，それでよい．
  - 「動的型付き」って「型なし」とも言えるよね，という意味で言っているなら，**前提がなんだかおかしい．**
* **一番中立なのは，「言語を『型なし』って呼ぶかは立場によるし，『動的型付き』って何？」派だ．**
  - 上の二つは両者ともに中立ではなく，それぞれの立場で **ポジショントークをしている** ことに気をつけろ！
  - 「動的型付け」という用語は，立場によらず**使うべきではない！**

でも，それだと「静的型検査をしていないプログラム言語」を指す **簡便で適切な用語が存在しない** ことになってしんどいですよね？
「動的型付け」と呼ぶと少なくとも「型なし」という用語を偉そうに否定できる立場ではなくなることを考えると，何か別な呼び方を考えたほうが良いんじゃないでしょうか[^7]．

[^7]: 「動的型検査言語」はどうだろうか

それが無理なら，**中立の立場に立ったうえで，用語として適切でないのを許容して，伝わりやすさ重視で「動的型付け」と呼ぶ**，というのが現実的ではないでしょうか．結局みんなそう呼んでるし．みんな中立的になってね[^8]．

[^8]: なお，静的型付けにも Church-style と Curry-style の二つの派閥が存在するが， Church-style 主義者に「型って何？」って聞くと「『型』とは『項』ッ！！」と返ってきて話がどんどんややこしくなるので，今回の記事では割愛する

> 「静的」という語を明示的に付加することがある。例えば、「静的型付きプログラミング言語」という言い方をする。これは、本書で考察しているような種類のコンパイル時解析と、Scheme のような言語で使われる動的型付け（あるいは潜在的型付け）とを区別するためである。後者ではヒープ中の異なる種類の構造を区別するのに実行時の型タグが利用される。「動的型付けされる」といった言い回しは誤っているといって差し支えなく、おそらく「動的検査される」と言い換えるべきであるが、標準的に使われる用語法である。
>
> ――― Benjamin C. Pierce 著，住井英二郎 監訳 『型システム入門』 一章より

## おまけ: 「静的型付け」は実は「データの分類」以上の行為である

みなさん，中立的になりましたね？ では，以後は JavaScript 的な型付け（してないけど）のことを「動的型付け」，逆に TypeScript 的な型付けのことを「静的型付け」と呼ぶことにする．

ところで，TypeScript を書いたことがあるかたはご存じかと思うが，TypeScript ではクラスに対してクラス型というものがつく．

```typescript
// TypeScript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x; this.y = y;
  }
}
```

このように `Point` というクラスを定義すると，`Point` という名前の型が作られ，`Point` クラスのインスタンスは `Point` 型を持つことになる．

```typescript
// TypeScript

function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

console.log(distance(new Point(1,1), new Point(2, 0)));
```

このように，`Point` クラスのインスタンスを2つ受け取って，点間の距離を返す関数 `distance` は，`Point` 型の引数を2つ取って，点間の距離を `number` で返す，という型を持つことになる．「変数 `p1, p2` が `Point` クラスのインスタンスである」ことと，「変数 `p1, p2` が `Point` 型を持つ」ということを同一視している，ということがわかるだろうか．

また，何か別のクラス，例えば `Person` があったとして，`Person` クラスのインスタンスを `distance` に渡そうとしても TypeScript コンパイラ君が許さない．

```typescript
// TypeScript

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

console.log(distance(new Point(0, 0), new Person("Alice")));
// error: Argument of type 'Person' is not assignable to parameter of type 'Point'.
```

このように，**TypeScript の静的型付けでは，違うクラスのインスタンス（を表す構文）は違う型を持つ** とみなしていることがわかる．

ところが，JavaScript の標準規格である [ECMAScript](https://262.ecma-international.org/14.0/) では，データは以下の種類の型しか持たないことになっている．

- `undefined`
- `null`
  - ただし，`typeof` すると `"object"` を返す．
- `boolean`
- `string`
- `symbol`
- `number`
- `bigint`
- **`object`**
  - 関数は特殊なオブジェクト．ただし，`typeof` は `"function"` を返す．
  - コンストラクタも特殊なオブジェクト．ただし，`typeof` は `"function"` を返す．

実際，JavaScript において `Point` クラスと `Person` クラスのインスタンスをそれぞれ作って，`typeof` をしてみると，両方とも `object` を返す．

```javascript
// JavaScript

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
console.log(typeof (new Point(0, 0))); // "object"

class Person {
  constructor(name) {
    this.name = name;
  }
}
console.log(typeof (new Person("Alice"))); // "object"
```

つまり，**JavaScript の動的型付けでは，クラスのインスタンスは（違うクラスであっても）全て `object` 型を持つ** ことがわかる．では JavaScript ではこの種の区別をどうやっているのかというと，それぞれのオブジェクトが「どのクラスのコンストラクタから作られたのか」を表す **プロトタイプ（チェーン）** というものを持っている．`instanceof` という演算子を使うことで，オブジェクトが実際にあるクラスのインスタンスなのかどうかを，オブジェクトのプロトタイプを見てチェックすることができる．

```javascript
// JavaScript
function distance(p1, p2) {
  if (!(p1 instanceof Point)) throw new Error("p1 is not a point.");
  if (!(p2 instanceof Point)) throw new Error("p2 is not a point.");
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
```

ここで `instanceof` の右辺に現れている `Point` はいわゆる「型」ではなく，`Point` クラスのコンストラクタ，つまりこちらもオブジェクトであることに注意しよう．つまり，JavaScript における `instanceof` は **二つのオブジェクトの関係を調べる** もので，それぞれのデータに最初から付いている型をチェックする動的型付けとは厳密には違う仕組みである．ちなみに，オブジェクトのプロトタイプはコンストラクタでインスタンスを作った瞬間に，つまり *実行時に設定される* ので，「動的に型っぽいものを付けている」という点で，むしろ **こちらのほうこそ「動的型付け」と呼べなくもない** のにも注意しよう．

以上のことから，TypeScript の静的型付けは JavaScript の動的型付けよりも微妙に広い範囲を扱っていることがわかる．
一般に**静的型付けは，プログラム内で現れる不変条件全般を扱うことができる**．不変条件とは「いつもそうである条件」という意味だ．
TypeScript を例に取ると，
* 「変数 `foo` が `string` 型を持つ」ことは，「`foo` に入るデータの種類は `string` である」という条件を保証する
  - つまり，`typeof foo` は *いつでも* `"string"` を返す
* 「変数 `bar` が `Point` 型を持つ」ことは，「`bar` に入るオブジェクトは `Point` クラスのインスタンスである」という条件を保証する
  - つまり，`bar instanceof Point` は *いつでも* `true` を返す

しかし，クラス型が保証する「インスタンスである」という条件も，結局「データの持つ属性」と言えなくもないのでは？と思う諸氏もいることだろう．では，ある変数 `baz` が持つ型が，`baz` 自身に入るデータの属性とは *もはや何の関係もない条件を保証する* 例を挙げれば，「不変条件全般を扱える」ということに納得していただけるだろうか？

ここで，TypeScript で `typeof` を使う例を思い出してほしい．

```typescript
// TypeScript
function greet2(name: any) {
  if (typeof name !== "string") throw new Error("name is not a string");
  return `Hello, ${name}!`;
}
```

この例において，``` `Hello, ${name}!` ``` の `name` の上にマウスカーソルを置くと `(parameter) name: string` と出てくるのは一体何故なのだろうか？ 実は，`if (typeof name !== "string") throw ...` という文が，`if` 以下において `name` の型が `string` であることを保証しているのだ．これは，一旦別の関数に分割するとわかりやすい．

```typescript
// TypeScript

function isString(name: any): name is string {
  return typeof name === "string";
}

function greet2(name: any) {
  const nameIsString = isString(name);
  if (nameIsString) return `Hello, ${name}!`;
  else throw new Error("name is not a string");
}
```

上の例も [TypeScript Playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABDAzgZSgJxmA5gCgA8AuRAQzAE8BKUw5FRFLHXRAbwChFFMBTKCExIolAA584wRPQC88xACJm2PIoDcnAL6dOoSLASJc-AQCZ8YMgFs+pCjQ7dEEBM0RXbASXQs8iWQYMVQJPPmpNZxhpSxs+H2DWal4BISQAAwAJPgAbHLgAGkQAEnYwrQBCdM0eXJQ+RCgAC0w4AHcPPg6AUUxWzHxFMIYPOChyJj9cRQjtIA) を用意してある．ここでも，``` `Hello, ${name}!` ``` の `name` の上にマウスカーソルを置くと `(parameter) name: string` と出てくるのが確認できるだろう．何故こんなことができるのか？ それは，`isString` 関数の戻り値の型が `name is string` という珍妙な型を持っているからである．この型は文字通り，「`name` という変数が `string` 型を持っているかどうか」を表すもので，取りうる値は `true` もしくは `false` である．つまり，上の例では

```typescript
const nameIsString = isString(name);
```

と結果を変数 `nameIsString` に代入しているが，ここで `isString` 関数の戻り値の型が `name is string` であることは，**「もし `nameIsString` が `true` ならば，`name` の型は `string` である」** ことを保証しているのだ！ これが保証されているからこそ，`if (nameIsString)` の中にある（＝ `nameIsString` が `true` であるケースの） ``` `Hello, ${name}!` ``` においては，`name` の型は `string` になっているのである．そして，`name is string` 型が保証している条件は `name` の型についてであって，`nameIsString` のデータの種類などは *もはやどうでもよくなっている* ことに注意してほしい．

以上の内容をまとめよう．

* **静的型付けは，プログラム内で現れる不変条件全般を扱うことができる**
  - 「データの種類」（＝ `typeof` の結果）は，あくまで静的型付けで扱える不変条件の一つに過ぎない
  - クラス型は，「特定の `class` のインスタンスである（≒ `instanceof` が `true` になる）」という不変条件である
    - JavaScript 的には全て同じ `object` 型のデータであり，`typeof` では区別できない
    - JavaScript におけるプロトタイプは，データの持つ「型」とは厳密には違う仕組みである
  - `x is string` 型が保証する不変条件は，もはや自分自身のデータの種類とは関係ない
    - `x is string` 型を返す関数が実際に返すデータは `true` か `false` である
* JavaScript におけるプロトタイプは，実行時にタグ付けされるという点では，動的に型付けしていると言えなくもない
  - ただし仕様上では，厳密には「型」とは違う仕組みである

ちなみに，わたしが文中で

> > 「型」とは，プログラム内で扱うデータを分類するものである
>
> これに同意できないひとは，申し訳ないが回れ右してほしい．わたしには君を救うことはできない……

や，

> ```typescript
> // TypeScript
> function greet(name) {
>   return `Hello, ${name}!`;
> }
> ```
>
> このコードに「型がついてない」ことに同意できない人も，わたしには救えないので，回れ右してほしい．

と言ったのは，このおまけで解説した内容を理解している人には釈迦に説法であって，
なおかつ「データの種類」としての「型」の用法を頑なに認めないような人は，
ガチガチの静的型付け原理主義者で救いようがない，ということです……

## おまけのおまけ: 「型推論」と「動的型付け」の混同について

以上の話がきちんと分かっていれば，TypeScript で

```typescript
// TypeScript
const x = "foo";
```

と書くと `x` の型が `string` になるといった，いわゆる「型推論」と，
JavaScript で

```javascript
// JavaScript
const x = "foo";
```

と型を指定せずに書ける，いわゆる「動的型付け」（という呼び方はオカシイと散々言ってるが）を，混同する **わけがない** のである．TypeScript コンパイラくんは型推論を頑張ったので，変数 `x` の型が `string` であることをキチンと知っているし，それこそが彼にとって大事なことだ．一方 JavaScript プログラムくん的には， `"foo"` というデータは生まれた時から `string` なのであって，それが入ってる変数 `x` の型なんてものは知ったことではないのである．
