/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["pbs.twimg.com", "abs.twimg.com"],
  },
  async redirects() {
    return [
      {
        source: "/i/create",
        destination: "/?createList=true",
        permanent: true,
      },
      {
        source: "/lists/:listId/members",
        destination: "/lists/:listId/?showMembers=true",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
