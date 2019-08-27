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
      isDataSharing
    } = this.props;
    let isParticipantVisible = false;
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

      isParticipantVisible = visibleId !== '';

      if (item.video.length === 0) {
        return (
          <VideoGridItem
            key={item.participant.sid}
            firstName={firstName}
            lastName={lastName}
            profileImage={userProfileUrl}
            isVideo={false}
            isMic={item.audio.length > 0}
            isVisible={
              (!isDataSharing && visibleId === item.participant.sid) ||
              (!isParticipantVisible && index === participants.length - 1)
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
            isSharing={Boolean(track.id === sharingTrackId)}
            isVisible={
              (!isDataSharing && visibleId === id) ||
              (!isParticipantVisible && index === participants.length - 1)
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
