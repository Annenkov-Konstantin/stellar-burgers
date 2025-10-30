import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getIngredientsFromState } from '../../services/slices/ingredients';
import { getFeedOrderByNumber } from '../../services/slices/feeds';
import { getUserOrderByNumber } from '../../services/slices/userOrders';
import {
  fetchOrderByNumber,
  getOrderDetails,
  getOrderDetailsLoading,
  getOrderDetailsError
} from '../../services/slices/orderDetails';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const ingredients: TIngredient[] = useSelector(getIngredientsFromState);

  const feedOrder = useSelector((state) =>
    getFeedOrderByNumber(state)(number!)
  );
  const userOrder = useSelector((state) =>
    getUserOrderByNumber(state)(number!)
  );
  const serverOrder = useSelector(getOrderDetails);
  const loading = useSelector(getOrderDetailsLoading);
  const error = useSelector(getOrderDetailsError);

  const orderData = userOrder || feedOrder || serverOrder;

  useEffect(() => {
    if (!userOrder && !feedOrder && number && !isNaN(parseInt(number))) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number, userOrder, feedOrder]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || error) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
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
      total
    };
  }, [orderData, ingredients, loading, error]);

  if (loading && !orderInfo) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
