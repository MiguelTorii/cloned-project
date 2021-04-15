import React from 'react'
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// import { ReactComponent as ReportFlag } from 'assets/svg/report-flag.svg';
import Dialog from 'components/Dialog';

const styles = theme => ({
  dialog: {
    width: 600,
    '& > :first-child': {
      height: 20,
      zIndex: 999999
    }
  },
  contentClassName: {
    '& > #circle-in-dialog-title': {
      borderBottom: `1px solid ${theme.circleIn.palette.white}`,
      paddingBottom: theme.spacing(3)
    }
  },
  options: {
    width: '100%',
    padding: theme.spacing(2, 0)
  },
  optionLabel: {
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.circleIn.palette.secondaryText
  },
  dropdownArrow: {
    color: theme.circleIn.palette.brand,
    fontSize: 28
  },
  controlOptions: {
    backgroundColor: theme.circleIn.palette.secondaryText,
    border: `1px solid ${theme.circleIn.palette.appBar}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    color: theme.circleIn.palette.appBar,
    paddingLeft: theme.spacing(3)
  },
  optionFocused: {
    backgroundColor: theme.circleIn.palette.secondaryText,
    border: `1px solid ${theme.circleIn.palette.appBar}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    color: theme.circleIn.palette.appBar,
  },
  controlOptionLabel: {
    '&::before': {
      border: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      border: 'none',
    }
  },
  report: {
    color: theme.circleIn.palette.danger,
    display: 'flex',
    alignItems: 'center'
  },
  letsGo: {
    margin: theme.spacing(4, 0),
    minWidth: 340,
    borderRadius: 20,
    color: theme.circleIn.palette.white,
    fontWeight: 700,
    fontSize: 20,
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)'
  },
})

const DeviceSettings = ({
  classes,
  closeSettings,
  openSettings,
  handleChange,
  selectedvideoinput,
  selectedaudioinput,
  audioinput,
  videoinput
}) => {
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
                focused: classes.optionFocused,
              }}
              name="videoinput"
              id="videoinput-native-helper"
            />
          }
        >
          {videoinput.map(item => (
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
                focused: classes.optionFocused,
              }}
              name="audioinput"
              id="audioinput-native-helper"
            />
          }
        >
          {audioinput.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      {/* <Box className={classes.options}>
        <Typography className={classes.report}>
          <ReportFlag /> &nbsp; Report an Issue
        </Typography>
      </Box> */}
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
    </Dialog>
  )
}

export default withStyles(styles)(withSnackbar(DeviceSettings))