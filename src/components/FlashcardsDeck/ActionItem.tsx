import React, { useState } from 'react';

import clsx from 'clsx';

import Box from '@material-ui/core/Box';

import useStyles from './styles';

type Props = {
  icon?: any;
  activeIcon?: any;
  active?: any;
  text?: any;
  onClick?: () => void;
};

const ActionItem = ({ icon, activeIcon, active, text, onClick = () => {} }: Props) => {
  const classes: any = useStyles();
  const [isHover, setIsHover] = useState(false);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      onClick={onClick}
      className={clsx(classes.actionItem)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div>
        {isHover || active ? (
          <img src={activeIcon} alt="Action Icon Gradient" />
        ) : (
          <img src={icon} alt="Action Icon Default" />
        )}
      </div>
      <Box fontSize={12}>{text}</Box>
    </Box>
  );
};

export default ActionItem;
