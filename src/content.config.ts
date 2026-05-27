import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bookSchema = z.object({
  title: z.string(),
  slug: z.string(),
  cover: z.string(),
  description: z.string(),
  year: z.number().optional(),
  reviews: z.array(z.object({ quote: z.string(), source: z.string() })).optional(),
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
