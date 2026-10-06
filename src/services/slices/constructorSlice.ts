import {
  createSlice,
  createAsyncThunk,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import type { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

interface TConstructorSliceState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: TConstructorSliceState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
};

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка оформления заказа'
      );
    }
  }
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown,
} = constructorSlice.actions;

export const selectConstructorBun = (state: {
  burgerConstructor: TConstructorSliceState;
}) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: {
  burgerConstructor: TConstructorSliceState;
}) => state.burgerConstructor.ingredients;
export const selectOrderRequest = (state: {
  burgerConstructor: TConstructorSliceState;
}) => state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: {
  burgerConstructor: TConstructorSliceState;
}) => state.burgerConstructor.orderModalData;

export default constructorSlice.reducer;
