import { FC } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, Outlet } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useTypedLocation } from '../../hooks/use-typed-location';

type ProtectedRouteProps = {
  onlyUnauth?: boolean;
  children?: React.ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnauth = false,
  children
}) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useTypedLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnauth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};
