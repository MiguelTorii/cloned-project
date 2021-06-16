// @flow
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Box from '@material-ui/core/Box'
import { getCommunities } from 'api/community'
import DirectChat from './DirectChat'
import CollageList from './CollageList'
import CommunityChat from './CommunityChat'
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants'
import type { State as StoreState } from '../../types/state'
import useStyles from './_styles/styles'

type Props = {
  chat: Object
};

const ChatPage = ({ chat }: Props) => {
  const { data: { local }, isLoading } = chat

  const classes = useStyles()

  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState(DEFAULT_COMMUNITY_MENU_ITEMS)
  const [communityList, setCommunities] = useState([])

  useEffect(() => {
    async function fetchCommuniteis() {
      const { communities } = await getCommunities()
      setCommunities(communities)
    }

    fetchCommuniteis()
  }, [])

  useEffect(() => {
    if (selectedCourse.id === 'chat') {
      if (!isLoading && !!Object.keys(local).length) {
        let count = 0;
        const channelList = Object.keys(local).filter(l => local[l].sid).sort((a, b) => {
          if (local[a].lastMessage.message === '') return 0
          return moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
        })

        channelList.forEach(key => {
          if (local[key]?.unread) {
            count += local[key].unread
          }
        })
        setUnreadMessageCount(count)
      }
    }
  }, [local, isLoading, selectedCourse])

  const handleSelect = course => () => {
    if (course.id !== selectedCourse?.id) {
      setSelectedCourse(course)
    }
  }

  return (
    <div className={classes.root}>
      <Box
        className={classes.collageList}
        direction='row'
      >
        {communityList && <CollageList
          local={local}
          unreadMessageCount={unreadMessageCount}
          selectedCourse={selectedCourse}
          communities={communityList}
          handleSelect={handleSelect}
        />}
      </Box>
      <Box className={classes.directChat}>
        {selectedCourse && selectedCourse.id === 'chat'
          ? <DirectChat />
          : <CommunityChat
            isLoading={isLoading}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />}
      </Box>
    </div>
  )
}

const mapStateToProps = ({ chat }: StoreState): {} => ({
  chat,
})

export default connect(
  mapStateToProps,
  null
)(ChatPage)