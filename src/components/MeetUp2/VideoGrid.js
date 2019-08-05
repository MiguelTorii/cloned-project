// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VideoGridItem from './VideoGridItem';

const styles = () => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    maxHeight: '100vh',
    width: '100vw',
    overflow: 'hidden'
  }
});

type Props = {
  classes: Object,
  participants: Array<Object>,
  lockedParticipant: string,
  dominantSpeaker: string,
  sharingTrackId: string
};

type State = {};

class VideoGrid extends React.PureComponent<Props, State> {
  renderParticipants = () => {
    const {
      participants,
      lockedParticipant,
      dominantSpeaker,
      sharingTrackId
    } = this.props;
    return participants.map(item => {
      if (item.video.length === 0) {
        return (
          <VideoGridItem
            key={item.participant.sid}
            firstName="Camilo"
            lastName="Rios"
            profileImage="https://dev-media.circleinapp.com/profile_images/11qFZR1KKs0hxzQiH2YSWplr3rOvonIwyL.jpg"
            isVideo={false}
            isMic={item.audio.length > 0}
            isVisible={
              lockedParticipant === item.participant.sid ||
              (lockedParticipant === '' &&
                sharingTrackId === '' &&
                dominantSpeaker === item.participant.sid)
            }
          />
        );
      }
      return item.video.map(track => {
        const id = item.type === 'local' ? track.id : track.sid;
        return (
          <VideoGridItem
            key={item.type === 'local' ? track.id : track.sid}
            firstName="Camilo"
            lastName="Rios"
            profileImage="https://dev-media.circleinapp.com/profile_images/11qFZR1KKs0hxzQiH2YSWplr3rOvonIwyL.jpg"
            video={track}
            isVideo
            isMic={item.audio.length > 0}
            isVisible={
              lockedParticipant === id ||
              (lockedParticipant === '' &&
                sharingTrackId === '' &&
                dominantSpeaker === item.participant.sid) ||
              (lockedParticipant === '' && sharingTrackId === id)
            }
          />
        );
      });
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} style={{ height: '100%' }}>
          {this.renderParticipants()}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(VideoGrid);
