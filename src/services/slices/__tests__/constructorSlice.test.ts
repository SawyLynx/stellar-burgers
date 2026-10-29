import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetOrder,
  createOrder,
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

describe('constructorSlice reducer works correctly', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null,
  };

  const mockBun: TIngredient = {
    _id: 'bun123',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 200,
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 100,
    image: '',
    image_mobile: '',
    image_large: '',
  };

  const mockSauce: TIngredient = {
    _id: 'sauce123',
    name: 'Соус Spicy-X',
    type: 'sauce',
    price: 50,
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 10,
    image: '',
    image_mobile: '',
    image_large: '',
  };

  test('slice works correctly when passed undefined or an unknown action', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('add bun works correctly', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);
    expect(state.bun).toEqual(expect.objectContaining({ _id: 'bun123', type: 'bun' }));
    expect(state.bun).toHaveProperty('id');
  });

  test('add filling/sauce works correctly', () => {
    const action = addIngredient(mockSauce);
    const state = constructorReducer(initialState, action);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({ _id: 'sauce123', type: 'sauce' })
    );
  });

  test('remove ingredient works correctly', () => {
    const ingredientWithId: TConstructorIngredient = {
      ...mockSauce,
      id: 'unique-id-111',
    };
    const populatedState = { ...initialState, ingredients: [ingredientWithId] };

    const action = removeIngredient('unique-id-111');
    const state = constructorReducer(populatedState, action);
    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredientUp works correctly', () => {
    const item1 = { ...mockSauce, id: 'id-1', name: 'Соус 1' };
    const item2 = { ...mockSauce, id: 'id-2', name: 'Соус 2' };
    const populatedState = { ...initialState, ingredients: [item1, item2] };

    const action = moveIngredientUp(1);
    const state = constructorReducer(populatedState, action);
    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  test('moveIngredientDown works correctly', () => {
    const item1 = { ...mockSauce, id: 'id-1', name: 'Соус 1' };
    const item2 = { ...mockSauce, id: 'id-2', name: 'Соус 2' };
    const populatedState = { ...initialState, ingredients: [item1, item2] };

    const action = moveIngredientDown(0);
    const state = constructorReducer(populatedState, action);
    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  test('resetOrder works correctly', () => {
    const dirtyState = {
      ...initialState,
      orderModalData: { number: 123 } as Partial<TOrder> as TOrder,
      orderRequest: true,
    };
    const action = resetOrder();
    const state = constructorReducer(dirtyState, action);
    expect(state.orderModalData).toBeNull();
    expect(state.orderRequest).toBe(false);
  });

  test('createOrder.pending works correctly', () => {
    const action = { type: createOrder.pending.type };
    const state = constructorReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  test('createOrder.fulfilled and clear cart works correctly', () => {
    const mockOrder = { number: 9999 };
    const dirtyState = {
      ...initialState,
      bun: mockBun,
      ingredients: [{ ...mockSauce, id: '1' }],
      orderRequest: true,
    };
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };
    const state = constructorReducer(dirtyState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('createOrder.rejected works correctly', () => {
    const errorMsg = 'Не удалось отправить заказ';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMsg },
      payload: errorMsg,
    };
    const state = constructorReducer({ ...initialState, orderRequest: true }, action);

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
