import { useStore } from "vuex"
import { computed } from "vue"

export default function useIsAuthenticated() {
  const store = useStore()
  const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"])
  return {
    isAuthenticated
  }
}
