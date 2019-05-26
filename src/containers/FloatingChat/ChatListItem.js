// @flow

import React from 'react';
import MainChatItem from '../../components/FloatingChat/MainChatItem';
import { getTitle, getSubTitle } from './utils';
import ErrorBoundary from '../ErrorBoundary';

type Props = {
  channel: Object,
  userId: string,
  onOpenChannel: Function,
  onUpdateUnreadCount: Function
};

type State = {
  loading: boolean,
  name: string,
  unread: number,
  title: string,
  subTitle: string,
  groupImage: string
};

class ChatListItem extends React.PureComponent<Props, State> {
  state = {
    loading: true,
    name: '',
    unread: 0,
    title: '',
    subTitle: '',
    groupImage: ''
  };

  componentDidMount = () => {
    try {
      const { userId, channel, onUpdateUnreadCount } = this.props;
      Promise.all([
        channel.getUnconsumedMessagesCount(),
        channel.getMessages(1)
      ]).then(results => {
        const { state, members = [] } = channel;
        const { attributes = {} } = state;
        const { thumbnail = '', users = [] } = attributes;
        if (thumbnail !== '') {
          this.setState({ groupImage: thumbnail });
        } else if (users.length === 2) {
          members.forEach(member => {
            const { identity = '' } = member.state || {};
            if (Number(identity) !== Number(userId)) {
              member.getUserDescriptor().then(user => {
                this.setState({
                  groupImage: user.attributes.profileImageUrl,
                  name: user.friendlyName || ''
                });
              });
            }
          });
        }

        const unread = results[0];
        const messages = results[1];
        const { items } = messages;
        const title = getTitle(channel, userId);
        const subTitle = items.length > 0 ? getSubTitle(items[0], userId) : '';
        this.setState({
          unread: unread || 0,
          title,
          subTitle,
          loading: false
        });
        onUpdateUnreadCount(unread);
      });

      channel.on('messageAdded', message => {
        const subTitle = getSubTitle(message, userId);
        this.setState(prevState => ({
          unread: prevState.unread + 1,
          subTitle
        }));
        onUpdateUnreadCount(1);
      });
      channel.on('updated', ({ updateReasons }) => {
        if (updateReasons.indexOf('lastConsumedMessageIndex') > -1) {
          const { unread } = this.state;
          onUpdateUnreadCount(-unread);
          this.setState({ unread: 0 });
        } else if (updateReasons.indexOf('attributes') > -1) {
          const title = getTitle(channel, userId);
          this.setState({
            title
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleOpenChannel = () => {
    const { channel, onOpenChannel } = this.props;
    onOpenChannel(channel.sid);
  };

  render() {
    const { channel } = this.props;
    const { loading, name, unread, title, subTitle, groupImage } = this.state;
    return (
      <ErrorBoundary>
        <MainChatItem
          roomId={channel.sid}
          isLoading={loading}
          imageProfile={groupImage}
          name={name}
          roomName={title}
          lastMessage={subTitle}
          unReadCount={unread}
          onClick={this.handleOpenChannel}
        />
      </ErrorBoundary>
    );
  }
}

export default ChatListItem;
