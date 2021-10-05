import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Chat from 'twilio-chat';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { decypherClass } from '../../utils/crypto';
import StudyRoomImg from '../../assets/svg/video-chat-image.svg';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import StudyRoomInvite from './StudyRoomInvite';
import { renewTwilioToken, createChannel, addGroupMembers, getGroupMembers } from '../../api/chat';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import styles from './_styles/index';

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
};
type State = {
  isLoading: boolean;
  channel: string;
  client: Record<string, any> | null | undefined;
  channels: Array<Record<string, any>>;
  errorDialog: boolean;
  errorTitle: string;
  errorBody: string;
  createChannel: string | null | undefined;
  online: boolean;
  classId: number;
  sectionId: number;
  classList: any;
  groupUsers: any;
  inviteVisible: any;
};

class StartVideo extends React.PureComponent<Props, State> {
  state: any = {
    isLoading: false,
    channel: '',
    client: null,
    channels: [],
    online: true,
    inviteVisible: false,
    classList: [],
    groupUsers: []
  };

  mounted: boolean;

  componentDidMount = () => {
    this.mounted = true;
    const {
      user: {
        userClasses: { classList },
        data: { userId }
      }
    } = this.props;
    this.setState({
      classList: [...classList]
    });
    const { classId, sectionId } = decypherClass();
    window.addEventListener('offline', () => {
      console.log('**** offline ****');
      this.setState({
        online: false
      });
      this.handleShutdownChat();
    });
    window.addEventListener('online', () => {
      console.log('**** online ****');
      this.setState({
        online: true
      });
    });

    if (userId !== '') {
      this.handleInitChat();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId }
      }
    } = prevProps;
    const { online } = this.state;

    if (prevUserId !== '' && userId === '') {
      this.handleShutdownChat();
    } else if (
      (prevUserId === '' && userId !== '' && online) ||
      (userId !== '' && online && !prevState.online)
    ) {
      this.handleInitChat();
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
    this.handleShutdownChat();
  };

  handleShutdownChat = () => {
    const { client } = this.state;

    if (client) {
      client.shutdown();
    }

    if (this.mounted) {
      this.setState({
        client: null,
        channels: []
      });
    }
  };

  handleInitChat = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    try {
      const accessToken = await renewTwilioToken({
        userId
      });

      if (!accessToken || (accessToken && accessToken === '')) {
        this.handleInitChat();
        return;
      }

      const client = await Chat.create(accessToken);
      let paginator = await client.getSubscribedChannels();

      while (paginator.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        paginator = await paginator.nextPage();
      }

      const channels = await client.getLocalChannels({
        criteria: 'lastMessage',
        order: 'descending'
      });
      this.setState({
        client,
        channels
      });
    } finally {
    }
  };

  handleChange = (event) => {
    this.setState({
      channel: event.target.value
    });
  };

  handleStart = () => {
    const { channel, groupUsers } = this.state;

    if (groupUsers.length <= 1) {
      return;
    }

    logEvent({
      event: 'Video- Start Video',
      props: {
        'Initiated From': 'Video'
      }
    });
    const win = window.open(`/video-call/${channel}`, '_blank');
    win.focus();
  };

  handleInvite = async ({ chatType, name, type, selectedUsers, startVideo = false }) => {
    const { client, channel } = this.state;

    try {
      const users = selectedUsers.map((item) => Number(item.userId));
      let chatId;
      let isNew = false;

      // Create New study room
      if (!channel) {
        const { chatId: newChatId, isNewChat } = await createChannel({
          users,
          groupName: chatType === 'group' ? name : '',
          type: chatType === 'group' ? type : '',
          thumbnailUrl: chatType === 'group' ? '' : ''
        });
        chatId = newChatId;
        isNew = isNewChat;
      } else {
        // Invite the user to existing chat
        await addGroupMembers({
          chatId: channel,
          users
        });
        chatId = channel;
      }

      if (chatId !== '') {
        const channel = await client.getChannelBySid(chatId);
        const groupUsers = await getGroupMembers({
          chatId
        });
        this.setState({
          groupUsers: [...groupUsers]
        });
        this.handleChannelUpdated({
          channel,
          isNew: isNew
        });
      }
    } catch (e) {}
  };

  handleChannelUpdated = ({ channel, isNew }: { channel: Record<string, any>; isNew: boolean }) => {
    this.setState(({ channels }) => ({
      channels: [channel, ...channels],
      channel: channel.sid
    }));
  };

  handleSetInviteVisible = () => {
    this.setState({
      inviteVisible: true
    });
  };

  handleClose = () => {
    this.setState({
      inviteVisible: false
    });
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { inviteVisible, classList, groupUsers } = this.state;
    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <div className={classes.row}>
              <Typography variant="h4">Study Room</Typography>
              <Button className={classes.button1} onClick={this.handleSetInviteVisible}>
                Start a Study Room
              </Button>
            </div>

            <Typography className={classes.subtitle} variant="body1">
              What’s better than studying? Studying with the squad of course! Study with your
              classmates from home. Pants optional. You can earn 20,000 points just for starting a
              study room!
            </Typography>

            <div className={classes.wrapper}>
              <img className={classes.img} src={StudyRoomImg} alt="study room chat" />

              <Typography className={classes.note} variant="body1" align="center">
                Get nice and cozy, stay hydrated and press the button below to select classmates to
                join you on a video chat!
              </Typography>

              <Button className={classes.button2} onClick={this.handleSetInviteVisible}>
                Start a Private Study Room
              </Button>
            </div>
          </div>
        </ErrorBoundary>
        <StudyRoomInvite
          open={inviteVisible}
          userId={userId}
          groupUsers={groupUsers}
          classList={classList}
          handleClose={this.handleClose}
          handleInvite={this.handleInvite}
          handleStart={this.handleStart}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(withStyles(styles as any)(StartVideo));
