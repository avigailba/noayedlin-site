import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bookSchema = z.object({
  title: z.string(),
  slug: z.string(),
  cover: z.string(),
  description: z.string(),
  year: z.number().optional(),
  kind: z.string().optional(),
  order: z.number().optional(),
  synopsis: z.string().optional(),
  coverColor: z.string().optional(),
  excerpt: z.string().optional(),
  prizes: z.array(z.string()).optional(),
  adaptations: z.array(z.object({
    title: z.string(),
    medium: z.string(),
    year: z.number().optional(),
  })).optional(),
  reviews: z.array(z.object({ quote: z.string(), source: z.string(), starred: z.boolean().optional() })).optional(),
  purchaseLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  selectedReviews: z.array(z.object({ quote: z.string(), reviewer: z.string(), publication: z.string().optional() })).optional(),
  tagline: z.string().optional(),
  awards: z.array(z.string()).optional(),
  adaptationText: z.string().optional(),
  badge: z.string().optional(),
});

const booksEn = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/books/en' }),
  schema: bookSchema,
});

const booksHe = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/books/he' }),
  schema: bookSchema,
});

export const collections = { booksEn, booksHe };
