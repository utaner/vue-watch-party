export default defineNuxtRouteMiddleware(async () => {
  const auth = useCookie("auth");

  if (auth.value) {
    const check = await fetch("/api/user/usetoken-login-check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.value}`,
      },
    });

    console.log(check);

    if (check.status == 401) {
      return navigateTo("/app/login");
    }
  } else {
    return navigateTo("/app/login");
  }
});
