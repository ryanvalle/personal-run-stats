import { mapPostProperties } from './blog';

function buildPage(overrides = {}) {
  return {
    id: 'page-id',
    properties: {
      title: { title: [{ plain_text: 'My First Post' }] },
      slug: { rich_text: [{ plain_text: 'my-first-post' }] },
      date: { date: { start: '2026-01-15' } },
      excerpt: { rich_text: [{ plain_text: 'A short summary.' }] },
      tags: { multi_select: [{ name: 'training' }, { name: 'race-recap' }] },
      cover: { url: 'https://ik.imagekit.io/ryanvalle/cover.jpg' },
      ...overrides
    }
  };
}

describe('mapPostProperties', () => {
  it('maps a fully populated page', () => {
    expect(mapPostProperties(buildPage())).toEqual({
      id: 'page-id',
      slug: 'my-first-post',
      title: 'My First Post',
      date: '2026-01-15',
      excerpt: 'A short summary.',
      tags: ['training', 'race-recap'],
      cover: 'https://ik.imagekit.io/ryanvalle/cover.jpg'
    });
  });

  it('trims whitespace from the slug', () => {
    const page = buildPage({ slug: { rich_text: [{ plain_text: '  my-first-post  ' }] } });
    expect(mapPostProperties(page).slug).toBe('my-first-post');
  });

  it('falls back to defaults when properties are missing', () => {
    expect(mapPostProperties({ id: 'page-id', properties: {} })).toEqual({
      id: 'page-id',
      slug: '',
      title: 'Untitled',
      date: null,
      excerpt: '',
      tags: [],
      cover: null
    });
  });

  it('returns an empty tags array when no tags are set', () => {
    const page = buildPage({ tags: { multi_select: [] } });
    expect(mapPostProperties(page).tags).toEqual([]);
  });

  it('joins multi-segment rich text (Notion splits text on formatting)', () => {
    const page = buildPage({
      title: { title: [{ plain_text: 'My ' }, { plain_text: 'Bold' }, { plain_text: ' Post' }] },
      excerpt: { rich_text: [{ plain_text: 'Part one, ' }, { plain_text: 'part two.' }] }
    });
    const post = mapPostProperties(page);
    expect(post.title).toBe('My Bold Post');
    expect(post.excerpt).toBe('Part one, part two.');
  });
});
