import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import { AppState } from 'redux/store';

// Temporary, transition to react-query
export const selectLocal = (state: AppState) => state.chat.data.local;

export const selectLocalById = createSelector(
  [selectLocal, (state: AppState, id?: string) => id],
  (local, id) => (id ? local[id] : undefined)
);

export const selectChannelKeys = createSelector(selectLocal, (local) =>
  Object.keys(local).filter(
    (l) =>
      // Use `any` type here because `Property 'channelState' is private and only accessible within class 'Channel'.`
      local[l]?.sid && !(local[l]?.twilioChannel as any)?.channelState?.attributes?.community_id
  )
);

export const selectUnread = createSelector(selectLocal, selectChannelKeys, (local, keys) =>
  keys.reduce((sum, key) => {
    if (local[key]?.unread) {
      return sum + local[key].unread;
    }
    return sum;
  }, 0)
);

export const selectChannelList = createSelector(selectLocal, selectChannelKeys, (local, keys) =>
  keys.sort((a, b) => {
    /**
     * For empty channels, twilio auto-generates a lastMessage with an auto-generated date
     * As of twilio 6.0, they are not being ordered to the bottom of the list so we have to order this manually
     */
    const aLastMessageEmpty = local[a].lastMessage.message === '';
    const bLastMessageEmpty = local[b].lastMessage.message === '';

    if (aLastMessageEmpty && !bLastMessageEmpty) {
      return 1;
    }

    if (!aLastMessageEmpty && bLastMessageEmpty) {
      return -1;
    }

    return (
      moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
    );
  })
);
