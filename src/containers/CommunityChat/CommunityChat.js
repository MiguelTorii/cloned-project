// @flow
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import withWidth from '@material-ui/core/withWidth'
import IconButton from '@material-ui/core/IconButton'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import * as chatActions from 'actions/chat'
import Main from 'containers/CommunityChat/Main'
import RightMenu from 'containers/CommunityChat/RightMenu'
import { ReactComponent as CollapseIcon } from 'assets/svg/collapse.svg'
import type { State as StoreState } from '../../types/state'
import CourseChannels from './CourseChannels'
import useStyles from './_styles/styles'

type Props = {
  chat: Object,
  user: Object,
  setCurrentChannel: Function,
  setMainMessage: Function,
  width: string
};

const CommunityChat = ({
  selectedCourse,
  setMainMessage,
  setCurrentChannel,
  user,
  chat,
  width
}: Props) => {
  const classes = useStyles()
  const [leftSpace, setLeftSpace] = useState(2)
  const [rightSpace, setRightSpace] = useState(0)
  const [prevWidth, setPrevWidth] = useState(null)

  const [selectedChannel, setSelctedChannel] = useState(null)

  const { data: { userId, schoolId } } = user
  const {
    isLoading,
    data: {
      newMessage,
      local,
      mainMessage,
      currentChannel
    }
  } = chat

  useEffect(() => {
    const currentSelectedChannel = selectedChannel ? local[selectedChannel.id] : null
    if (currentSelectedChannel) {
      setCurrentChannel(currentSelectedChannel.twilioChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel, setCurrentChannel])

  const curSize = useMemo(() => width === 'xs' ? 6 : 2, [width])

  const handleOpenRightPanel = useCallback(() => {
    if (['xs'].includes(width)) {
      setRightSpace(0)
    } else if (!rightSpace) setRightSpace(3)
    else setRightSpace(0)
  }, [rightSpace, width])

  useEffect(() => {
    if (width !== prevWidth) {
      if (['xs'].includes(width)) {
        setRightSpace(0)
        if (currentChannel) setLeftSpace(0)
        else setLeftSpace(curSize)
      } else {
        setLeftSpace(curSize)
      }
    }

    if (currentChannel) setRightSpace(0)

    setPrevWidth(width)
  }, [prevWidth, width, curSize, currentChannel])

  const onCollapseLeft = useCallback(() => {
    if (width === 'xs') {
      setRightSpace(0)
    }
    setLeftSpace(leftSpace ? 0 : curSize)
  }, [width, curSize, leftSpace])

  const onCollapseRight = useCallback(() => {
    if (width === 'xs') {
      setLeftSpace(0)
    }
    setRightSpace(rightSpace ? 0 : curSize)
  }, [width, curSize, rightSpace])

  const renderIcon = useCallback(d => {
    return (d
      ? <CollapseIcon className={classes.icon} />
      : <ArrowForwardIcon className={classes.icon} />
    )
  }, [classes.icon])

  return (
    <Grid
      className={classes.container}
      direction='row'
      container
    >
      <IconButton
        className={cx(
          leftSpace !== 0 ? classes.leftDrawerOpen : classes.leftDrawerClose,
          classes.iconButton
        )}
        onClick={onCollapseLeft}
      >
        {renderIcon(leftSpace !== 0)}
      </IconButton>
      <Grid
        item
        xs={leftSpace || 1}
        className={leftSpace !== 0 ? classes.left : classes.hidden}
      >
        {isLoading
          ? <Box
            className={classes.loading}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
          : <CourseChannels
            setSelctedChannel={setSelctedChannel}
            selectedChannel={selectedChannel}
            local={local}
            course={selectedCourse}
          />}
      </Grid>
      <Grid item xs={12 - leftSpace - rightSpace} className={classes.main}>
        <Main
          isCommunityChat
          selectedCourse={selectedCourse}
          newMessage={newMessage}
          setMainMessage={setMainMessage}
          mainMessage={mainMessage}
          local={local}
          channel={currentChannel}
          onCollapseLeft={onCollapseLeft}
          onCollapseRight={onCollapseRight}
          setRightPanel={handleOpenRightPanel}
          user={user}
        />
      </Grid>
      <Grid
        item xs={rightSpace || 1}
        className={rightSpace !== 0 ? classes.right : classes.hidden}
      >
        <RightMenu
          userId={userId}
          schoolId={schoolId}
          channel={currentChannel}
          local={local}
        />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat,
})

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      setMainMessage: chatActions.setMainMessage,
      setCurrentChannel: chatActions.setCurrentChannel,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(CommunityChat))