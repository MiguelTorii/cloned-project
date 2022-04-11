import React, { useCallback, useState } from 'react';

import { withSnackbar } from 'notistack';
import store from 'store';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { STORAGE_KEYS } from 'constants/app';

import { ReactComponent as ReportFlag } from 'assets/svg/report-flag.svg';

import { styles } from '../_styles/MeetUp/DeviceSettings';
import Dialog from '../Dialog/Dialog';
import ReportIssue from '../StudyRoomReport/ReportIssue';

type Props = {
  classes?: any;
  closeSettings?: any;
  openSettings?: any;
  handleChange?: any;
  selectedvideoinput?: any;
  selectedaudioinput?: any;
  audioinput?: any;
  videoinput?: any;
  profiles?: any;
};

const DeviceSettings = ({
  classes,
  closeSettings,
  openSettings,
  handleChange,
  selectedvideoinput,
  selectedaudioinput,
  audioinput,
  videoinput,
  profiles
}: Props) => {
  const [openReport, setOpenReport] = useState(false);
  const handleClick = useCallback(() => setOpenReport(true), []);
  const handleClose = useCallback(() => setOpenReport(false), []);

  const handleCloseSettings = () => {
    store.set(STORAGE_KEYS.SAVED_VIDEO_INPUT, selectedvideoinput);
    store.set(STORAGE_KEYS.SAVED_AUDIO_INPUT, selectedaudioinput);

    closeSettings();
  };

  return (
    <Dialog
      className={classes.dialog}
      onCancel={closeSettings}
      open={openSettings}
      showActions={false}
      contentClassName={classes.contentClassName}
      title="Audio/Visual Settings ⚙️"
    >
      <FormControl
        classes={{
          root: classes.options
        }}
      >
        <InputLabel
          classes={{
            root: classes.optionLabel
          }}
        >
          Video
        </InputLabel>
        <Select
          classes={{ selectMenu: classes.selectInput }}
          className={classes.controlOptions}
          value={selectedvideoinput}
          onChange={handleChange('videoinput')}
        >
          {videoinput.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        classes={{
          root: classes.options
        }}
      >
        <InputLabel
          classes={{
            root: classes.optionLabel
          }}
        >
          Mic
        </InputLabel>
        <Select
          classes={{ selectMenu: classes.selectInput }}
          className={classes.controlOptions}
          value={selectedaudioinput}
          onChange={handleChange('audioinput')}
        >
          {audioinput.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box className={classes.options} onClick={handleClick}>
        <Typography className={classes.report}>
          <ReportFlag /> &nbsp; Report an Issue
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          className={classes.letsGo}
          onClick={handleCloseSettings}
        >
          Save
        </Button>
      </Box>
      <ReportIssue profiles={profiles} open={openReport} handleClose={handleClose} />
    </Dialog>
  );
};

export default withStyles(styles as any)(withSnackbar(DeviceSettings as any) as any);
