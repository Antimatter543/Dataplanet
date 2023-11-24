const inDev = process.env.NODE_ENV === 'development';

module.exports = {
    output: "export",
    basePath: inDev ? "" : "/Dataplanet",
    assetPrefix: inDev ? "" : "/Dataplanet/",
    images: {
        unoptimized: true,
    },
}