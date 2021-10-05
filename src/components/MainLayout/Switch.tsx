import React, { memo } from 'react';
import Switch from '@material-ui/core/Switch';
import { useStyles } from '../_styles/MainLayout/Switch';

const CustomSwitch = ({ ...props }) => {
  const classes: any = useStyles();
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  );
};

export default memo(CustomSwitch);
