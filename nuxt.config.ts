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
        autoImports: [
          "acceptHMRUpdate",
          "defineStore",
          ["defineStore", "definePiniaStore"],
        ],
      },
    ],
  ],
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    ELASTIC_API: process.env.ELASTIC_API,
    APP_URL: process.env.APP_URL,
    EMAIL: process.env.EMAIL,
  },
  
 
  nitro: {
    plugins: ["~/server/plugins/mongoDB.ts"],
  },
});
