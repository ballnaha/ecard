import { MetadataRoute } from 'next';
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://e-card.seteventthailand.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // You can add more URLs here as you create more pages
  ];
}
