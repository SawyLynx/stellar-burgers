import { ProfileOrdersUI } from '@ui-pages';
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders, selectProfileOrders } from '@/services/slices/orderSlice';


export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
