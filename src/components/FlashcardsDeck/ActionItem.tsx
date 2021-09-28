import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import React, { useState } from 'react';
import useStyles from './styles';

const ActionItem = ({ icon, activeIcon, active, text, onClick = () => {} }) => {
  const classes = useStyles();
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
