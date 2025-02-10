---
title: ウェブサイトを SvelteKit で書き直した
description: cannorin のサイトがモダンになって帰ってきた！
date: !!timestamp 2025-02-10T21:00:00.0000000+09:00
category: Programming
tags: ["Diary"]
---

～修士課程をやっていたら忙しすぎて一年半が経っていた件～

というわけで，ウェブサイトを [SvelteKit](https://svelte.dev/) で再構築しました．
自作のブログエンジンで作ってた前のサイトにも愛着はあったんだけど，古くなったので……

* さすがに多重人格すぎるので [ポートフォリオ](/) を3ページに分割することにした
  - 数学関連のページは後程整備します．PDF とか置けるといいね
* Markdown は [mdsvex](https://mdsvex.pngwn.io/) で前処理して Svelte コンポーネントに変換するようにした
  - `+page.md` とか生やすと勝手にページになってくれてすごい
* [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) でかっこよくアニメーションするようにした
  - なお，私のメインブラウザである Firefox では [未対応](https://caniuse.com/view-transitions) なため……

最近は SvelteKit をよく使うのですが，やはり **Web 標準を大きく外していない** というのが理由として大きいです．業務で Next.js を使ってるときの謎の消耗が本当にない．生 DOM，バンザ～イ！
そういえば親友の [Tohlpeaks](https://tohlpeaks.party/) も SvelteKit でサイトを作ったそうです．ビッグウェーブ，来ているのでは？

とにかく，すっきりかわいい感じのウェブサイトになったのではないでしょうか！ ページはちょくちょく増やしていくつもりです[^1]．ではでは～．

[^1]: まずは Links からですかね．相互リンク募集中です！
