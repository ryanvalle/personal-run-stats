import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID;

function getClient() {
  return new Client({ auth: process.env.NOTION_TOKEN });
}

// Maps a Notion "Blog Posts" database page to a plain post summary object
export function mapPostProperties(page) {
  const properties = page.properties || {};
  return {
    id: page.id,
    slug: (properties.slug?.rich_text?.[0]?.plain_text || '').trim(),
    title: properties.title?.title?.[0]?.plain_text || 'Untitled',
    date: properties.date?.date?.start || null,
    excerpt: properties.excerpt?.rich_text?.[0]?.plain_text || '',
    tags: (properties.tags?.multi_select || []).map((tag) => tag.name),
    cover: properties.cover?.url || null
  };
}

export async function getPublishedPosts() {
  const notion = getClient();
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: 'status', select: { equals: 'Published' } },
    sorts: [{ property: 'date', direction: 'descending' }]
  });

  return response.results.map(mapPostProperties).filter((post) => post.slug);
}

export async function getPostBySlug(slug) {
  const notion = getClient();
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    page_size: 1,
    filter: {
      and: [
        { property: 'status', select: { equals: 'Published' } },
        { property: 'slug', rich_text: { equals: slug } }
      ]
    }
  });

  const page = response.results[0];
  if (!page) return null;

  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const { parent } = n2m.toMarkdownString(mdBlocks);

  return {
    ...mapPostProperties(page),
    content: parent || ''
  };
}
