export default defineNuxtRouteMiddleware(async () => {
    const auth = useCookie("auth");
  
    if(!auth.value) {
     return navigateTo("/app/login");
    }
  
  
  });
  