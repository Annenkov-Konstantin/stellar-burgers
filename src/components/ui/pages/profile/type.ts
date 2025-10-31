import React, { SyntheticEvent } from 'react';

export interface ProfileUIProps {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  updateUserError: string;
  handleCancel: (e: SyntheticEvent) => void;
  handleSubmit: (e: SyntheticEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  isValid?: boolean;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
  };
}
