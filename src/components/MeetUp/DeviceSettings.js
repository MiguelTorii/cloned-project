import React, { useCallback, useState } from 'react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { ReactComponent as ReportFlag } from 'assets/svg/report-flag.svg';
import Dialog from 'components/Dialog/Dialog';
import StudyRoomReport from 'components/StudyRoomReport/ReportIssue';

import { styles } from '../_styles/MeetUp/DeviceSettings';

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
}) => {
  const [openReport, setOpenReport] = useState(false);

  const handleClick = useCallback(() => setOpenReport(true), []);
  const handleClose = useCallback(() => setOpenReport(false), []);

  return (
    <Dialog
      className={classes.dialog}
      onCancel={closeSettings}
      open={openSettings}
      showActions={false}
      contentClassName={classes.contentClassName}
      title="Audio/Visual Settings ⚙️"
    >
      <FormControl classes={{ root: classes.options }}>
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
      <FormControl classes={{ root: classes.options }}>
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
          onClick={closeSettings}
        >
          Save
        </Button>
      </Box>
      <StudyRoomReport
        profiles={profiles}
        open={openReport}
        handleClose={handleClose}
      />
    </Dialog>
  );
};

export default withStyles(styles)(withSnackbar(DeviceSettings));
