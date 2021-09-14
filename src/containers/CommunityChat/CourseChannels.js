// @flow

import React, { useCallback } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { push } from 'connected-react-router';
import LoadImg from 'components/LoadImg/LoadImg';
import CollapseNavbar from 'components/CollapseNavbar/CollapseNavbar';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './_styles/courseChannels';
import { cypher } from '../../utils/crypto';

type Props = {
  currentCommunity: Object,
  selectedChannel: Object,
  currentCommunityChannel: Object,
  startMessageLoading: Function,
  communityChannels: Array,
  local: Array,
  setCurrentChannelSidAction: Function,
  setSelctedChannel: Function
};

const CourseChannels = ({
  currentCommunity,
  selectedChannel,
  currentCommunityChannel,
  communityChannels,
  startMessageLoading,
  local,
  setCurrentCommunityChannel,
  setCurrentChannelSidAction,
  setSelctedChannel
}: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userClasses = useSelector((state) => state.user.userClasses);

  const handleGoToFeed = useCallback(() => {
    const communityClass = (userClasses.classList || []).find((item) =>
      (item.section || [])
        .map((section) => section.sectionId)
        .includes(currentCommunity.section_id)
    );

    if (!communityClass) {
      dispatch(push('/feed'));
      return;
    }

    dispatch(
      push(
        `/feed?class=${cypher(
          `${communityClass.classId}:${currentCommunity.section_id}`
        )}`
      )
    );
  }, [currentCommunity, userClasses, dispatch]);

  return (
    <Box>
      {currentCommunity.communityBannerUrl && (
        <Box
          className={classes.courseLogo}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          <LoadImg
            url={currentCommunity.communityBannerUrl}
            className={classes.courseBanner}
          />
        </Box>
      )}
      <Box
        className={cx(
          currentCommunity.communityBannerUrl
            ? classes.courseNameWithLogo
            : classes.courseName
        )}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mb={3}
      >
        <Typography variant="h3" className={classes.name}>
          {currentCommunity.name}
        </Typography>
        <Link component="button" underline="none" onClick={handleGoToFeed}>
          <Typography variant="body2">Go to Class Feed</Typography>
        </Link>
      </Box>
      <CollapseNavbar
        channels={communityChannels}
        currentCommunityChannel={currentCommunityChannel}
        startMessageLoading={startMessageLoading}
        setCurrentCommunityChannel={setCurrentCommunityChannel}
        setCurrentChannelSidAction={setCurrentChannelSidAction}
        local={local}
        selectedChannel={selectedChannel}
        setSelctedChannel={setSelctedChannel}
      />
    </Box>
  );
};

export default CourseChannels;
