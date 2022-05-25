import { onBeforeUnmount, onMounted } from "vue"

export default function useWindowUnloadConfirmation() {
  function showPersistenceAlert(e: Event) {
    e.preventDefault()
    /* @ts-ignore - deprecated & incorrectly typed property still required by Chrome. */
    e.returnValue = ""
    window.confirm("Are you sure? Your changes won't be saved.")
  }

  onMounted(() => {
    window.addEventListener("beforeunload", showPersistenceAlert)
  })

  onBeforeUnmount(() => {
    removeListener()
  })

  function removeListener() {
    window.removeEventListener("beforeunload", showPersistenceAlert)
  }

  return {
    removeListener
  }
}
