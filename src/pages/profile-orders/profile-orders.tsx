import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserOrders,
  getUserOrdersLoading,
  fetchUserOrders
} from '../../services/slices/userOrders';
import { Preloader } from '../../components/ui/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(getUserOrders);
  const isLoading = useSelector(getUserOrdersLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
