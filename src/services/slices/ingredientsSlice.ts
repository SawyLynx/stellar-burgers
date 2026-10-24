import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '@/utils/types';

interface TIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при загрузке ингредиентов'
      );
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectIngredients = (state: {
  ingredients: ReturnType<typeof ingredientsSlice.reducer>;
}) => state.ingredients.ingredients;

export const selectIngredientsLoading = (state: {
  ingredients: ReturnType<typeof ingredientsSlice.reducer>;
}) => state.ingredients.isLoading;

export const selectIngredientsError = (state: {
  ingredients: ReturnType<typeof ingredientsSlice.reducer>;
}) => state.ingredients.error;

export default ingredientsSlice.reducer;
