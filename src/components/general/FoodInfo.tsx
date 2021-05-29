import { Text, Box, Flex, BoxProps } from '@chakra-ui/react'
import { useFoodCategoryByIdMap } from 'core/foodsCategories/FoodsCategoriesProvider'
import { getFoodCategoryIcon } from 'core/foodsCategories'
import { Food } from 'core/types'

type Props = {
  food: Food
  nameNoOfLines?: number
  detailText?: string
} & BoxProps

function FoodInfo({ food, detailText, nameNoOfLines, ...rest }: Props) {
  const foodCategoryByIdMap = useFoodCategoryByIdMap()
  const foodCategory = foodCategoryByIdMap[food.categoryId]

  const FoodCategoryIcon = getFoodCategoryIcon(foodCategory)

  return (
    <Flex height="100%" alignItems="center">
      <Box
        height="100%"
        position="absolute"
        top="0"
        left="0"
        width="6px"
        backgroundColor={foodCategory.color}
      />

      <FoodCategoryIcon flexShrink={0} ml={1} fill="gray.600" />

      <Box ml={2}>
        <Text fontSize="md" noOfLines={nameNoOfLines} color="gray.600">
          {food.name}
        </Text>

        {detailText && (
          <Text fontSize="xs" textColor="gray.400">
            <Text as="span" fontWeight="bold" fontSize="xs">
              200kcal
            </Text>{' '}
            per 100g
          </Text>
        )}
      </Box>
    </Flex>
  )
}

export default FoodInfo