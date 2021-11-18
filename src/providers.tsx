import React, { FC } from 'react';
import { DeleteModalContextProvider } from './contexts/DeleteModalContext';
import ErrorModal from './components/ErrorModal/ErrorModal';

const ProviderGroup: FC = ({ children }) => (
  <DeleteModalContextProvider>
    <ErrorModal>{children}</ErrorModal>
  </DeleteModalContextProvider>
);

export default ProviderGroup;
