import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '../../components/ui/app-header/app-header';
import { getUserData } from '../../services/slices/user';

export const AppHeader: FC = () => {
  const user = useSelector(getUserData);

  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
