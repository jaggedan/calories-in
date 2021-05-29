import { getIngredientForm, IngredientForm, MealField } from 'core/dietForm'
import { useDragAndDropResponder } from 'core/dndResponders'
import { useFoodsByIdDispatch } from 'core/foods/FoodsByIdProvider'
import { useFoodsListState } from 'core/foods/FoodsListProvider'
import { useUndoRedoMethods } from 'core/undoRedo'
import { DropResult } from 'react-beautiful-dnd'
import { useIngredientsFormsDndState } from './IngredientsFormsDndProvider'
import { isFoodCategoryDroppableId } from 'core/foodsCategories'
import { FieldArrayMethodProps } from 'react-hook-form'
import { useLayoutEffect, useState } from 'react'
import { useOneTimeCheck } from 'core/OneTimeCheckProvider'

type FunctionsParams = {
  mealField: MealField
  moveIngredientForm: (from: number, to: number) => void
  insertIngredientForm: (
    at: number,
    ingredientForm: IngredientForm,
    options?: FieldArrayMethodProps
  ) => void
  removeIngredientForm: (from: number) => void
}

const DEFAULT_AMOUNT_IN_GRAMS = 100

function useReorderIngredientsForms({
  mealField,
  moveIngredientForm,
  insertIngredientForm,
  removeIngredientForm,
}: FunctionsParams) {
  const ingredientFormRef = useIngredientsFormsDndState()
  const { saveLastChange } = useUndoRedoMethods()
  const foodsByIdDispatch = useFoodsByIdDispatch()
  const foodsListState = useFoodsListState()
  const [pendingInsert, setPendingInsert] = useState<() => void>()
  const oneTimeCheck = useOneTimeCheck()

  if (!ingredientFormRef) {
    throw new Error('Missing FoodsDragAndDropProvider')
  }

  useLayoutEffect(() => {
    if (pendingInsert) {
      pendingInsert()
    }
  }, [pendingInsert])

  useDragAndDropResponder('onDragEnd', (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      mealField.fieldId === destination.droppableId
    ) {
      moveIngredientForm(source.index, destination.index)
    } else if (destination.droppableId === mealField.fieldId) {
      let ingredientForm: IngredientForm | undefined

      if (isFoodCategoryDroppableId(source.droppableId)) {
        const food = foodsListState[source.index]

        foodsByIdDispatch({ type: 'addFood', food })

        ingredientForm = getIngredientForm({
          foodId: food.id,
          amountInGrams: DEFAULT_AMOUNT_IN_GRAMS,
        })

        oneTimeCheck.set(ingredientForm.fieldId)
      } else {
        // This form was saved at the beginning of the drag by FoodsDragAndDropProvider
        ingredientForm = ingredientFormRef.current
      }

      setPendingInsert(() => {
        if (ingredientForm) {
          insertIngredientForm(destination.index, ingredientForm, {
            shouldFocus: false,
          })
        }
      })
    } else if (source.droppableId === mealField.fieldId) {
      removeIngredientForm(source.index)
    }

    saveLastChange()
  })
}

export default useReorderIngredientsForms