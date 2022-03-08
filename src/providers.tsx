import React, { FC } from 'react';
import { DeleteModalContextProvider } from './contexts/DeleteModalContext';
import ErrorModal from './components/ErrorModal/ErrorModal';
import { PostMonitorContextProvider } from './contexts/PostMonitorContext';

const ProviderGroup: FC = ({ children }) => (
  <DeleteModalContextProvider>
    <PostMonitorContextProvider>
      <ErrorModal>{children}</ErrorModal>
    </PostMonitorContextProvider>
  </DeleteModalContextProvider>
);

export default ProviderGroup;
