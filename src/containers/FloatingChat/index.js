// @flow

import React from 'react';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import MainChat from '../../components/FloatingChat/MainChat';
import MainChatItem from '../../components/FloatingChat/MainChatItem';
import ChatItem from '../../components/FloatingChat/ChatItem';

const styles = () => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'flex-end'
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  openChannels: Array<string>
};

class FloatingChat extends React.PureComponent<Props, State> {
  state = {
    openChannels: []
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateOpenChannels);
  }

  handleRoomClick = roomId => {
    const availableSlots = this.getAvailableSlots(window.innerWidth);
    if (availableSlots === 0) {
      console.log("can't show chat windows");
      return;
    }

    const newState = update(this.state, {
      openChannels: {
        $apply: b => {
          if (availableSlots === 0) return [];
          const index = b.findIndex(item => item === roomId);
          if (index > -1) {
            let newB = update(b, { $splice: [[index, 1]] });
            newB = update(newB, { $splice: [[availableSlots - 1]] });
            return [roomId, ...newB];
          }
          const newB = update(b, { $splice: [[availableSlots - 1]] });
          return [roomId, ...newB];
        }
      }
    });
    this.setState(newState);
  };

  updateOpenChannels = () => {
    const availableSlots = this.getAvailableSlots(window.innerWidth);
    if (availableSlots === 0) {
      console.log("can't show chat windows");
      this.setState({ openChannels: [] });
      return;
    }

    const newState = update(this.state, {
      openChannels: {
        $apply: b => {
          const newB = update(b, { $splice: [[availableSlots]] });
          return [...newB];
        }
      }
    });
    this.setState(newState);
  };

  getAvailableSlots = width => {
    const chatSize = 320;
    return Math.trunc((width - chatSize) / chatSize);
  };

  render() {
    const { classes, user } = this.props;
    const { openChannels } = this.state;
    const { isLoading, error, data } = user;
    if (isLoading || error) return null;
    const { userId } = data;
    if (userId === '') return null;
    return (
      <div className={classes.root}>
        {openChannels.map(item => (
          <ChatItem key={item} />
        ))}
        <MainChat>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <MainChatItem
              key={item}
              roomId={item}
              isLoading={false}
              imageProfile=""
              initials="CR"
              roomName="Benja R., Benjamin T."
              lastMessage="Benja R: Joined Video"
              unReadCount={100}
              onClick={this.handleRoomClick}
            />
          ))}
        </MainChat>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withRoot(withStyles(styles)(FloatingChat)));
