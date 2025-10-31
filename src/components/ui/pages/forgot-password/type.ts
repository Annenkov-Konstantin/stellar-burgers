import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

export interface ForgotPasswordUIProps {
  errorText: string;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: SyntheticEvent) => void;
  isLoading?: boolean;
  isValid?: boolean;
  fieldErrors?: {
    email?: string;
  };
}
