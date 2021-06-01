import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import type { UserState } from '../../reducers/user';
import { ReactComponent as ReportFlag } from 'assets/svg/report-flag.svg';
import Dialog from 'components/Dialog';
import { report, getReasons } from '../../api/posts';
import LoadImg from 'components/LoadImg';
import ReportImage from 'assets/svg/report-done.svg';
import styles from '../_styles/StudyRoomReport';

type Props = {
  user: UserState,
  open: boolean,
  handleClose: Function
};

const ReportIssue = ({
  user: {
    data: { userId }
  },
  router,
  profiles,
  classes,
  handleClose,
  open,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [reported, setReported] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [selectedNames, setSelectedNames] = useState([])

  const names = useMemo(() => {
    const filteredIds = Object.keys(profiles || []).filter(id => id !== userId)
    return filteredIds.map(id => `${profiles[id].firstName} ${profiles[id].lastName}`)
  }, [profiles, userId])

  const nameList = useMemo(() => names.map(name => ({
    value: name,
    text: name,
  })), [names])

  const getValue = (value) => {
    return nameList.filter(item => item.value === value)[0].text
  }

  const [reasonList, setReasonList] = useState([]) // Load data from BE

  useEffect(() => {
    const loadData = async () => {
      const { report_reasons = [] } = await getReasons(2);
      setReasonList(report_reasons);
    }
    loadData();
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await report({
        reportCreatorId: userId,
        objectCreatorId: userId,
        reasonId: selectedReason,
        reportTypeId: 2,
        description: '',
      });
    } finally {
      setLoading(false)
    }
    setReported(true);
  }, [setReported, selectedReason, userId])

  const handleSelectReason = useCallback((e) => {
    setSelectedReason(e.target.value)
  }, [setSelectedReason])

  const handleSelectNames = useCallback((e) => {
    setSelectedNames(e.target.value)
  }, [setSelectedNames])

  const handleRemoveName = (value) => {
    const filteredList = selectedNames.filter(item => item !== value)
    setSelectedNames(filteredList)
  }

  const handleDoneClick = useCallback(() => {
    setSelectedNames([])
    setSelectedReason('')
    setReported(false)
  }, [setReported])

  return (
    <Dialog
      className={classes.dialog}
      onCancel={handleClose}
      open={open}
      showActions={false}
      contentClassName={classes.contentClassName}
      title={
        <div className={classes.title}>
          <ReportFlag className={classes.flag} /> &nbsp; Report an Issue
        </div>
      }
    >
      {loading && <CircularProgress
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%'
        }}
      />}
      {!reported && (
        <>
          <FormControl fullWidth variant="outlined" className={classes.selectForm}>
            <InputLabel
              className={classes.InputLabel}
              id="reporter-select-label"
            >
              Who are you reporting?
            </InputLabel>
            <Select
              labelId="reporter-select-label"
              className={classes.select}
              value={selectedNames}
              fullWidth
              multiple
              onChange={handleSelectNames}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left"
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left"
                },
                getContentAnchorEl: null
              }}
              renderValue={(selected) => (
                <div className={classes.chipWrapper}>
                  {selected.map((value) => (
                    <Chip
                      className={classes.chip}
                      key={value}
                      label={getValue(value)}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                      }}
                      onDelete={() => handleRemoveName(value)}
                    />
                  ))}
                </div>
              )}
            >
              <MenuItem value='' className={classes.emptyOption} />
              {nameList.map(item => (
                <MenuItem
                  className={classes.menuItem}
                  value={item.value}
                  key={`name-item-${item.value}`}
                >
                  {selectedNames.indexOf(item.value) > -1
                    ? <CheckCircleIcon className={classes.mr1} />
                    : <RadioButtonUncheckedIcon className={classes.mr1} />
                  }
                  {item.text}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className={classes.helperText}>
              User may be temporarily or permenantly removed from CircleIn.
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth variant="outlined" className={classes.selectForm}>
            <InputLabel
              className={classes.InputLabel}
              id="reason-select-label"
            >
              What happened?
            </InputLabel>
            <Select
              labelId="reason-select-label"
              className={classes.select}
              value={selectedReason}
              fullWidth
              onChange={handleSelectReason}
            >
              <MenuItem value='' className={classes.emptyOption} disabled />
              {reasonList.map((item) => (
                <MenuItem
                  className={classes.menuItem}
                  value={item.id}
                  key={`reason-item-${item.id}`}
                >
                  {selectedReason === item.id
                    ? <CheckCircleIcon className={classes.mr1} />
                    : <RadioButtonUncheckedIcon className={classes.mr1} />
                  }
                  {item.reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" className={classes.noteText}>
            The safety and well-being of all of our CircleIn users is
            important to us. By pressing "Submit" on this report, you
            authorize CircleIn to access the data to investigate
            the situation. You may be contacted for further information.
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              className={classes.cancel}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </>
      )}

      {reported && (
        <>
          <Box display="flex" justifyContent="center" alignItems="center">
            <LoadImg url={ReportImage} />
          </Box>
          <Typography variant="body1" className={classes.finalNote}>
            Thank you for submitting your report. We take reports very seriously.
            We want you to have a sefe experience and we're sorry you're experiencing
            some issues. We many contact you soon if we have furthur questions about
            this incident. For additional support please email us at &nbsp;
            <a className={classes.email} href="mailto:support@circleinapp.com">
              support@circleinapp.com
            </a>
          </Typography>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              className={classes.cancel}
              onClick={handleDoneClick}
            >
              Done
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  )
}

const mapStateToProps = ({ user, router }: StoreState): {} => ({
  user,
  router,
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(withSnackbar(ReportIssue)));
