import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import useStyles from "./styles";
import HotKey from "./HotKey";

const HotKeyBox = ({
  data
}) => {
  const classes = useStyles();
  return <Box className={classes.root}>
      <Typography className={classes.title}>Keyboard Shortcuts</Typography>
      {data.map(hotKeyItem => <Box marginTop={1} display="flex" key={hotKeyItem.description} justifyContent="space-between" alignItems="center">
          <Typography>{hotKeyItem.description}</Typography>
          <Box>
            <HotKey keys={hotKeyItem.keys} />
          </Box>
        </Box>)}
    </Box>;
};

HotKeyBox.propTypes = {
  data: PropTypes.arrayOf.isRequired
};
export default HotKeyBox;