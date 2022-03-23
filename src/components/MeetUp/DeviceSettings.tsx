import React, { useCallback, useState } from 'react';

import { withSnackbar } from 'notistack';
import store from 'store';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
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
          htmlFor="audioinput-native-helper"
        >
          Video
        </InputLabel>
        <NativeSelect
          value={selectedvideoinput}
          onChange={handleChange('videoinput')}
          classes={{
            root: classes.controlOptions,
            icon: classes.dropdownArrow
          }}
          input={
            <Input
              classes={{
                root: classes.controlOptionLabel,
                focused: classes.optionFocused
              }}
              name="videoinput"
              id="videoinput-native-helper"
            />
          }
        >
          {videoinput.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </NativeSelect>
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
          htmlFor="audioinput-native-helper"
        >
          Mic
        </InputLabel>
        <NativeSelect
          value={selectedaudioinput}
          classes={{
            root: classes.controlOptions,
            icon: classes.dropdownArrow
          }}
          onChange={handleChange('audioinput')}
          input={
            <Input
              classes={{
                root: classes.controlOptionLabel,
                focused: classes.optionFocused
              }}
              name="audioinput"
              id="audioinput-native-helper"
            />
          }
        >
          {audioinput.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </NativeSelect>
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
