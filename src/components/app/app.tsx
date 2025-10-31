import '../../index.css';
import styles from './app.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppHeader } from '@components';
import { ConstructorPage } from '@pages';
import { IngredientPage } from '../../pages/ingredient-page/ingredient-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Modal } from '../modal/modal';
import { Register } from '../../pages/register';
import { ProtectedRoute } from '../protectedRoute/protectedRoute';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Preloader } from '../ui/preloader';
import { useTypedLocation } from '../../hooks/use-typed-location';
import { getUser, isAuthChecked } from '../../services/slices/user';
import {
  getIngredients,
  getIngredientsIsRequested,
  getIngredientsError
} from '../../services/slices/ingredients';

const App = () => {
  const navigate = useNavigate();
  const location = useTypedLocation();
  const dispatch = useDispatch();

  const ingredientsIsRequested = useSelector(getIngredientsIsRequested);
  const ingredientsError = useSelector(getIngredientsError);
  const authChecked = useSelector(isAuthChecked);

  const background = location.state?.background;

  useEffect(() => {
    dispatch(getUser());
    if (!ingredientsIsRequested) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredientsIsRequested]);

  if (!authChecked) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  if (ingredientsError) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium`}>
          Ошибка загрузки данных: {ingredientsError}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты с поддержкой модальных окон */}
      <Routes location={background || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Маршруты только для неавторизованных */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnauth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnauth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnauth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnauth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => navigate('/profile/orders', { replace: true })}
              >
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
