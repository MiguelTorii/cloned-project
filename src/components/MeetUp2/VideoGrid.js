// @flow
import React, { useState, useEffect } from 'react';
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
  dominantView: boolean,
  sharingTrackId: string
  // isDataSharing: boolean
};

const VideoGrid = ({
  classes,
  participants,
  profiles,
  dominantSpeaker,
  dominantView,
  lockedParticipant,
  sharingTrackId,
}: Props) => {
  const [dominant, setDominant] = useState('')

  useEffect(() => {
    if (dominantSpeaker) setDominant(dominantSpeaker)
  }, [dominantSpeaker])

  const isVisible = (id, other) => {
    if (lockedParticipant) {
      if (lockedParticipant === (other || id)) return true
      return false
    }

    if (sharingTrackId) {
      if (sharingTrackId === id || sharingTrackId === other) return true
      return false
    }

    if (dominantView && dominant) {
      if(dominant === id) return true
      return false
    }

    return true
  }

  const renderParticipants = () => {
    return participants.map((item) => {
      const profile = profiles[item.participant.identity] || {};
      const { firstName = '', lastName = '', userProfileUrl = '' } = profile;

      const numberOfParticipants =
        sharingTrackId || lockedParticipant || (dominantView && dominant)
          ? 1
          : participants.length
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
            isVisible={isVisible(item.participant.sid)}
            //! sharingTrackId && !lockedParticipant ||
            // (sharingTrackId === item.participant.sid && !lockedParticipant) ||
            // (!dominantView && lockedParticipant === item.participant.sid) ||
            // (dominantView && dominant === item.participant.sid)
            // }
          />
        );
      }
      return item.video.map(track => {
        const id = item.type === 'local' ? track.id : track.sid;
        const isVideo = item.video.length !== 0
        return (
          <VideoGridItem
            key={id}
            firstName={firstName}
            lastName={lastName}
            profileImage={userProfileUrl}
            video={track}
            isVideo={isVideo}
            isMic={item.audio.length > 0}
            highlight={dominantSpeaker === item.participant.sid}
            count={numberOfParticipants}
            isSharing={Boolean(track.id === sharingTrackId)}
            isVisible={isVisible(item.participant.sid, id)}
            //! sharingTrackId && !lockedParticipant ||
            // (sharingTrackId === id && !lockedParticipant) ||
            // (!dominantView && lockedParticipant === id) ||
            // (dominantView && dominant === id)
            // }
          />
        );
      });
    });
  };

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
        {renderParticipants()}
      </Grid>
    </div>
  );
}

export default withStyles(styles)(VideoGrid);
