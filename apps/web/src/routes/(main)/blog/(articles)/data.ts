export type Metadata = {
  title: string;
  description: string;
  date: string;
  category: string;
  tags?: string[] | undefined;
};

export const data: Record<string, { metadata: Metadata }> = import.meta.glob(
  "/src/routes/*/blog/*/**/*.md",
  { eager: true },
);
