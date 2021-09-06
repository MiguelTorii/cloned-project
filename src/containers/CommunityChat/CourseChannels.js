// @flow

import React, { useCallback } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { push } from 'connected-react-router';
import LoadImg from 'components/LoadImg';
import CollapseNavbar from 'components/CollapseNavbar';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './_styles/courseChannels';
import { cypher } from '../../utils/crypto';

type Props = {
  course: Object,
  selectedChannel: Object,
  startMessageLoading: Function,
  communityChannels: Array,
  local: Array,
  setSelctedChannel: Function
};

const CourseChannels = ({
  course,
  selectedChannel,
  communityChannels,
  startMessageLoading,
  local,
  setCurrentCommunityChannel,
  setSelctedChannel
}: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userClasses = useSelector((state) => state.user.userClasses);

  const handleGoToFeed = useCallback(() => {
    const courseClass = (userClasses.classList || []).find((item) =>
      (item.section || [])
        .map((section) => section.sectionId)
        .includes(course.section_id)
    );

    if (!courseClass) {
      dispatch(push('/feed'));
      return;
    }

    dispatch(
      push(
        `/feed?class=${cypher(`${courseClass.classId}:${course.section_id}`)}`
      )
    );
  }, [course, userClasses, dispatch]);

  return (
    <Box>
      {course.communityBannerUrl && (
        <Box
          className={classes.courseLogo}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          <LoadImg
            url={course.communityBannerUrl}
            className={classes.courseBanner}
          />
        </Box>
      )}
      <Box
        className={cx(
          course.communityBannerUrl
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
          {course.name}
        </Typography>
        <Link component="button" underline="none" onClick={handleGoToFeed}>
          <Typography variant="body2">Go to Class Feed</Typography>
        </Link>
      </Box>
      <CollapseNavbar
        channels={communityChannels}
        startMessageLoading={startMessageLoading}
        setCurrentCommunityChannel={setCurrentCommunityChannel}
        local={local}
        selectedChannel={selectedChannel}
        setSelctedChannel={setSelctedChannel}
      />
    </Box>
  );
};

export default CourseChannels;
