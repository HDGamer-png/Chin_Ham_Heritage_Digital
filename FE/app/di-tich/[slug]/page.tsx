import { notFound } from 'next/navigation';
import { heritageSites } from '@/content/site-data';
import { SiteDetailInteractive } from './SiteDetailInteractive';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getSiteBySlug(slug: string) {
  let siteData: any = heritageSites.find((item) => item.slug === slug) ?? null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/${slug}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const remote = await response.json();
      siteData = { ...siteData, ...remote };
    }
  } catch {}

  return siteData;
}

export default async function SiteDetailPage({ params }: { params: { slug: string } }) {
  const site = await getSiteBySlug(params.slug);

  if (!site) {
    notFound();
  }

  return <SiteDetailInteractive site={site} />;
}
