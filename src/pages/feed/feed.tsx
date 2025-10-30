import { FC, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { getFeeds } from '../../services/slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feeds.orders);
  const feedsIsLoading = useSelector((state) => state.feeds.feedsIsLoading);
  const feedsIsRequested = useSelector((state) => state.feeds.feedsIsRequested);

  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    if (!feedsIsRequested) {
      handleGetFeeds();
    }
  }, [handleGetFeeds, feedsIsRequested]);

  if (feedsIsLoading && !feedsIsRequested) {
    return <Preloader />;
  }

  if (feedsIsRequested && orders.length === 0) {
    return <div>Заказов пока нет</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
