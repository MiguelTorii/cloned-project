// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ThumbnailItem from './ThumbnailItem';
import AudioTrack from './AudioTrack';

const styles = () => ({
  root: {
    overflowY: 'auto'
  },
  item: {
    padding: 0
  }
});

type Props = {
  classes: Object,
  participants: Array<Object>,
  profiles: Object,
  lockedParticipant: string,
  sharingTrackId: string,
  onLockParticipant: Function
};

type State = {};

class Thumbnails extends React.PureComponent<Props, State> {
  state = {};

  handleClick = sid => () => {
    const { onLockParticipant } = this.props;
    onLockParticipant(sid);
  };

  renderParticipants = () => {
    const { classes, participants, profiles, lockedParticipant, sharingTrackId } = this.props;
    return participants.map(item => {
      const profile = profiles[item.participant.identity] || {};
      const { firstName = '', lastName = '', userProfileUrl = '' } = profile;

      if (item.video.length === 0) {
        return (
          <ListItem
            key={item.participant.sid}
            button
            className={classes.item}
            onClick={this.handleClick(item.participant.sid)}
          >
            <ThumbnailItem
              firstName={firstName}
              lastName={lastName}
              profileImage={userProfileUrl}
              isPinned={lockedParticipant === item.participant.sid}
              isVideo={false}
              isMic={item.audio.length > 0}
              isDataSharing={item.data.length > 0}
            />
          </ListItem>
        );
      }
      return item.video.map(track => (
        <ListItem
          key={item.type === 'local' ? track.id : track.sid}
          button
          className={classes.item}
          onClick={this.handleClick(
            item.type === 'local' ? track.id : track.sid
          )}
        >
          <ThumbnailItem
            firstName={firstName}
            lastName={lastName}
            profileImage={userProfileUrl}
            video={track}
            isPinned={
              item.type === 'local'
                ? lockedParticipant === track.id
                : lockedParticipant === track.sid
            }
            isVideo
            isSharing={Boolean(track.id === sharingTrackId)}
            isMic={item.audio.length > 0}
            isDataSharing={item.data.length > 0}
          />
        </ListItem>
      ));
    });
  };

  renderAudio = () => {
    const { participants } = this.props;
    return participants.map(item => {
      if (item.type !== 'local' && item.audio.length > 0) {
        return item.audio.map(track => (
          <AudioTrack key={track.sid} audio={track} />
        ));
      }
      return null;
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav">{this.renderParticipants()}</List>
        {this.renderAudio()}
      </div>
    );
  }
}

export default withStyles(styles)(Thumbnails);
