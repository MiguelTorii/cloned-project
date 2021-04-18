/* eslint-disable no-nested-ternary */
// @flow
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ThumbnailItem from './ThumbnailItem';
import AudioTrack from './AudioTrack';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  sideBySideRoot: {
    flexDirection: 'column'
  },
  item: {
    padding: 0
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    alignItems: 'center'
  },
  paginationItem: {
    fontSize: 0,
    border: '1px white solid',
    height: 10,
    minWidth: 10,
    margin: theme.spacing(0, 0.5),
    '&.MuiPaginationItem-page.Mui-selected': {
      backgroundColor: 'white'
    }
  },
  prevPage: {
    paddingTop: theme.spacing(3),
    position: 'absolute',
    left: -25,
    zIndex: '9999',
    background: 'rgba(24, 25, 26, 0.75)',
    borderRadius: 10
  },
  prevPageSideView: {
    top: -30,
    left: 80,
    paddingTop: theme.spacing(1)
  },
  nextPage: {
    paddingTop: theme.spacing(3),
    position: 'absolute',
    right: -25,
    zIndex: '9999',
    background: 'rgba(24, 25, 26, 0.75)',
    borderRadius: 10
  },
  nextPageSideView: {
    bottom: -30,
    left: 80,
    paddingTop: theme.spacing(1)
  },
  labelButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  activeColor: {
    color: theme.circleIn.palette.brand
  }
});

const Thumbnails = ({
  classes,
  participants,
  profiles,
  lockedParticipant,
  sharingTrackIds,
  currentUserId,
  dominantSpeaker,
  viewMode,
  selectedScreenShareId,
  meetupRef,
  localSharing
}) => {
  const [pageCount, setPageCount] = useState(5)
  const [selectedPage, setSelectedPage] = useState(1)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth)
    }

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [dominantSpeaker, windowWidth])

  useEffect(() => {
    if (windowWidth < 700) {
      setPageCount(2)
    } else {
      setPageCount(5)
    }
  }, [windowWidth])

  useEffect(() => {
    if (viewMode === 'speaker-view') setPageCount(5)
    else setPageCount(4)
  }, [viewMode])

  const totalPageCount = useMemo(() => {
    const participantsLength = localSharing
      ? participants.length
      : participants.length - 1
    return Math.ceil(participantsLength / pageCount)
  }, [localSharing, pageCount, participants.length])

  const currentPageParticipants = useMemo(() => {
    if (localSharing) {
      return participants.slice(pageCount * (selectedPage - 1), pageCount * selectedPage)
    }
    return participants.filter(item => item.type !== 'local')
      .slice(pageCount * (selectedPage - 1), pageCount * selectedPage)

  }, [localSharing, pageCount, participants, selectedPage])

  const handlePageChange = useCallback((event, page) => {
    setSelectedPage(page)
  }, [])

  const setHighlight = useCallback((id, audio) => {
    if (dominantSpeaker === id) return true
    if (!dominantSpeaker && audio) return true
    return false
  }, [dominantSpeaker])

  const renderParticipants = useCallback(() => {
    return currentPageParticipants.map(item => {
      const profile = profiles[item.participant.identity] || {};
      const { firstName = '', lastName = '', userProfileUrl = '' } = profile;

      /*
       * Not shared screen (filter inactive speakers)
       */
      if (!sharingTrackIds.length) {
        if (dominantSpeaker === item.participant.sid) return null
        if (!dominantSpeaker && item.participant.identity === currentUserId)
          return null
        if (item.video.length === 0) {
          return <ThumbnailItem
            key={item.participant.sid}
            firstName={firstName}
            lastName={lastName}
            isLocal={item.type === 'local'}
            profileImage={userProfileUrl}
            highlight={setHighlight(item.participant.sid, item.audio.length)}
            isPinned={lockedParticipant === item.participant.sid}
            isVideo={false}
            isVisible={false}
            sharingTrackIds={sharingTrackIds}
            viewMode={viewMode}
            isMic={item.audio.length > 0}
            isDataSharing={item.data.length > 0}
          />
        }

        return item.video.map(track => {
          return <ThumbnailItem
            key={item.type === 'local' ? track.id : track.sid}
            firstName={item.participant.identity === currentUserId ? 'You' : firstName}
            lastName={item.participant.identity === currentUserId ? '' : lastName}
            isLocal={item.type === 'local'}
            profileImage={userProfileUrl}
            highlight={setHighlight(item.participant.sid, item.audio.length)}
            video={track}
            isPinned={
              item.type === 'local'
                ? lockedParticipant === track.id
                : lockedParticipant === track.sid
            }
            isVideo
            sharingTrackIds={sharingTrackIds}
            viewMode={viewMode}
            isMic={item.audio.length > 0}
            isDataSharing={item.data.length > 0}
          />
        });
      }

      /*
       * Shared screens
       * 1. item.video.length === 0 => Not shared the screen and turn off the camera
       * 2. item.video.length === 1 => Not shared the screen or turn off the camera
       *    - Need to check the screen share only
       *    - Need to check the turn on the camera only
       * 3. item.video.length > 1 => Shared screen and turn on the camera
       *    - Need to selected screenshare of Id from the Video Grid and
       *      filter that from the speaker-view or side-by-side bars
       *    - If screenshared selected on the Video Grid,
       *      need to show the Camera (or Profile photo or default turn off view)
       */
      if (item.video.length === 0) {
        return <ThumbnailItem
          key={item.participant.sid}
          firstName={firstName}
          lastName={lastName}
          isLocal={item.type === 'local'}
          profileImage={userProfileUrl}
          highlight={setHighlight(item.participant.sid, item.audio.length)}
          isPinned={lockedParticipant === item.participant.sid}
          isVideo={false}
          isVisible={false}
          sharingTrackIds={sharingTrackIds}
          viewMode={viewMode}
          isMic={item.audio.length > 0}
          isDataSharing={item.data.length > 0}
        />
      }

      return item.video.map(track => {
        if (item.video.length === 1) {
          if (selectedScreenShareId === track.id || selectedScreenShareId === track.sid) {
            return <ThumbnailItem
              key={item.participant.sid}
              firstName={firstName}
              lastName={lastName}
              isLocal={item.type === 'local'}
              profileImage={userProfileUrl}
              highlight={setHighlight(item.participant.sid, item.audio.length)}
              isPinned={lockedParticipant === item.participant.sid}
              isVideo={false}
              isVisible={false}
              sharingTrackIds={sharingTrackIds}
              viewMode={viewMode}
              isMic={item.audio.length > 0}
              isDataSharing={item.data.length > 0}
            />
          }

          return <ThumbnailItem
            key={item.type === 'local' ? track.id : track.sid}
            firstName={item.participant.identity === currentUserId ? 'You' : firstName}
            lastName={item.participant.identity === currentUserId ? '' : lastName}
            isLocal={item.type === 'local'}
            profileImage={userProfileUrl}
            highlight={setHighlight(item.participant.sid, item.audio.length)}
            video={track}
            isPinned={
              item.type === 'local'
                ? lockedParticipant === track.id
                : lockedParticipant === track.sid
            }
            isVideo
            sharingTrackIds={sharingTrackIds}
            viewMode={viewMode}
            isMic={item.audio.length > 0}
            isDataSharing={item.data.length > 0}
          />
        }

        if (selectedScreenShareId === track.id || selectedScreenShareId === track.sid) {
          const filterCamera = item.video.filter(video => {
            if (item.type === 'local') {
              return selectedScreenShareId !== video.id
            }
            return selectedScreenShareId !== video.sid
          })

          return <ThumbnailItem
            key={item.type === 'local' ? filterCamera[0].id : filterCamera[0].sid}
            firstName={item.participant.identity === currentUserId ? 'You' : firstName}
            lastName={item.participant.identity === currentUserId ? '' : lastName}
            profileImage={userProfileUrl}
            isLocal={item.type === 'local'}
            highlight={setHighlight(item.participant.sid, item.audio.length)}
            video={filterCamera[0]}
            isPinned={
              item.type === 'local'
                ? lockedParticipant === filterCamera[0].id
                : lockedParticipant === filterCamera[0].sid
            }
            isVideo
            sharingTrackIds={sharingTrackIds}
            viewMode={viewMode}
            isMic={item.audio.length > 0}
            isDataSharing={item.data.length > 0}
          />
        }

        if (sharingTrackIds.indexOf(item.type === 'local' ? track.id : track.sid) > -1) {
          return <ThumbnailItem
            key={item.type === 'local' ? track.id : track.sid}
            firstName={item.participant.identity === currentUserId ? 'You' : firstName}
            lastName={item.participant.identity === currentUserId ? '' : lastName}
            isLocal={item.type === 'local'}
            profileImage={userProfileUrl}
            highlight={setHighlight(item.participant.sid, item.audio.length)}
            video={track}
            isPinned={
              item.type === 'local'
                ? lockedParticipant === track.id
                : lockedParticipant === track.sid
            }
            isVideo
            sharingTrackIds={sharingTrackIds}
            viewMode={viewMode}
            isMic={item.audio.length > 0}
            isDataSharing={item.data.length > 0}
          />
        }
        return null
      });
    });
  }, [currentPageParticipants, currentUserId, dominantSpeaker, lockedParticipant, profiles, selectedScreenShareId, setHighlight, sharingTrackIds, viewMode]);

  const goBack = useCallback(() => {
    if (selectedPage !== 1) {
      setSelectedPage(selectedPage - 1)
    }
  }, [selectedPage])

  const goNext = useCallback(() => {
    if (selectedPage !== totalPageCount) {
      setSelectedPage(selectedPage + 1)
    }
  }, [selectedPage, totalPageCount])

  const renderAudio = useCallback(() => {
    return participants.map(item => {
      if (item.audio.length > 0) {
        return item.audio.map(track => (
          <AudioTrack
            type={item.type}
            key={item.type === 'local' ? track.id : track.sid}
            audio={track}
            innerRef={meetupRef}
          />
        ));
      }
      if (!item.audio.length && item.type === 'local') {
        return <AudioTrack
          type={item.type}
          key='no-audio'
          audio={null}
          innerRef={meetupRef}
        />
      }
      return null;
    });
  }, [meetupRef, participants]);

  return (
    <div className={cx(
      classes.root,
      viewMode === 'side-by-side' && classes.sideBySideRoot
    )}>
      {totalPageCount >  1 && <Button
        onClick={goBack}
        size="small"
        className={cx(
          classes.prevPage,
          viewMode === 'side-by-side' && classes.prevPageSideView
        )}
        classes={{
          label: classes.labelButton
        }}
      >
        {viewMode === 'speaker-view'
          ? <ArrowBackIosIcon fontSize="small" />
          : <ExpandLessIcon />}
        <Typography
          variant="p"
        >
          {selectedPage} / {totalPageCount}
        </Typography>
      </Button>}
      {totalPageCount > 1 && viewMode === 'speaker-view' && <Pagination
        classes={{
          root: classes.pagination
        }}
        hideNextButton
        hidePrevButton
        renderItem={item =>
          <PaginationItem
            {...item}
            className={classes.paginationItem}
            size='small'
          />
        }
        onChange={handlePageChange}
        count={totalPageCount}
        page={selectedPage}
      />}
      {renderParticipants()}
      {renderAudio()}
      {totalPageCount > 1 && <Button
        onClick={goNext}
        size="small"
        className={cx(
          classes.nextPage,
          viewMode==='side-by-side' && classes.nextPageSideView
        )}
        classes={{
          label: classes.labelButton
        }}
      >
        {viewMode === 'speaker-view' && <ArrowForwardIosIcon
          fontSize="small"
          className={classes.activeColor}
        />}
        <Typography
          variant="p"
        >
          {selectedPage} / {totalPageCount}
        </Typography>
        {viewMode === 'side-by-side' &&
          <ExpandMoreIcon className={classes.activeColor} />}
      </Button>}
    </div>
  );
}

export default withStyles(styles)(Thumbnails);
