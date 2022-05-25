import { Ref, ref, watch } from "vue"

import falsifyObjectValues from "@/utils/falsifyObjectValues"
import reverseObjectBooleanValues from "@/utils/reverseObjectBooleanValues"

import { Address, Bankruptcy, CreditApp, Repossession } from "@/models"
import { SpraypaintBase } from "spraypaint"
import ObjectUtil from "@/utils/ObjectUtil"

type CreditAppSectionProps = {
  highlightInvalidInputs: boolean
  creditApp: CreditApp
}

type Unique<Model extends SpraypaintBase> = Omit<Model, keyof SpraypaintBase>

type ModelVariants =
  | Unique<Repossession>
  | Unique<Bankruptcy>
  | Unique<CreditApp>
  | Unique<Address>

type BooleanHash<T> = { [K in keyof T]: boolean }

type OpenBooleanHash<T> = BooleanHash<T> & Record<string, boolean>

type HashVariant<V extends ModelVariants> = OpenBooleanHash<V>

type ValidityRef<M extends ModelVariants> = Ref<Partial<HashVariant<M>>>

export default function useInputErrorTracking<M extends ModelVariants>(
  props: CreditAppSectionProps,
  inputValidity: ValidityRef<M>
) {
  type ValidityHashKeys = keyof typeof inputValidity.value

  /* All inputs are initially not blurred */
  const blurredInputs = ref(falsifyObjectValues(inputValidity.value))

  const errorStateHighlightingOn = ref(
    reverseObjectBooleanValues(inputValidity.value)
  )

  const errors = ref(
    props.highlightInvalidInputs
      ? reverseObjectBooleanValues(inputValidity.value)
      : falsifyObjectValues(inputValidity.value)
  )

  watch(
    [blurredInputs, inputValidity, props],
    () => {
      const inputErrorHash = reverseObjectBooleanValues(inputValidity.value)
      errorStateHighlightingOn.value = inputErrorHash

      const nextErrorState = props.highlightInvalidInputs
        ? reverseObjectBooleanValues(inputValidity.value)
        : falsifyObjectValues(inputValidity.value)

      new ObjectUtil(blurredInputs.value).forEachPair((key, blurred) => {
        const _key = key as ValidityHashKeys
        const inputIsInvalid = !inputValidity.value[_key]
        if (blurred && inputIsInvalid) {
          nextErrorState[_key] = true
        }
      })

      errors.value = nextErrorState
    },
    { deep: true }
  )

  function onInputBlur(attrName: keyof HashVariant<M>) {
    blurredInputs.value = {
      ...blurredInputs.value,
      [attrName]: true
    }
  }

  return {
    onInputBlur,
    errors
  }
}
