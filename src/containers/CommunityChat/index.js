// @flow
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Box from '@material-ui/core/Box'
import * as chatActions from 'actions/chat'
import DirectChat from './DirectChat'
import CollageList from './CollageList'
import CommunityChat from './CommunityChat'
import { DEFAULT_COMMUNITY_MENU_ITEMS } from './constants'
import type { State as StoreState } from '../../types/state'
import useStyles from './_styles/styles'

type Props = {
  chat: Object,
  setCurrentChannel: Function
};

const ChatPage = ({ chat, setCurrentChannel }: Props) => {
  const { data: { local }, isLoading } = chat

  const classes = useStyles()

  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState(DEFAULT_COMMUNITY_MENU_ITEMS)

  useEffect(() => {
    if (selectedCourse.id === 'chat') {
      if (!isLoading && !!Object.keys(local).length) {
        let count = 0;
        Object.keys(local).forEach(key => {
          count += local[key].unread
        })
        setUnreadMessageCount(count)
      }
    }
  }, [local, isLoading, selectedCourse])

  const handleSelect = id => () => {
    setCurrentChannel(null)
    setSelectedCourse(id)
  }

  return (
    <div className={classes.root}>
      <Box
        className={classes.collageList}
        direction='row'
      >
        <CollageList
          local={local}
          unreadMessageCount={unreadMessageCount}
          selectedCourse={selectedCourse}
          handleSelect={handleSelect}
        />
      </Box>
      {selectedCourse && selectedCourse.id === 'chat'
        ? <DirectChat />
        : <CommunityChat
          isLoading={isLoading}
          selectedCourse={selectedCourse}
        />}
    </div>
  )
}

const mapStateToProps = ({ chat }: StoreState): {} => ({
  chat,
})

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      setCurrentChannel: chatActions.setCurrentChannel,
    },
    dispatch
  )
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatPage)