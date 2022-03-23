import type { FC } from 'react';
import React from 'react';

import ErrorModal from 'components/ErrorModal/ErrorModal';
import { DeleteModalContextProvider } from 'contexts/DeleteModalContext';
import { PostMonitorContextProvider } from 'contexts/PostMonitorContext';
import { useChatSubscription } from 'features/chat';

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
