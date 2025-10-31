import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

export interface ResetPasswordUIProps {
  errorText: string;
  password: string;
  token: string;
  setPassword: Dispatch<SetStateAction<string>>;
  setToken: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: SyntheticEvent) => void;
  isLoading?: boolean;
  isValid?: boolean;
  fieldErrors?: {
    password?: string;
    token?: string;
  };
}
