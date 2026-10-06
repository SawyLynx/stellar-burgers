import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeedOrders, fetchFeed } from '../../services/slices/feedSlice';
import { useParams } from 'react-router-dom';
import { fetchProfileOrders, selectProfileOrders } from '@/services/slices/orderSlice';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);

  useEffect(() => {
    if (!feedOrders.length) {
      dispatch(fetchFeed());
    }
    if (!profileOrders.length) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, feedOrders.length, profileOrders.length]);

  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNumber = parseInt(number, 10);

    return (
      feedOrders.find((item) => item.number === orderNumber) ||
      profileOrders.find((item) => item.number === orderNumber) ||
      null
    );
  }, [feedOrders, profileOrders, number]);

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
