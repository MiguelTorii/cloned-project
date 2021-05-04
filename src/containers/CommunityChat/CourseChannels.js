// @flow

import React from 'react'
import Box from '@material-ui/core/Box'
import LoadImg from 'components/LoadImg'
import CollapseNavbar from 'components/CollapseNavbar'
import Typography from '@material-ui/core/Typography'
import useStyles from './_styles/courseChannels'

import { COURSE_GROUPS_CHANNLES } from './constants'

type Props = {
  course: Object,
  selectedChannel: Object,
  local: Array,
  setSelctedChannel: Function
};

const CourseChannels = ({
  course,
  selectedChannel,
  local,
  setSelctedChannel
}: Props) => {
  const classes = useStyles()

  return <Box>
    {course.communityBannerUrl
      ? <Box
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
        <Typography variant="h3" className={classes.courseNameWithLogo}>
          {course.name}
        </Typography>
      </Box>
      : <Box
        className={classes.courseName}
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h3" className={classes.name}>
          {course.name}
        </Typography>
      </Box>}
    <CollapseNavbar
      channels={COURSE_GROUPS_CHANNLES}
      local={local}
      selectedChannel={selectedChannel}
      setSelctedChannel={setSelctedChannel}
    />
  </Box>
}

export default CourseChannels