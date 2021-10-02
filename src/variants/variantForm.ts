import { MealForm } from 'meals'
import { v4 as uuidv4 } from 'uuid'
import { object, string } from 'yup'
import deepCopy from 'general/deepCopy'

type VariantForm = {
  fieldId: string
  name: string
  mealsForms: MealForm[]
}

function getVariantForm(name: string): VariantForm {
  const fieldId = uuidv4()

  return {
    fieldId,
    name,
    mealsForms: [],
  }
}

const variantFormSchema = object().shape({
  name: string()
    .required('Please add a name')
    .test(
      'uniqueName',
      'This name has alredy been used',
      (name, { options }) => {
        const variantsFormsNames = options.context as string[]

        return (
          name !== undefined &&
          !variantsFormsNames.includes(name.toLocaleLowerCase())
        )
      }
    ),
})

function getInsertVariantFormAnimationKey(fieldId: string) {
  return `insert-variant-animmation-${fieldId}`
}

function duplicate(originalVariantForm: VariantForm) {
  const copiedVariantForm = deepCopy(
    originalVariantForm,
    (key: string, value: any) => {
      if (key === 'fieldId') {
        return uuidv4()
      }

      return value
    }
  ) as VariantForm

  return copiedVariantForm
}

export type { VariantForm }

export {
  getVariantForm,
  getInsertVariantFormAnimationKey,
  variantFormSchema,
  duplicate,
}
