import { parseChannelMetadata, removeCurrentUserFromGroupName } from 'utils/chat';

import { useAppSelector } from 'redux/store';

import { useChannelsMetadata } from './useChannelsMetadata';

import type { ParsedChannelMetadata } from 'features/chat';
import type { UseQueryResult } from 'react-query';

export const useParsedChannelMetadataById = (
  sid?: string
): UseQueryResult<ParsedChannelMetadata> | { data: null } => {
  const userId = useAppSelector((state) => state.user.data.userId);
  const firstName = useAppSelector((state) => state.user.data.firstName);
  const lastName = useAppSelector((state) => state.user.data.lastName);
  const results = useChannelsMetadata((data) => (sid ? data[sid] : undefined));
  const metaData = parseChannelMetadata(userId, results.data);

  if (!sid) {
    return {
      data: null
    };
  }

  return {
    ...results,
    data: {
      ...metaData,
      groupName: removeCurrentUserFromGroupName(results.data?.groupName || '', {
        firstName,
        lastName
      })
    }
  };
};

export default useParsedChannelMetadataById;
