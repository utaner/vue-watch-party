// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  imports: {
    dirs: ["stores"],
  },
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["acceptHMRUpdate", "defineStore", ["defineStore", "definePiniaStore"]],
      },
    ]
  ],
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
  },
  serverHandlers: [
    {
      route: "/ws",
      handler: "~/server/socket/index.ts",
    },
    
  ],

  nitro: {
    plugins: ["~/server/plugins/mongoDB.ts"],
  },
});
