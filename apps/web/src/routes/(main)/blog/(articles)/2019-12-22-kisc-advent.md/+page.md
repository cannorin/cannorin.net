---
title: 部室 Wi-Fi を支える技術
description: 認証コンセントはクソ
date: !!timestamp 2019-12-22T00:00:00.0000000+09:00
category: Programming
tags: ["Diary"]
---

この記事は [Kobe University Advent Calendar 2019](https://adventar.org/calendars/4690) の22日目です．

## 部室のネットワーク環境の惨状

我々の部室には大学の無線LANが届かず，有線LANポートが1個しかない．そこで自分で無線LANアクセスポイントを建ててみんなで使えるようにする必要があるが，それがめちゃくちゃ大変という話です．

## IEEE 802.1X認証という壁

雑にルータぶっさせばいいじゃんと思われるかもしれないが，それでは全く動かない．そんなに単純な話ではないのだ．

弊学のインターネット環境は **IEEE 802.1X** 認証というものを採用している．
これは認証されたクライアントしかネットワークに接続できなくするための技術で，以下のようになっている．

<a title="Arran Cudbard-Bell Arr2036 [GFDL (http://www.gnu.org/copyleft/fdl.html)], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:802.1X_wired_protocols.png"><img width="256" alt="802.1X wired protocols" src="https://upload.wikimedia.org/wikipedia/commons/1/1f/802.1X_wired_protocols.png"></a>

Authenticator というのは認証用の LAN スイッチで，部室には存在してないし，Authentication Server と通信するための secret key がわからないので自分で用意することもできない．
つまりどういうことかというと，**まともな手段では同時に一人しかネットワークに接続できない** ということだ．ゴミ

## 回避策: OpenVPN

まず，認証を突破するために **誰か（のアカウント）に人柱になってもらう**．

次に，接続した PC をアクセスポイントかつ OpenVPN Client にする．

そしてインターネット上に専用の OpenVPN Server を用意し，そこに接続する．

すると，アクセスポイント化した PC に他の PC を接続することで，インターネットにアクセスできるようになる．

図で説明すると以下のようである：

![図](https://i.imgur.com/oRCaDIy.png)

Authenticator は MAC アドレス等で端末を識別しているようだが，VPN によってクライアント PC からのパケットは人柱 PC からのフレームの中に包まれるため，全て人柱 PC からの通信となって認証を突破することができる．

## ハマった（てる）ところ

### UDP 123 (NTP) で OpenVPN サーバを建てていると wget が通らない

学内ネットワークでは使えるポートがかなり制限されているので，空いてるポートで UDP が使える UDP 123 を使ってみたが，
これは本来 NTP が使うポートだ．時刻同期ができなくなるくらい別にいいでしょと思ったら，ping も dig も通るのに
wget が動かないという謎の現象が発生した．調べても分からなかったので TCP 123 にしたら動いた．ネットワークなんもわからん

### RasPi を経由させるとさくらのコントロールパネルにアクセスできない

意味不明 わからん，なんも……


次回は Tatamo さんです．
