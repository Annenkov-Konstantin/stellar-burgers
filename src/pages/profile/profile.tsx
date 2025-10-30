import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserData,
  updateUser,
  getUserError,
  getUserLoading
} from '../../services/slices/user';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const updateError = useSelector(getUserError);
  const isLoading = useSelector(getUserLoading);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (isFormChanged) {
        const updateData: { name?: string; email?: string; password?: string } =
          {};

        if (formValue.name !== user?.name) updateData.name = formValue.name;
        if (formValue.email !== user?.email) updateData.email = formValue.email;
        if (formValue.password) updateData.password = formValue.password;

        dispatch(updateUser(updateData))
          .unwrap()
          .then(() => {
            setFormValue((prev) => ({ ...prev, password: '' }));
          })
          .catch((error) => {
            console.error('Update failed:', error);
          });
      }
    },
    [dispatch, formValue, isFormChanged, user]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      });
    },
    [user]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }));
    },
    []
  );

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateError || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      isLoading={isLoading}
    />
  );
};
