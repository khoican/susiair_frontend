/**
 * Route guard global berbasis keberadaan token di cookie `auth_token`.
 *
 * Mengalihkan pengguna tanpa token ke `/login`, dan pengguna yang sudah
 * terautentikasi menjauh dari `/login` ke `/`.
 */
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')

  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (token.value && to.path === '/login') {
    return navigateTo('/')
  }
})
