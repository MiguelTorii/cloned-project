/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
// @flow
import React, { useState } from 'react'
import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { ReactComponent as ChannelIcon } from 'assets/svg/public-channel.svg'
import { ReactComponent as UnreadMessageChannelIcon }  from 'assets/svg/unread-message-channel-icon.svg'

const useStyles = makeStyles(theme => ({
  navLink: {
    textTransform: "capitalize",
    maxHeight: 32
  },
  unreadMessageChannel: {
    color: 'white',
    fontWeight: 700
  },
  childChannel: {
    paddingLeft: theme.spacing(5)
  },
  selected: {
    background: theme.circleIn.palette.modalBackground
  },
  channelName: {
    fontSize: 14
  },
  channelIcon: {
    minWidth: 20
  },
  selectedChannel: {
    color: 'white'
  },
  hide: {
    display: 'none'
  }
}))

type Props = {
  channels: Array,
  selectedChannel: Array,
  local: Array,
  setSelctedChannel: Function
};

const CollapseNavbar = ({
  channels,
  selectedChannel,
  local,
  setSelctedChannel
}: Props) => {
  const classes = useStyles();
  const [subListOpen, setSubListOpen] = useState('')

  const handleSubList = (parent, channel) => () => {
    if (subListOpen === parent) {
      setSubListOpen('')
    } else {
      setSubListOpen(parent)
    }

    if (!channel?.channels) {
      setSelctedChannel(channel)
    }
  };
  console.log('----selectedChannel---')
  console.log(selectedChannel)
  const renderChannels = channels => {
    const content = []
    channels.forEach(channel => {
      content.push(
        <ListItem
          key={channel?.channels ? channel.created : channel.chat_id}
          className={cx(
            classes.navLink,
            !channel?.channels && classes.childChannel,
            !channel?.channels && !local[channel.chat_id] && classes.hide
          )}
          selected={selectedChannel && selectedChannel.chat_id === channel.chat_id}
          classes={{ selected: classes.selected }}
          onClick={handleSubList(
            channel?.channels ? channel.created : channel.chat_name,
            channel
          )}
          button
        >
          {channel?.channels
            ? <ListItemIcon classes={{ root: classes.channelIcon }}>
              {subListOpen === channel?.created
                ? <ExpandLess />
                : <ExpandMore />
              }
            </ListItemIcon>
            : local[channel.chat_id] ? <ListItemIcon classes={{ root: classes.channelIcon }}>
              {local[channel.chat_id]?.unread
                ? <UnreadMessageChannelIcon />
                : <ChannelIcon />}
            </ListItemIcon> : null
          }
          {channel?.channels
            ? <ListItemText
              classes={{ primary: classes.channelName }}
              primary={channel.created}
            />
            : local[channel.chat_id]
              ? <ListItemText
                classes={{ primary: cx(
                  classes.channelName,
                local[channel.chat_id]?.unread && classes.unreadMessageChannel
                ) }}
                primary={local[channel.chat_id] && channel.chat_name}
              />
              : null}
        </ListItem>,
        channel?.channels && renderSubList(channel.channels, channel.created)
      )
    })

    return content;
  }


  const renderSubList = (childChannels, parentChannelName) => {
    console.log('--------childChannels----')
    console.log(childChannels)
    return <Collapse
      in={subListOpen !== parentChannelName}
      timeout="auto"
      unmountOnExit
      key={parentChannelName}
    >
      <List component="div">
        {renderChannels(childChannels)}
      </List>
    </Collapse>
  }

  return <List component="nav">
    {renderChannels(channels)}
  </List>

}

export default CollapseNavbar