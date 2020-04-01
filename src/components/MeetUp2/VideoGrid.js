// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VideoGridItem from './VideoGridItem';

const styles = () => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    width: 'calc(100vw)',
  },
  gridContainer: {
    height: '100%'
  }
});

type Props = {
  classes: Object,
  participants: Array<Object>,
  profiles: Object,
  lockedParticipant: string,
  dominantSpeaker: string,
  sharingTrackId: string,
  isDataSharing: boolean
};

type State = {};

class VideoGrid extends React.PureComponent<Props, State> {
  handleVerifyVisibility = (
    participant,
    numberOfParticipants,
    lockedParticipant,
    dominantSpeaker,
    sharingTrackId
  ) => {
    if (lockedParticipant === participant.participant.sid)
      return lockedParticipant;
    if (numberOfParticipants === 1) {
      if (participant.video.length === 0) return participant.participant.sid;
      const isTrackLocked = participant.video.find(
        track => track.id === lockedParticipant
      );
      if (isTrackLocked) return isTrackLocked.id;
      if (sharingTrackId !== '') return sharingTrackId;
      return participant.video[0].id;
    }
    if (numberOfParticipants > 1) {
      if (lockedParticipant !== '') return lockedParticipant;
      if (sharingTrackId !== '') return sharingTrackId;
      if (dominantSpeaker === participant.participant.sid) {
        if (participant.video.length === 0) return participant.participant.sid;
        return participant.video[0].sid;
      }
    }
    return '';
  };

  renderParticipants = () => {
    const {
      participants,
      profiles,
      lockedParticipant,
      dominantSpeaker,
      sharingTrackId,
    } = this.props;
    return participants.map((item, index) => {
      const profile = profiles[item.participant.identity] || {};
      const { firstName = '', lastName = '', userProfileUrl = '' } = profile;

      const visibleId = this.handleVerifyVisibility(
        item,
        participants.length,
        lockedParticipant,
        dominantSpeaker,
        sharingTrackId
      );

      const numberOfParticipants = sharingTrackId || lockedParticipant ? 1 : participants.length

      if (item.video.length === 0) {
        return (
          <VideoGridItem
            key={item.participant.sid}
            firstName={firstName}
            lastName={lastName}
            profileImage={userProfileUrl}
            isVideo={false}
            isMic={item.audio.length > 0}
            count={numberOfParticipants}
            isVisible={
              !sharingTrackId && !lockedParticipant ||
                (sharingTrackId === item.participant.sid && !lockedParticipant) ||
                lockedParticipant === item.participant.sid
            }
          />
        );
      }
      return item.video.map(track => {
        const id = item.type === 'local' ? track.id : track.sid;
        return (
          <VideoGridItem
            key={item.type === 'local' ? track.id : track.sid}
            firstName={firstName}
            lastName={lastName}
            profileImage={userProfileUrl}
            video={track}
            isVideo
            isMic={item.audio.length > 0}
            count={numberOfParticipants}
            isSharing={Boolean(track.id === sharingTrackId)}
            isVisible={
              !sharingTrackId && !lockedParticipant ||
                (sharingTrackId === id && !lockedParticipant) ||
                lockedParticipant === id
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
        <Grid
          container
          spacing={1}
          justify='center'
          alignItems='center'
          alignContent='center'
          className={classes.gridContainer}
        >
          {this.renderParticipants()}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(VideoGrid);
