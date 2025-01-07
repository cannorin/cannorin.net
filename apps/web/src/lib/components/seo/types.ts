/*
Forked from artiebits/svelte-seo
================================

MIT License

Copyright (c) 2020 artiebits

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import type { Thing, WithContext } from "schema-dts";

export interface SeoProps {
  title?: string;
  description?: string;
  base?: string;
  keywords?: string;
  applicationName?: string;
  themeColor?: string;
  nofollow?: boolean;
  noindex?: boolean;
  nositelinkssearchbox?: boolean;
  notranslate?: boolean;
  canonical?: string;
  amp?: string;
  manifest?: string;
  languageAlternates?: Array<{ hreflang: string; href: string }>;
  twitter?: Twitter;
  facebook?: Facebook;
  openGraph?: OpenGraph;
  jsonLd?: Thing | WithContext<Thing>;
}

export interface Facebook {
  appId: string;
}

export interface Twitter {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  card?: "summary" | "summary_large_image" | "player" | "app";
  site?: string;
  creator?: string;
  player?: string;
  playerWidth?: string;
  playerHeight?: string;
  playerStream?: string;
  appNameIphone?: string;
  appIdIphone?: string;
  appUrlIphone?: string;
  appNameIpad?: string;
  appIdIpad?: string;
  appNameGoogleplay?: string;
  appIdGoogleplay?: string;
  appUrlGoogleplay?: string;
}

export interface OpenGraph {
  title?: string;
  type?: string;
  url?: string;
  audio?: string;
  audioSecure_url?: string;
  audioType?: string;
  description?: string;
  determiner?: string;
  locale?: string;
  localeAlternate?: string[];
  site_name?: string;
  videos?: Array<{
    url: string;
    secure_url?: string;
    type?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
  }>;
  images?: Array<{
    url?: string;
    secure_url?: string;
    type?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
  }>;
  music?: OpenGraphMusic;
  movie?: OpenGraphVideo;
  article?: OpenGraphArticle;
  book?: OpenGraphBook;
  profile?: openGraphProfile;
}

export interface OpenGraphMusic {
  duration?: number | string;
  album?: string;
  albumDisc?: number;
  albumTrack?: number;
  musician?: string;
  creator?: string;
  song?: string;
  songDisc?: number | string;
  songTrack?: number | string;
  release_date?: string;
}

export interface OpenGraphVideo {
  actor?: string[];
  actorRole?: string;
  director?: string[];
  writer?: string[];
  duration?: number | string;
  release_date?: string;
  tag?: string[];
  series?: string;
}

export interface OpenGraphArticle {
  published_time?: string;
  modified_time?: string;
  expiration_time?: string;
  author?: string[];
  section?: string;
  tag?: string[];
}

export interface OpenGraphBook {
  author?: string[];
  isbn?: string | number;
  release_date?: string;
  tag?: string[];
}

export interface openGraphProfile {
  first_name?: string;
  last_name?: string;
  username?: string;
  gender?: "male" | "female";
}
