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
  lockedParticipant: string,
  onLockParticipant: Function
};

type State = {};

class Thumbnails extends React.PureComponent<Props, State> {
  state = {};

  componentDidMount = () => {
    console.log('thumbnails mounted');
  };

  componentWillUnmount = () => {
    console.log('thumbnails unmounted');
  };

  handleClick = sid => () => {
    const { onLockParticipant } = this.props;
    onLockParticipant(sid);
  };

  renderParticipants = () => {
    const { classes, participants, lockedParticipant } = this.props;
    return participants.map(item => {
      if (item.video.length === 0) {
        return (
          <ListItem
            key={item.participant.sid}
            button
            className={classes.item}
            onClick={this.handleClick(item.participant.sid)}
          >
            <ThumbnailItem
              firstName="Camilo"
              lastName="Rios"
              profileImage="https://dev-media.circleinapp.com/profile_images/11qFZR1KKs0hxzQiH2YSWplr3rOvonIwyL.jpg"
              isPinned={lockedParticipant === item.participant.sid}
              isVideo={false}
              isMic={item.audio.length > 0}
            />
          </ListItem>
        );
      }
      return item.video.map(track => (
        <ListItem
          key={item.type === 'local' ? track.id : track.sid}
          button
          className={classes.item}
          onClick={this.handleClick(item.participant.sid)}
        >
          <ThumbnailItem
            firstName="Camilo"
            lastName="Rios"
            profileImage="https://dev-media.circleinapp.com/profile_images/11qFZR1KKs0hxzQiH2YSWplr3rOvonIwyL.jpg"
            video={track}
            isPinned={lockedParticipant === item.participant.sid}
            isVideo
            isMic={item.audio.length > 0}
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
        <List component="nav">
          {this.renderParticipants()}
          {/* {[0, 1].map(item => (
            <ListItem
              key={item}
              button
              className={classes.item}
              onClick={this.handleClick(item)}
            >
              <ThumbnailItem
                firstName="Camilo"
                lastName="Rios"
                profileImage="https://dev-media.circleinapp.com/profile_images/11qFZR1KKs0hxzQiH2YSWplr3rOvonIwyL.jpg"
                isPinned={false}
                isVideo={false}
                isMic={false}
              />
            </ListItem>
          ))} */}
        </List>
        {this.renderAudio()}
      </div>
    );
  }
}

export default withStyles(styles)(Thumbnails);
