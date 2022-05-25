import { ref, onMounted, watch } from "vue"
import validateToken from "../services/validateToken"
import { onBeforeRouteUpdate, useRoute } from "vue-router"
import logout from "../services/logout"

/**
 * Tracks the user's authentication status and validates it
 * upon every route change. Resources are not fetched/rendered
 * on a given page until the user's access token is validated.
 */
export default function useAuthenticatedNavigation() {
  const publicRoutes = ["Login", "Calendar Survey"]
  const authenticated = ref(null)
  const route = useRoute()

  /* Set authentication status when app mounts */
  onMounted(async () => {
    authenticated.value = await validateToken()
  })

  /* Force logout when user isn't authenticated on a protected page */
  watch(authenticated, () => {
    if (!authenticated.value && !publicRoutes.includes(route)) logout()
  })

  onBeforeRouteUpdate(async (to, from, next) => {
    const authenticationRequired = !publicRoutes.includes(to.name)
    if (authenticationRequired) {
      const valid = await validateToken()
      /* Send users who failed authentication check to login screen */
      valid ? next() : next({ name: "Login" })
    }
  })
}
