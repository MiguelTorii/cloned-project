// @flow
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { ReactComponent as GalleryMediumView } from 'assets/svg/gallery-medium-view.svg';
import { ReactComponent as GalleryView } from 'assets/svg/gallery-view.svg';
import VideoGridItem from './VideoGridItem';

const styles = theme => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    width: 'calc(100vw)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  minimizeRoot: {
    display: 'block',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(12)
  },
  minimizePaperRoot: {
    height: 'auto !important',
    maxWidth: 900
  },
  notGalleyView: {
    display: 'flex',
    justifyContent: 'flex-start',
    'alignContent': 'start'
  },
  paperContainer: {
    width: '100%',
    height: 'calc(100% - 200px)',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: theme.spacing(0, 3, 3, 3),
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  galleryViewPaperContainer: {
    maxWidth: 'calc(100% - 300px)',
    flexDirection: 'row-reverse'
  },
  galleryViews: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative'
  },
  selectedGalleryViewMode: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  galleryViewPagination: {
    height: '100%'
  },
  galleryView: {
    overflowY: 'scroll',
    height: '100% !important',
    paddingTop: `${theme.spacing(3)}px !important`
  },
  pagination: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    padding: theme.spacing(1.5)
  },
  gridContainer: {
    height: 'calc(100% - 70px)',
    width: '100%',
    margin: 0,
    padding: theme.spacing(0, 3, 3, 3)
  },
  pr0: {
    paddingRight: 0,
  },
  viewGalleryMode: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 150,
    maxHeight: 40,
    margin: theme.spacing(3, 3, 3, 0),
    border: `0.5px solid ${theme.circleIn.palette.white}`,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10
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
  const [pageCount, setPageCount] = useState(4)
  const [selectedPage, setSelectedPage] = useState(1)
  const [viewMode, setViewMode] = useState('gallery-view')

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

  const currentPageParticipants = useMemo(() => participants.slice(pageCount * (selectedPage - 1), pageCount * selectedPage), [pageCount, participants, selectedPage])
  const totalPageCount = useMemo(() => Math.ceil(participants.length / pageCount), [pageCount, participants.length])

  const changeViewMode = useCallback(mode => {
    setViewMode(mode)
    if (mode === 'gallery-view') {
      setPageCount(4)
    } else if (mode === 'medium-view') {
      setPageCount(12)
    } else {
      setPageCount(4)
    }
  }, [])

  const handlePageChange = useCallback((event, page) => {
    setSelectedPage(page)
  }, [])

  const renderParticipants = () => {
    return currentPageParticipants.map((item) => {
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
            viewMode={viewMode}
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
            viewMode={viewMode}
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
    <div className={cx(classes.root, viewMode === 'minimize' && classes.minimizeRoot)}>
      <Paper
        className={cx(
          classes.paperContainer,
          viewMode === 'minimize' && classes.minimizePaperRoot,
          viewMode === 'gallery-view' && classes.galleryViewPaperContainer
        )}
        elevation={3}
      >
        {participants.length > 1 && <div className={cx(
          classes.galleryViews,
          viewMode === 'gallery-view' && classes.selectedGalleryViewMode
        )}>
          {totalPageCount > 1 && <Pagination
            classes={{
              root: cx(classes.pagination, viewMode === 'gallery-view' && classes.galleryViewPagination)
            }}
            hideNextButton
            hidePrevButton
            renderItem={item =>
              <PaginationItem
                {...item}
                size='small'
                selected
              />
            }
            onChange={handlePageChange}
            count={totalPageCount}
            page={selectedPage}
          />}
          <Paper className={classes.viewGalleryMode} elevation={3}>
            <Typography className={cx(classes.view, classes.pr0)} variant="body1">
              View
            </Typography>
            <IconButton
              className={classes.pr0}
              onClick={() => changeViewMode('minimize')}
              aria-label="minimize"
            >
              <MinimizeIcon />
            </IconButton>
            <IconButton
              className={classes.pr0}
              onClick={() => changeViewMode('medium-view')}
              aria-label="gallery-medium-view"
            >
              <GalleryMediumView />
            </IconButton>
            <IconButton
              onClick={() => changeViewMode('gallery-view')}
              aria-label="gallery-view"
            >
              <GalleryView />
            </IconButton>
          </Paper>
        </div>}
        <Grid
          container
          spacing={1}
          justify='center'
          alignItems='center'
          alignContent='center'
          className={cx(
            classes.gridContainer,
            viewMode !== 'gallery-view'
              ? classes.notGalleyView
              : classes.galleryView
          )}
        >
          {renderParticipants()}
        </Grid>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(VideoGrid);
