module.exports = {
    output: "export",
    basePath: process.env.NODE_ENV === "production" ? "/Dataplanet" : undefined,
    assetPrefix: process.env.NODE_ENV === "production" ? '/Dataplanet/' : undefined
}