<script lang="ts">
import Katex from "$lib/components/katex.svelte";
import { limitWidth } from "$lib/constants";
import { cn } from "$lib/utils";

import Card from "./card.svelte";

type PaperBase = {
  title: string;
  authors: [string, ...string[]];
  arxiv?: `${number}.${number}` | undefined;
  researchGate?: string | undefined;
};

type PreprintPaper = PaperBase & {
  type: "preprint";
  arxiv: NonNullable<PaperBase["arxiv"]>;
};

type SubmittedPaper = PaperBase & {
  type: "submitted";
};

type JournalPaperBase = PaperBase & {
  journal: string;
  doi?: string;
};

type AcceptedPaper = JournalPaperBase & {
  type: "accepted";
};

type PublishedPaper = JournalPaperBase & {
  type: "published";
  info: string;
};

type Paper = PreprintPaper | SubmittedPaper | AcceptedPaper | PublishedPaper;

const isAccepted = (p: Paper) =>
  p.type === "accepted" || p.type === "published";

const papers: Paper[] = [
  {
    type: "published",
    title:
      "Uniform Lyndon interpolation for the pure logic of necessitation with a modal reduction principle",
    authors: ["Yuta Sato"],
    arxiv: "2503.10176",
    researchGate:
      "https://www.researchgate.net/publication/389821716_Uniform_Lyndon_interpolation_for_the_pure_logic_of_necessitation_with_a_modal_reduction_principle",
    journal: "Journal of Logic and Computation",
    doi: "10.1093/logcom/exaf048",
    info: "Volume 35, Issue 7, October 2025",
  },
  {
    type: "accepted",
    title:
      "The finite frame property of some extensions of the pure logic of necessitation",
    authors: ["Taishi Kurahashi", "Yuta Sato"],
    arxiv: "2305.14762",
    researchGate:
      "https://www.researchgate.net/publication/385545062_The_Finite_Frame_Property_of_Some_Extensions_of_the_Pure_Logic_of_Necessitation",
    journal: "Studia Logica",
    doi: "10.1007/s11225-024-10154-w",
  },
];

type Talk = {
  title: string;
  talkers: [string, ...string[]];
  conference: {
    name: string;
    url?: string;
  };
  location: string;
  date: Date;
  slide?: string;
};

const talks: Talk[] = [
  {
    title: "IML でも CML でもない直観主義様相論理について",
    talkers: ["Yuta Sato"],
    conference: {
      name: "第60回MLG数理論理学研究集会",
      url: "https://www2.kobe-u.ac.jp/~tk/jp/workshop/MLG2025/",
    },
    location: "神戸大学",
    date: new Date(2025, 12 - 1, 20),
  },
  {
    title: "命題化とカット除去による N+Am,n の一様 Lyndon 補間定理の証明",
    talkers: ["Yuta Sato"],
    conference: {
      name: "日本数学会 2025年度秋季総合分科会",
      url: "https://www.mathsoc.jp/activity/meeting/nagoya25sept/index.html",
    },
    location: "名古屋大学",
    date: new Date(2025, 9 - 1, 18),
  },
  {
    title: "Uniform Lyndon Interpolation for N+Am,n",
    talkers: ["Yuta Sato"],
    conference: {
      name: "18th Asian Logic Conference",
      url: "https://www2.kobe-u.ac.jp/~brendle/alc2025/main.html",
    },
    location: "Kyoto Sangyo University",
    date: new Date(2025, 9 - 1, 12),
    slide: "/math/alc2025.pdf",
  },
  {
    title: "Analysis of the pure logic of necessitation and its extensions",
    talkers: ["Yuta Sato"],
    conference: {
      name: "Logic Colloquium 2025",
      url: "https://www.colloquium.co/lc2025",
    },
    location: "TU Wien",
    date: new Date(2025, 7 - 1, 8),
    slide: "/math/lc2025.pdf",
  },
  {
    title: "必然化の論理の拡張 NAmn のシークエント計算と補間定理",
    talkers: ["Yuta Sato"],
    conference: {
      name: "第59回MLG数理論理学研究集会",
      url: "https://sites.google.com/view/mlg59/home",
    },
    location: "東北大学",
    date: new Date(2025, 2 - 1, 21),
    slide:
      "https://drive.google.com/file/d/1aOf7hsxNfCUHdmFsT5F7BaIAgqiYFzt9/view?usp=sharing",
  },
  {
    title: "必然化の論理 N の拡張論理の有限フレーム性と補間定理",
    talkers: ["Yuta Sato"],
    conference: {
      name: "数学基礎論若手の会2024",
      url: "https://sites.google.com/view/mlwakatenokai2024/",
    },
    location: "郡山市青少年会館",
    date: new Date(2024, 10 - 1, 12),
  },
  {
    title: "必然化の論理 N の拡張論理の有限フレーム性",
    talkers: ["Yuta Sato", "Taishi Kurahashi"],
    conference: {
      name: "日本数学会 2024年度年会",
      url: "https://www.mathsoc.jp/activity/meeting/omu24mar/",
    },
    location: "大阪公立大学",
    date: new Date(2024, 3 - 1, 18),
  },
  {
    title: "必然化の論理 N の拡張論理の有限フレーム性と補間定理",
    talkers: ["Yuta Sato", "Taishi Kurahashi"],
    conference: {
      name: "第58回MLG数理論理学研究集会",
      url: "https://sites.google.com/view/mlg58/home",
    },
    location: "東北大学",
    date: new Date(2024, 2 - 1, 17),
  },
];
</script>

{#snippet paperArticle(paper: Paper)}
  <article class="not-prose space-y-1">
    <h5 class="font-medium">
      {#if isAccepted(paper) && paper.doi}
        <a class="inline text-primary underline" href="https://doi.org/{paper.doi}" target="_blank" rel="noopener noreferrer">
          {paper.title}
        </a>
      {:else}
        {paper.title}
      {/if}
    </h5>
    <p class="text-xs">
      <span>{paper.authors.join(", ")}.</span>
      {#if isAccepted(paper)}
        <span class="italic">{paper.journal},</span>
        <span>{paper.type === "accepted" ? "to appear" : paper.info}.</span>
      {:else}
        <span>{paper.type === "preprint" ? "In preparation" : "Submitted"}.</span>
      {/if}
      {#if paper.arxiv}
        <a class="text-primary underline font-medium inline" href="https://arxiv.org/abs/{paper.arxiv}" target="_blank" rel="noopener noreferrer">
          [arXiv]
        </a>
      {/if}
      {#if paper.researchGate}
        <a class="text-primary underline font-medium inline" href={paper.researchGate} target="_blank" rel="noopener noreferrer">
          [ResearchGate]
        </a>
      {/if}
    </p>
  </article>
{/snippet}

{#snippet talkArticle(talk: Talk)}
  <article class="not-prose space-y-1">
    <h5 class="font-medium">
      {talk.title}
    </h5>
    <p class="text-xs">
      <span>{talk.talkers.join(", ")}.</span>
      <span>
        {#if talk.conference.url}
          <a class="text-primary underline inline" href="{talk.conference.url}" target="_blank" rel="noopener noreferrer">
            {talk.conference.name}
          </a>
        {:else}
          {talk.conference.name}
        {/if},
      </span>
      <span>
        {talk.location},
      </span>
      <time datetime="{talk.date.toLocaleDateString("sv-SE")}">
        {talk.date.toLocaleDateString()}.
      </time>
      {#if talk.slide}
        <a class="text-primary underline font-medium inline" href="{talk.slide}" target="_blank" rel="noopener noreferrer">
          [slide]
        </a>
      {/if}
  </article>
{/snippet}

<main class={cn(limitWidth, "flex grow flex-col items-center gap-12 lg:gap-16")}>
  <section class="flex flex-col items-center md:flex-row md:items-start gap-4 lg:gap-8">
    <h2 class="sr-only">自己紹介</h2>

    <Card class="md:!sticky md:top-16" more="back" />

    <section class="px-5 py-5 md:py-0 prose prose-sm prose-light">
      <p>
        数理論理学を勉強しています。
        非古典論理、そのなかでも特に様相論理を主な対象として、論理のもちうる様々な性質について研究しています。
      </p>
      <p>
        また今後の目標として、研究で扱っている各種論理のコンピュータサイエンスへの応用も視野に入れています。
      </p>

      <h3>現在の研究内容</h3>

      <ul>
        <li>
          <span class="font-bold">
            非正規様相論理 <Katex math="{"\\mathbf{N}"}"/> と、その拡張に関する研究
          </span>
          <ul>
            <li>
              <Katex math="{"\\mathbf{N}"}"/> は様相論理 <Katex math="{"\\mathbf{K}"}"/> から公理 <Katex math="{"\\textrm{K}"}"/> を取り除いて得られる非正規様相論理で、
              "the pure logic of necessitation" ともよばれています。
              最近になって注目されるようになった論理で、まだわかっていない性質が多数あります。
            </li>
            <li>
              正規様相論理に対しては、一般にどういう形の公理を加えた拡張がどのような性質を持つのか、昔からよく調べられています。
              <Katex math="{"\\mathbf{N}"}"/> についても同様の結果を得ることを目的として、
              公理 <Katex math="{"\\Box^n \\varphi \\to \\Box^m \\varphi"}"/> を加えて得られる拡張について、各種性質を調べています。
            </li>
          </ul>
        </li>
        <li>
          <span class="font-bold">
            直観主義様相論理に関する研究
          </span>
          <ul>
            <li>
              コンピュータサイエンス、特にプログラム言語へと広く応用できるものとして、直観主義様相論理があります。
              古典論理上で展開される通常の様相論理とは異なる振る舞いをし、古典版の様相論理では解決済でも、直観主義版では未解決な問題が多いです。
              コンピュータサイエンス以外にも多数の応用があることもあいまって、現在も活発に基礎研究がなされています。
            </li>
            <li>
              現在は既存論文のサーベイを中心に行い、知識を深めています。
              また上で述べた非正規様相論理 <Katex math="{"\\mathbf{N}"}"/> についても、その直観主義版を調べています。
            </li>
          </ul>
        </li>
        <li>
          <span class="font-bold">
            正規様相論理に関する研究
          </span>
          <ul>
            <li>
              古くからよく研究され続けている正規様相論理ですが、重要な未解決問題がまだいくつか残っています。
              例えば <Katex math="{"\\mathbf{K} + \\Box^n \\varphi \\to \\Box^m \\varphi"}"/> の有限フレーム性は長年未解決のままであり、
              この問題の進展、そして解決を研究生活上の究極的な目標としています。
            </li>
          </ul>
        </li>
      </ul>

      <section>
        <h3>論文・発表等</h3>

        <p>上から新しい順に並んでいます。</p>

        <h4 class="text-primary font-bold">論文</h4>

        <ol class="space-y-3">
          {#each papers as paper}
            {#if isAccepted(paper)}
              <li>
                {@render paperArticle(paper)}
              </li>
            {/if}
          {/each}
        </ol>

        {#if papers.some((p) => !isAccepted(p))}
          <h4 class="text-primary font-bold">プレプリント</h4>

          <ol class="space-y-3">
            {#each papers as paper}
              {#if !isAccepted(paper)}
                <li>
                  {@render paperArticle(paper)}
                </li>
              {/if}
            {/each}
          </ol>
        {/if}

        <h4 class="text-primary font-bold">口頭発表</h4>

        <ol class="space-y-3">
          {#each talks as talk}
            <li>
              {@render talkArticle(talk)}
            </li>
          {/each}
        </ol>
      </section>

      <address class="not-italic">
        <h3 id="contact">連絡先</h3>
        <div class="not-prose">
          <p>
            〒657-8501 神戸市灘区六甲台町1-1
          </p>
          <p>
            神戸大学大学院 システム情報学研究科 情報数理研究室
          </p>
          <p>
            Email: <a class="text-primary underline font-medium inline" href="mailto:231x032x@gsuite.kobe-u.ac.jp">231x032x@gsuite.kobe-u.ac.jp</a>
          </p>
        </div>
      </address>

      <a href="/" class="back mt-8 text-foreground no-underline font-normal">
        Back
      </a>
    </section>
  </section>
</main>

<style lang="postcss">
  .back {
    @apply flex md:hidden items-center justify-center rounded-full px-3 py-2;
    background: linear-gradient(45deg, rgb(var(--primary) / 50%), rgb(var(--secondary) / 50%));
  }
</style>
