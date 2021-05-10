// @flow

import React from 'react'
import cx from 'classnames'
import Box from '@material-ui/core/Box'
import LoadImg from 'components/LoadImg'
import CollapseNavbar from 'components/CollapseNavbar'
import Typography from '@material-ui/core/Typography'
import useStyles from './_styles/courseChannels'

type Props = {
  course: Object,
  selectedChannel: Object,
  communityChannels: Array,
  local: Array,
  setSelctedChannel: Function
};

const CourseChannels = ({
  course,
  selectedChannel,
  communityChannels,
  local,
  setSelctedChannel
}: Props) => {
  const classes = useStyles()

  return <Box>
    {course.communityBannerUrl && <Box
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
    </Box>}
    <Box
      className={cx(course.communityBannerUrl
        ? classes.courseNameWithLogo
        : classes.courseName
      )}
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={3}
    >
      <Typography variant="h3" className={classes.name}>
        {course.name}
      </Typography>
    </Box>
    <CollapseNavbar
      channels={communityChannels}
      local={local}
      selectedChannel={selectedChannel}
      setSelctedChannel={setSelctedChannel}
    />
  </Box>
}

export default CourseChannels