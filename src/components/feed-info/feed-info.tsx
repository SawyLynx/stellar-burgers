import { FeedInfoUI } from '@ui';

import type { TFeedState, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import {
  selectFeedError,
  selectFeedIsLoading,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@/services/slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(selectFeedOrders);

  const feed: TFeedState = {
    orders: orders,
    total: useSelector(selectFeedTotal),
    totalToday: useSelector(selectFeedTotalToday),
    isLoading: useSelector(selectFeedIsLoading),
    error: useSelector(selectFeedError),
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
