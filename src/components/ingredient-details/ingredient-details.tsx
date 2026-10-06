import { selectIngredients } from '@/services/slices/ingredientsSlice';
import type { TIngredient } from '@/utils/types';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const ingredientData =
    ingredients.find((item: TIngredient) => item._id === id) || null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
