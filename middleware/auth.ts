export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie('authorization');

  
  if (token.value) {
    return navigateTo('/');
  }
});
