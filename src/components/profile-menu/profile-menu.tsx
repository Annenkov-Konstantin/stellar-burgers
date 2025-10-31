import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../services/slices/user';
import { useTypedLocation } from '../../hooks/use-typed-location';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useTypedLocation();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
