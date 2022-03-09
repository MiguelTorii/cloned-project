import React, { FC } from 'react';

import { useChatSubscription } from 'features/chat';
import { PostMonitorContextProvider } from 'contexts/PostMonitorContext';
import { DeleteModalContextProvider } from 'contexts/DeleteModalContext';

import ErrorModal from 'components/ErrorModal/ErrorModal';

// Prevent re-rendering all child components when context changes
const ChatSubscriptionConsumer = ({ children }) => {
  useChatSubscription();

  return children;
};

const ProviderGroup: FC = ({ children }) => (
  <DeleteModalContextProvider>
    <PostMonitorContextProvider>
      <ErrorModal>
        <ChatSubscriptionConsumer>{children}</ChatSubscriptionConsumer>
      </ErrorModal>
    </PostMonitorContextProvider>
  </DeleteModalContextProvider>
);

export default ProviderGroup;
