import React, { FC } from 'react';
import { DeleteModalContextProvider } from './contexts/DeleteModalContext';

const ProviderGroup: FC = ({ children }) => (
  <DeleteModalContextProvider>{children}</DeleteModalContextProvider>
);

export default ProviderGroup;
