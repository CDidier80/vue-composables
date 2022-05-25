import dayjs from "dayjs"
import { ref, computed, unref } from "vue"

/**
 * Exposes start & end date refs for manipulation in date inputs.
 * @returns Filter formatted for a spraypaint record fetch.
 */
export default function useDateRangeFilter(
  initStartDate: string | null = null,
  initEndDate: string | null = null,
  useFullDays = false
) {
  const startDate = ref(unref(initStartDate))
  const endDate = ref(unref(initEndDate))

  const filter = computed(() =>
    useFullDays
      ? /* Include the full day of each timestamp in the date range */
        {
          gte: !startDate.value
            ? null
            : dayjs(startDate.value).startOf("day").format(),
          lte: !endDate.value
            ? null
            : dayjs(endDate.value).endOf("day").format()
        }
      : /* Uses precise timestamp values to make range */
        {
          gte: !startDate.value ? null : dayjs(startDate.value).format(),
          lte: !endDate.value ? null : dayjs(endDate.value).format()
        }
  )

  return { startDate, endDate, filter }
}
