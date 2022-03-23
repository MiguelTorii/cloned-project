import React, { useCallback } from 'react';

import cx from 'classnames';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import { cypherClass } from 'utils/crypto';

import CollapseNavbar from 'components/CollapseNavbar/CollapseNavbar';
import LoadImg from 'components/LoadImg/LoadImg';
import { useSelectChannelById } from 'features/chat';
import { selectCurrentCommunityWithChannels } from 'reducers/chat';
import { useAppSelector } from 'redux/store';

import useStyles from './_styles/courseChannels';

import type { ChatCommunity } from 'api/models/APICommunity';
import type { CommunityChannelData } from 'reducers/chat';

type Props = {
  currentCommunity: ChatCommunity;
  selectedChannel?: CommunityChannelData;
};

const CourseChannels = ({ currentCommunity, selectedChannel }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: currentCommunityChannel } = useSelectChannelById(selectedChannel?.chat_id);
  const userClasses = useAppSelector((state) => state.user.userClasses);

  const currentCommunityWithChannels = useAppSelector(selectCurrentCommunityWithChannels);
  const communityChannels = currentCommunityWithChannels?.channels;

  const handleGoToFeed = useCallback(() => {
    const communityClass = [
      ...(userClasses.classList || []),
      ...(userClasses.pastClasses || [])
    ].find((item) =>
      (item.section || []).map((section) => section.sectionId).includes(currentCommunity.section_id)
    );

    if (!communityClass) {
      dispatch(push('/feed'));
      return;
    }

    dispatch(
      push(
        `/feed?class=${cypherClass({
          classId: communityClass.classId,
          sectionId: currentCommunity.section_id
        })}&pastFilter=${communityClass.isCurrent ? 'false' : 'true'}`
      )
    );
  }, [currentCommunity, userClasses, dispatch]);
  return (
    <Box>
      {currentCommunity.community_banner_url && (
        <Box
          className={classes.courseLogo}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          <LoadImg url={currentCommunity.community_banner_url} className={classes.courseBanner} />
        </Box>
      )}
      <Box
        className={cx(
          currentCommunity.community_banner_url ? classes.courseNameWithLogo : classes.courseName
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
        selectedChannel={selectedChannel}
      />
    </Box>
  );
};

export default CourseChannels;
