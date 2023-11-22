module.exports = {
    output: "export",
    basePath: process.env.NODE_ENV === "production" ? "/Dataplanet": undefined,
    experimental: {
      appDir: true,
    },
    images: {
      unoptimized: true,
    },
    reactStrictMode: true,
  }