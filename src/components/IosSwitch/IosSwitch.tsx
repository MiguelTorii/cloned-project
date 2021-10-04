import React from "react";
import Switch from "@material-ui/core/Switch";
import useStyles from "./styles";

const IosSwitch = props => {
  const classes = useStyles();
  return <Switch focusVisibleClassName={classes.focusVisible} disableRipple classes={{
    root: classes.root,
    switchBase: classes.switchBase,
    thumb: classes.thumb,
    track: classes.track,
    checked: classes.checked
  }} {...props} />;
};

export default IosSwitch;