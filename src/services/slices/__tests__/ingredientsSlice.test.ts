import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

describe('ingredientsSlice works correctly', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  test('works correctly when passed undefined or an unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('fetchIngredients.pending works correctly', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.fulfilled works correctly', () => {
    const mockIngredients = [
      { _id: '1', name: 'Ингредиент 1', type: 'bun', price: 100, proteins: 1, fat: 2, carbohydrates: 3, calories: 4, image: '', image_mobile: '', image_large: '' }
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('fetchIngredients.rejected works correctly', () => {
    const errorMessage = 'Ошибка сети при получении данных';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage },
      payload: errorMessage
    };
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});