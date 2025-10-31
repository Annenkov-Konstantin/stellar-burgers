import { useLocation } from 'react-router-dom';
import { LocationState, AppLocation } from '../utils/types';

export const useTypedLocation = (): AppLocation => {
  const location = useLocation();
  return {
    ...location,
    state: location.state as LocationState
  };
};
