const { MongoClient } = require('mongodb');

module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.repisa.co",
  generateRobotsTxt: true,
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/apple-icon.*",
    "/admin",
    "/admin/*",
    "/dashboard",
    "/dashboard/*",
    "/onboarding",
    "/onboarding/*",
    "/auth/*",
    "/trial-expirado",
    "/bienvenida",
    "/pantallaplanes",
  ],
  additionalPaths: async (config) => {
    const paths = [];

    // Fetch all business usernames from database
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db();
      const businesses = await db.collection('businesses').find(
        { username: { $exists: true, $ne: null } },
        { projection: { username: 1, updatedAt: 1 } }
      ).toArray();

      for (const business of businesses) {
        paths.push({
          loc: `/${business.username}`,
          lastmod: business.updatedAt ? new Date(business.updatedAt).toISOString() : new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        });
      }

      await client.close();
    } catch (error) {
      console.error('Error fetching businesses for sitemap:', error);
    }

    return paths;
  },
};
