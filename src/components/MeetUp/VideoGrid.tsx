/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import cx from 'classnames';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

import { styles } from '../_styles/MeetUp/VideoGrid';

import AudioTrack from './AudioTrack';
import VideoGridItem from './VideoGridItem';

type Props = {
  classes: Record<string, any>;
  participants: Array<Record<string, any>>;
  profiles: Record<string, any>;
  lockedParticipant: string;
  dominantSpeaker: string;
  dominantView: boolean;
  sharingTrackIds: any[];
  localSharing: number;
  currentUserId: string;
  viewMode: string;
  handleSelectedScreenSharing: (...args: Array<any>) => any;
  meetupRef: any;
};

const VideoGrid = ({
  classes,
  participants,
  profiles,
  dominantSpeaker,
  dominantView,
  lockedParticipant,
  sharingTrackIds,
  localSharing,
  viewMode,
  currentUserId,
  handleSelectedScreenSharing,
  meetupRef
}: Props) => {
  const [dominant, setDominant] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedPage, setSelectedPage] = useState(1);
  useEffect(() => {
    if (dominantSpeaker) {
      setDominant(dominantSpeaker);
    }

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [dominantSpeaker, windowWidth]);
  useEffect(() => {
    if (windowWidth < 700) {
      setPageSize(2);
    } else {
      setPageSize(12);
    }
  }, [windowWidth]);
  useEffect(() => {
    switch (viewMode) {
      case 'gallery-view':
        setPageSize(12);
        break;

      case 'speaker-view':
        if (sharingTrackIds.length) {
          setPageSize(1);
        }

        break;

      case 'side-by-side':
        if (sharingTrackIds.length) {
          setPageSize(1);
        }

        break;

      default:
        break;
    }
  }, [sharingTrackIds.length, viewMode]);
  useEffect(() => {
    if (!localSharing && !!sharingTrackIds.length) {
      setSelectedPage(1);
    }
  }, [localSharing, sharingTrackIds]);
  const numberOfParticipants = useMemo(
    () =>
      sharingTrackIds.length ||
      (dominantView && dominant) ||
      ['speaker-view', 'side-by-side'].indexOf(viewMode) > -1
        ? 1
        : participants.length,
    [dominant, dominantView, participants.length, sharingTrackIds, viewMode]
  );
  const isVisible = useCallback(
    (viewMode, identity, id, other?) => {
      if (viewMode === 'speaker-view' || viewMode === 'side-by-side') {
        if (sharingTrackIds.length) {
          if (sharingTrackIds.indexOf(id) > -1 || sharingTrackIds.indexOf(other) > -1) {
            return true;
          }

          return false;
        }

        if (dominantSpeaker && dominantSpeaker === id) {
          return true;
        }

        if (!dominantSpeaker && currentUserId === identity) {
          return true;
        }

        return false;
      }

      if (lockedParticipant) {
        if (lockedParticipant === (other || id)) {
          return true;
        }

        return false;
      }

      if (dominantView && dominant) {
        if (dominant === id) {
          return true;
        }

        return false;
      }

      return true;
    },
    [currentUserId, dominant, dominantSpeaker, dominantView, lockedParticipant, sharingTrackIds]
  );
  const galleryTotalPageCount = useMemo(
    () => Math.ceil(participants.length / pageSize),
    [pageSize, participants]
  );
  const currentPageParticipants = useMemo(() => {
    if (viewMode === 'gallery-view') {
      return participants.slice(pageSize * (selectedPage - 1), pageSize * selectedPage);
    }

    if (sharingTrackIds.length) {
      const sharedParticipants = [];
      participants.forEach((item) => {
        const sharedParticipant =
          item.video.length &&
          item.video.filter(
            (track) => sharingTrackIds.indexOf(item.type === 'local' ? track.id : track.sid) > -1
          );

        if (sharedParticipant.length) {
          sharedParticipants.push(item);
        }
      });
      setTotalPageCount(Math.ceil(sharedParticipants.length / pageSize));
      return sharedParticipants.slice(pageSize * (selectedPage - 1), pageSize * selectedPage);
    }

    return participants;
  }, [pageSize, participants, selectedPage, sharingTrackIds, viewMode]);
  const handlePageChange = useCallback((event, page) => {
    setSelectedPage(page);
  }, []);
  const setHighlight = useCallback(
    (id, audio) => {
      if (dominantSpeaker === id) {
        return true;
      }

      if (!dominantSpeaker && audio) {
        return true;
      }

      return false;
    },
    [dominantSpeaker]
  );
  const renderAudio = useCallback(
    () =>
      participants.map((item) => {
        if (item.audio.length > 0) {
          return item.audio.map((track) => (
            <AudioTrack
              type={item.type}
              key={item.type === 'local' ? track.id : track.sid}
              audio={track}
              innerRef={meetupRef}
            />
          ));
        }

        if (!item.audio.length && item.type === 'local') {
          return <AudioTrack type={item.type} key="no-audio" audio={null} innerRef={meetupRef} />;
        }

        return null;
      }),
    [meetupRef, participants]
  );
  const renderParticipants = useCallback(
    () =>
      currentPageParticipants.map((item) => {
        const profile = profiles[item.participant.identity] || {};
        const { firstName = '', lastName = '', userProfileUrl = '' } = profile;

        if (item.video.length === 0) {
          return (
            <VideoGridItem
              key={item.participant.sid}
              firstName={item.participant.identity === currentUserId ? 'You' : firstName}
              lastName={item.participant.identity === currentUserId ? '' : lastName}
              profileImage={userProfileUrl}
              highlight={setHighlight(item.participant.sid, item.audio.length)}
              sharingTrackIds={sharingTrackIds}
              isVideo={false}
              localSharing={localSharing}
              totalPageCount={totalPageCount}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              handleSelectedScreenSharing={handleSelectedScreenSharing}
              sharingType={item.type}
              isMic={item.audio.length > 0}
              count={numberOfParticipants}
              isSharing={!!sharingTrackIds.length}
              isVisible={isVisible(viewMode, item.participant.identity, item.participant.sid)}
              viewMode={viewMode}
            />
          );
        }

        return item.video.map((track) => {
          const id = item.type === 'local' ? track.id : track.sid;
          const isVideo = item.video.length !== 0;
          return (
            <VideoGridItem
              key={id}
              firstName={item.participant.identity === currentUserId ? 'You' : firstName}
              lastName={item.participant.identity === currentUserId ? '' : lastName}
              profileImage={userProfileUrl}
              localSharing={localSharing}
              sharingTrackIds={sharingTrackIds}
              video={track}
              isVideo={isVideo}
              totalPageCount={totalPageCount}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              handleSelectedScreenSharing={handleSelectedScreenSharing}
              sharingType={item.type}
              isMic={item.audio.length > 0}
              highlight={setHighlight(item.participant.sid, item.audio.length)}
              count={numberOfParticipants}
              isSharing={!!sharingTrackIds.length}
              isVisible={isVisible(viewMode, item.participant.identity, item.participant.sid, id)}
              viewMode={viewMode}
            />
          );
        });
      }),
    [
      currentPageParticipants,
      currentUserId,
      handleSelectedScreenSharing,
      isVisible,
      localSharing,
      numberOfParticipants,
      profiles,
      selectedPage,
      setHighlight,
      sharingTrackIds,
      totalPageCount,
      viewMode
    ]
  );
  return (
    <div
      className={cx(
        classes.root,
        viewMode === 'speaker-view' && classes.speakerViewRoot,
        viewMode === 'side-by-side' && classes.sideBySideRoot
      )}
    >
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        className={cx(
          numberOfParticipants > 4 ? classes.gridContainer : classes.initialContainer,
          viewMode !== 'gallery-view'
            ? viewMode === 'side-by-side'
              ? classes.sideBySideView
              : classes.notGalleyView
            : classes.galleryView
        )}
      >
        {viewMode === 'gallery-view' && galleryTotalPageCount > 1 && (
          <Pagination
            classes={{
              root: cx(classes.pagination)
            }}
            hideNextButton
            hidePrevButton
            renderItem={(item) => (
              <PaginationItem {...item} className={classes.paginationItem} size="small" />
            )}
            onChange={handlePageChange}
            count={galleryTotalPageCount}
            page={selectedPage}
          />
        )}
        {renderParticipants()}
        {viewMode === 'gallery-view' && renderAudio()}
      </Grid>
    </div>
  );
};

export default withStyles(styles as any)(VideoGrid);
