import React, { useState } from 'react';

import clsx from 'clsx';

import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import PastClassesImg from 'assets/svg/past_classes.svg';
import CommunityMenu from 'components/CommunityMenu';

import useStyles from './PastCommunityChatStyles';

import type { ChatCommunity, ChatCommunityData } from 'api/models/APICommunity';

type Props = {
  pastCommunities: ChatCommunityData[];
  handleSelect: (course: ChatCommunity) => void;
};

const PastCoummunityChat = ({ pastCommunities, handleSelect }: Props) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPastClasses = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Tooltip
        classes={{
          tooltip: classes.tooltip
        }}
        placement="top"
        arrow
        title="Past Class Chats"
      >
        <img
          onClick={handleOpenPastClasses}
          className={clsx(classes.pastClassImg, isOpen && classes.selected)}
          src={PastClassesImg}
          alt="Past Class Chats"
        />
      </Tooltip>
      {isOpen && (
        <div className={classes.pastClassesContainer}>
          <div className={classes.pastClassesInsert}>
            {pastCommunities.length > 0 ? (
              pastCommunities.map((course) => (
                <CommunityMenu
                  key={course.community.id}
                  item={course.community}
                  handleSelect={handleSelect}
                />
              ))
            ) : (
              <div className={classes.pastClassText}>
                <Typography>
                  {"When you have classes that have ended on CircleIn, they'll appear here"}
                </Typography>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PastCoummunityChat;
