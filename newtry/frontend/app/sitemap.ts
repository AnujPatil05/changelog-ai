import { MetadataRoute } from 'next';

// This would ideally fetch from your database
// For now, we'll create a basic sitemap structure
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://changelog-ai-live.vercel.app';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/dashboard`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        // Dynamic changelog routes would be added here
        // In production, you'd fetch all repos from DB and generate URLs
    ];
}
