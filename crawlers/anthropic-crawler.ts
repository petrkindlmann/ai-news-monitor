import { chromium } from 'playwright';

interface BlogPost {
  source: string;
  external_id: string;
  title: string;
  url: string;
  published_at: string | null;
}

async function crawlAnthropic(): Promise<BlogPost[]> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: 'AI-News-Monitor/1.0 (https://ai-news.kindlmann.com)',
  });

  const page = await context.newPage();
  const posts: BlogPost[] = [];

  try {
    await page.goto('https://www.anthropic.com/news', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('article, [class*="post"], [class*="article"]', {
      timeout: 10000,
    });

    const elements = await page.$$('article, [class*="post"], [class*="article"]');

    for (const element of elements.slice(0, 20)) {
      try {
        const linkEl = await element.$('a[href*="/news/"]');
        const titleEl = await element.$('h2, h3, [class*="title"]');
        const dateEl = await element.$('time, [class*="date"]');

        if (!linkEl || !titleEl) continue;

        const href = await linkEl.getAttribute('href');
        const title = await titleEl.textContent();
        const dateText = dateEl ? await dateEl.textContent() : null;

        if (!href || !title) continue;

        const url = href.startsWith('http')
          ? href
          : new URL(href, 'https://www.anthropic.com').toString();

        const external_id = url.split('/').filter(Boolean).pop() ||
          Buffer.from(url).toString('base64').slice(0, 32);

        let published_at: string | null = null;
        if (dateText) {
          const date = new Date(dateText.trim());
          if (!isNaN(date.getTime())) {
            published_at = date.toISOString();
          }
        }

        posts.push({
          source: 'anthropic_blog',
          external_id,
          title: title.trim(),
          url,
          published_at,
        });
      } catch {
        // Skip individual post errors
      }
    }
  } finally {
    await browser.close();
  }

  return posts;
}

crawlAnthropic()
  .then(posts => console.log(JSON.stringify(posts)))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
