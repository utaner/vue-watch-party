export default defineNuxtRouteMiddleware(async () => {
  const auth = useCookie("auth");

  alert(JSON.stringify(auth));
});
