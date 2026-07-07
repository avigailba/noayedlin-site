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
  coverRail: z.string().optional(),
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

const adaptationSchema = z.object({
  slug: z.string(),
  source_book: z.string(),
  title: z.string(),
  medium: z.enum(['Television series', 'Film', 'Stage play', 'Audio drama', 'Podcast']),
  country: z.string(),
  year: z.number().optional(),
  network: z.string().optional(),
  episodes: z.number().optional(),
  order: z.number(),
  still: z.object({
    image: z.string().optional(),
    gradient: z.tuple([z.string(), z.string()]).optional(),
    position: z.string().optional(),
  }).optional(),
  awards: z.array(z.string()).optional(),
  synopsis: z.string().optional(),
  watch: z.array(z.object({
    label: z.string(),
    url: z.string(),
    primary: z.boolean(),
  })).optional(),
  press: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
  info: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
  status: z.string().optional(),
  stills: z.array(z.string()).optional(),
  photo_credit: z.string().optional(),
});

const adaptations = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/adaptations' }),
  schema: adaptationSchema,
});

const aboutSchema = z.object({
  heading: z.string(),
  tagline: z.string(),
  portrait: z.string(),
  lead: z.string(),
  bio: z.array(z.string()),
  awards: z.array(z.string()),
  representation: z.array(z.object({
    role: z.string(),
    name: z.string().optional(),
    phone: z.string().optional(),
    url: z.string().optional(),
    urlLabel: z.string().optional(),
  })),
});

const about = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/about' }),
  schema: aboutSchema,
});

const mediaSchema = z.object({
  outlet: z.string(),
  headline: z.string(),
  url: z.string().optional(),
  date: z.string(),
  type: z.enum(['Essay', 'Interview', 'Review', 'Profile', 'Feature', 'Event']).optional(),
  excerpt: z.string().optional(),
  featured: z.boolean().optional(),
  language: z.string().optional(),
  draft: z.boolean().optional(),
});

const media = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/media' }),
  schema: mediaSchema,
});

const eventSchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  date_start: z.string(),
  date_end: z.string().nullish(),
  city: z.string(),
  region: z.string().nullish(),
  country: z.string(),
  venue: z.string().nullish(),
  description: z.string(),
  type: z.enum(['Lecture', 'Reading', 'Conversation', 'Festival', 'Residency']),
  status: z.enum(['details_coming_soon', 'scheduled', 'ticketed', 'past']),
  url: z.string().nullish(),
  order: z.number().optional(),
});

const events = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/events' }),
  schema: eventSchema,
});

export const collections = { booksEn, booksHe, adaptations, about, media, events };
