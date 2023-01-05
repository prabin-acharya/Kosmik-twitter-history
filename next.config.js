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
        source: "/lists/create",
        destination: "/?createList=true",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
