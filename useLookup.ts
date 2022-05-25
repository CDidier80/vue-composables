// @ts-nocheck
import { computed, ComputedRef as CR, Ref, unref, watch } from "vue"

export type Lookup<T> = { [K in keyof T]: T | T[] }
type MaybeReactive<T> = Ref<T> | T

/**
 * Given an Array<T> of items and property of type T, create a lookup object
 * where each value is an array item (or array of all matching items) and its
 * key is the value of the item(s)' property (e.g. "id", "name").

 * @example // every value for the given property is unique
 * const items = [
 *  {id: 1, name: "Bill"},
 *  {id: 2, name: "Bob"},
 *  {id: 3, name: "Sue"}
 * ]
 * const { lookup } = useLookup("id", items)
 * // lookup.value =>
 *  {
 *    1: { id: 1, name: "Bill" },
 *    2: { id: 2, name: "Bob" } ,
 *    3: { id: 3, name: "Sue" }
 * }

 * @example // with non-unique property values
 * const items = [
 *  { id: 1, name: "Max" },
 *  { id: 2, name: "Max" },
 *  { id: 3, name: "Sue" }
 * ]
 * const { lookup } = useLookup("name", items)
 * // lookup.value =>
 *  {
 *    "Max": [{ id: 1, name: "Max" }, { id: 2, name: "Max" }],
 *    "Sue": { id: 2, name: "Sue" }
 *  }
 * */

export default function useLookup<T>(
  prop: keyof T,
  arr: MaybeReactive<Array<T>>
): { lookup: CR<Lookup<T>> } {
  const lookup = computed(() => {
    const iterable = unref(arr)

    return iterable.reduce((lookup, item) => {
      const key = item[prop] as unknown as keyof T
      const value = lookup?.[key]
      /* If item is the first match, make it the lookup value at the key */
      if (value === undefined) return { ...lookup, [key]: item }
      /* If a second matching item is found make the lookup value an array of both */
      const oneOtherMatch = !Array.isArray(value)
      if (oneOtherMatch) {
        return { ...lookup, [key]: [value, item] }
      }
      /* If more matching items are found add them to the array */
      return { ...lookup, [key]: [...value, item] }
    }, {} as Lookup<T>)
  })

  return { lookup }
}
