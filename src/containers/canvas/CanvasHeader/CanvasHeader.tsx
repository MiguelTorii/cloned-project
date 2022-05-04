import React, { useCallback, useContext } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ImageLogoIcon from 'assets/img/logo-icon.png';
import { ReactComponent as LeftArrow } from 'assets/svg/arrow_left.svg';
import { ReactComponent as EditIcon } from 'assets/svg/ic_new_chat_bold.svg';
import CommunityMenu from 'components/CommunityMenu';
import DEFAULT_COMMUNITY_MENU_ITEMS from 'containers/CommunityChat/constants';
import CanvasChatContext from 'contexts/CanvasChatContext';
import { useAppSelector } from 'redux/store';

import useStyles from './CanvasHeaderStyles';

import type { ChatCommunityData } from 'api/models/APICommunity';

type CanvasHeaderProps = {
  onNewChannelClick: () => void;
};

const CanvasHeader: React.FC<CanvasHeaderProps> = ({ onNewChannelClick }) => {
  const classes = useStyles();
  const { channel, channelMetadata, community, selectCommunity, closeChannel, isCommunityChat } =
    useContext(CanvasChatContext);
  const { isDirectChat, groupName, name } = channelMetadata || {};
  const {
    data: { communities }
  } = useAppSelector((state) => state.chat);

  const activeCommunities: ChatCommunityData[] = communities.filter(
    (course) => course.community.active_course_community
  );

  const handleSelectCommunity = useCallback(
    (chat) => {
      selectCommunity(chat.id);
    },
    [selectCommunity]
  );

  const handleCreateChannel = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <AppBar position="relative" className={classes.root}>
      <Toolbar className={classes.mainBar}>
        <Box display="flex" alignItems="center">
          <img src={ImageLogoIcon} alt="Logo Icon" className={classes.logo} />
          <Typography variant="h5" color="textPrimary" className={classes.siteName}>
            CircleIn
          </Typography>
        </Box>

        <button type="button" onClick={onNewChannelClick} className={classes.editIconLink}>
          <EditIcon className={classes.editIcon} />
        </button>
      </Toolbar>

      <Toolbar className={classes.channelBar}>
        {/* On channel list page */}
        {!channel && (
          <div className={classes.badgesWrapper}>
            <CommunityMenu
              key="chat"
              item={DEFAULT_COMMUNITY_MENU_ITEMS}
              handleSelect={handleSelectCommunity}
              classes={{ listItem: classes.communityBadge }}
              selected={community === null}
            />

            {activeCommunities?.length > 0 && <div className={classes.channelTypesSeparator} />}

            {activeCommunities.map((course) => (
              <CommunityMenu
                key={course.community.id}
                item={course.community}
                handleSelect={handleSelectCommunity}
                classes={{ listItem: classes.communityBadge }}
                selected={community?.community.id === course.community.id}
              />
            ))}
          </div>
        )}

        {/* On channel page */}
        {channel && (
          <div className={classes.conversationHeader}>
            <button type="button" onClick={closeChannel} className={classes.backButton}>
              <LeftArrow />
            </button>

            <Box display="flex" flexDirection="column" width="100%">
              <Typography className={classes.channelTypeName} color="textPrimary">
                {isDirectChat ? 'Direct message' : community?.community.name}
              </Typography>

              {!isCommunityChat && (
                <Typography
                  variant="h4"
                  className={classes.channelName}
                  color="textPrimary"
                  title={isDirectChat ? name : groupName}
                >
                  {channel.friendlyName || (isDirectChat ? name : groupName)}
                </Typography>
              )}

              {isCommunityChat && (
                <Typography
                  variant="h4"
                  className={classes.channelName}
                  color="textPrimary"
                  title={isDirectChat ? name : groupName}
                >
                  #{channel.friendlyName}
                </Typography>
              )}
            </Box>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CanvasHeader;
