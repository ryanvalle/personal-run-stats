import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID;

function getClient() {
  return new Client({ auth: process.env.NOTION_TOKEN });
}

// Notion splits rich text into multiple segments when any part is formatted
function richTextToPlain(richText) {
  return (richText || []).map((segment) => segment.plain_text || '').join('');
}

// Maps a Notion "Blog Posts" database page to a plain post summary object
export function mapPostProperties(page) {
  const properties = page.properties || {};
  return {
    id: page.id,
    slug: richTextToPlain(properties.slug?.rich_text).trim(),
    title: richTextToPlain(properties.title?.title) || 'Untitled',
    date: properties.date?.date?.start || null,
    excerpt: richTextToPlain(properties.excerpt?.rich_text),
    tags: (properties.tags?.multi_select || []).map((tag) => tag.name),
    cover: properties.cover?.url || null
  };
}

export function logBlogError(context, error) {
  console.error(
    `[blog] ${context} failed (${error?.code || 'unknown'}): ${error?.message || error}.` +
    (error?.code === 'object_not_found'
      ? ' Make sure the Blog Posts database is connected to the Notion integration' +
        ' (open the database in Notion → ••• → Connections) and NOTION_BLOG_DATABASE_ID is set.'
      : '')
  );
}

export async function getPublishedPosts() {
  const notion = getClient();
  const results = [];
  let cursor;

  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      filter: { property: 'status', select: { equals: 'Published' } },
      sorts: [{ property: 'date', direction: 'descending' }]
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return results.map(mapPostProperties).filter((post) => post.slug);
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
