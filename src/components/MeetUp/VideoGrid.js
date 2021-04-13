/* eslint-disable no-nested-ternary */
// @flow
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'
import VideoGridItem from './VideoGridItem'

const styles = theme => ({
  root: {
    height: 'calc(100vh - 150px)',
    overflow: 'hidden',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  speakerViewRoot: {
    alignItems: 'flex-end',
  },
  sideBySideRoot: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  sideBySideView: {
    height: 'calc(100% - 100px) !important',
    paddingLeft: `${theme.spacing(0)}px !important`,
    paddingBottom: `${theme.spacing(0)}px !important`
  },
  notGalleyView: {
    height: 'calc(100% - 100px) !important',
    padding: `${theme.spacing(1.5)}px !important`
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
    flexDirection: 'row-reverse',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    },
  },
  galleryViews: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative'
  },
  selectedGalleryViewMode: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      height: 100,
      position: 'absolute',
      zIndex: 9,
      right: theme.spacing(5)
    }
  },
  galleryView: {
    overflowY: 'scroll',
    height: '100% !important',
  },
  view: {
    padding: theme.spacing(1.5)
  },
  gridContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: theme.spacing(0, 3, 3, 3)
  },
  initialContainer: {
    position: 'relative',
    width: 'calc(100% - 200px)',
    height: '100%',
    margin: 0,
    padding: theme.spacing(0, 3, 3, 3),
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
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
    borderRadius: 10,
    overflow: 'hidden'
  },
  shareGalleryView: {
    flexDirection: 'column',
    maxWidth: 200,
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    justifyContent: 'flex-start',
    position: 'relative',
    height: 'auto',
    right: 0
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
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
  sharedGalleryView: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 0,
      background: 'transparent'
    },
  }
})

type Props = {
  classes: Object,
  participants: Array<Object>,
  profiles: Object,
  lockedParticipant: string,
  dominantSpeaker: string,
  dominantView: boolean,
  sharingTrackIds: array,
  currentUserId: string,
  viewMode: string,
  handleSelectedScreenSharing: Function
  // isDataSharing: boolean
};

const VideoGrid = ({
  classes,
  participants,
  profiles,
  dominantSpeaker,
  dominantView,
  lockedParticipant,
  sharingTrackIds,
  viewMode,
  currentUserId,
  handleSelectedScreenSharing
}: Props) => {
  const [dominant, setDominant] = useState('')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedPage, setSelectedPage] = useState(1)

  useEffect(() => {
    if (dominantSpeaker) setDominant(dominantSpeaker)

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [dominantSpeaker, windowWidth])

  useEffect(() => {
    if (windowWidth < 700) {
      setPageSize(2)
    }
  }, [windowWidth])

  useEffect(() => {
    switch(viewMode) {
    case 'gallery-view':
      setPageSize(12)
      break
    case 'speaker-view':
      if (sharingTrackIds.length) setPageSize(1)
      break
    case 'side-by-side':
      if (sharingTrackIds.length) setPageSize(1)
      break
    default:
      break
    }
  }, [sharingTrackIds.length, viewMode])

  const numberOfParticipants = useMemo(() =>
    sharingTrackIds.length ||
    (dominantView && dominant) ||
    viewMode === 'speaker-view' ||
    viewMode === 'side-by-side'
      ? 1
      : participants.length,
  [dominant, dominantView, participants.length, sharingTrackIds, viewMode])

  const isVisible = useCallback((viewMode, identity, id, other) => {
    if (viewMode === 'speaker-view' || viewMode === 'side-by-side') {
      if (sharingTrackIds.length) {
        if (sharingTrackIds.indexOf(id) > -1 || sharingTrackIds.indexOf(other) > -1) return true
        return false
      }
      if (dominantSpeaker && dominantSpeaker === id) return true
      if (!dominantSpeaker && currentUserId === identity) return true
      return false
    }

    if (lockedParticipant) {
      if (lockedParticipant === (other || id)) return true
      return false
    }

    if (dominantView && dominant) {
      if(dominant === id) return true
      return false
    }

    return true
  }, [currentUserId, dominant, dominantSpeaker, dominantView, lockedParticipant, sharingTrackIds])

  const galleryTotalPageCount = useMemo(() => Math.ceil(participants.length / pageSize), [pageSize, participants])

  const currentPageParticipants = useMemo(() => {
    if (viewMode === 'gallery-view')
      return participants
        .slice(pageSize * (selectedPage - 1), pageSize * selectedPage)
    if (sharingTrackIds.length) {
      const sharedParticipants = []
      participants.forEach(item => {
        const sharedParticipant = item.video.length && item.video.filter(track =>
          sharingTrackIds.indexOf(item.type === 'local' ? track.id : track.sid) > -1
        )

        if (sharedParticipant.length) {
          sharedParticipants.push(item)
        }
      })

      setTotalPageCount(Math.ceil(sharedParticipants.length / pageSize))

      return sharedParticipants.slice(pageSize * (selectedPage - 1), pageSize * selectedPage)
    }
    return participants
  }, [pageSize, participants, selectedPage, sharingTrackIds, viewMode])

  const handlePageChange = useCallback((event, page) => {
    setSelectedPage(page)
  }, [])

  const renderParticipants = useCallback(() => {
    return currentPageParticipants.map((item) => {
      const profile = profiles[item.participant.identity] || {}
      const { firstName = '', lastName = '', userProfileUrl = '' } = profile

      if (item.video.length === 0) {
        return (
          <VideoGridItem
            key={item.participant.sid}
            firstName={item.participant.identity === currentUserId ? 'You' : firstName}
            lastName={item.participant.identity === currentUserId ? '' : lastName}
            profileImage={userProfileUrl}
            isVideo={false}
            totalPageCount={totalPageCount}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            handleSelectedScreenSharing={handleSelectedScreenSharing}
            sharingType={item.type}
            sharingTrackIds={sharingTrackIds}
            isMic={item.audio.length > 0}
            count={numberOfParticipants}
            isVisible={isVisible(viewMode, item.participant.identity, item.participant.sid)}
            viewMode={viewMode}
          />
        )
      }
      return item.video.map(track => {
        const id = item.type === 'local' ? track.id : track.sid
        const isVideo = item.video.length !== 0
        return (
          <VideoGridItem
            key={id}
            firstName={item.participant.identity === currentUserId ? 'You' : firstName}
            lastName={item.participant.identity === currentUserId ? '' : lastName}
            profileImage={userProfileUrl}
            video={track}
            isVideo={isVideo}
            totalPageCount={totalPageCount}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            handleSelectedScreenSharing={handleSelectedScreenSharing}
            sharingType={item.type}
            sharingTrackIds={sharingTrackIds}
            isMic={item.audio.length > 0}
            highlight={dominantSpeaker === item.participant.sid}
            count={numberOfParticipants}
            isSharing={Boolean(sharingTrackIds.indexOf(track.id) > -1)}
            isVisible={isVisible(viewMode, item.participant.identity, item.participant.sid, id)}
            viewMode={viewMode}
          />
        )
      })
    })
  }, [currentPageParticipants, currentUserId, dominantSpeaker, handleSelectedScreenSharing, isVisible, numberOfParticipants, profiles, selectedPage, sharingTrackIds, totalPageCount, viewMode])

  return (
    <div className={cx(
      classes.root,
      viewMode === 'speaker-view' && classes.speakerViewRoot,
      viewMode === 'side-by-side' && classes.sideBySideRoot
    )}>
      <Grid
        container
        spacing={1}
        justify='center'
        alignItems='center'
        alignContent='center'
        className={cx(
          numberOfParticipants > 4
            ? classes.gridContainer
            : classes.initialContainer,
          viewMode !== 'gallery-view'
            ? viewMode === 'side-by-side'
              ? classes.sideBySideView
              : classes.notGalleyView
            : classes.galleryView
        )}
      >
        {viewMode === 'gallery-view' && galleryTotalPageCount > 1 && <Pagination
          classes={{
            root: cx(classes.pagination)
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
          count={galleryTotalPageCount}
          page={selectedPage}
        />}
        {renderParticipants()}
      </Grid>
    </div>
  )
}

export default withStyles(styles)(VideoGrid)
