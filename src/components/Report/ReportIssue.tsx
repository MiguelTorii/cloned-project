import React, { useCallback, useState, useEffect } from 'react';

import cx from 'classnames';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { report, getReasons } from 'api/posts';
import { ReactComponent as ReportFlag } from 'assets/svg/report-flag.svg';

import styles from '../_styles/Report';
import Dialog from '../Dialog/Dialog';
import SimpleErrorDialog from '../SimpleErrorDialog/SimpleErrorDialog';

import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

type Props = {
  user?: UserState;
  open?: boolean;
  onClose?: (...args: Array<any>) => any;
  ownerId?: any;
  ownerName?: any;
  profiles?: any;
  classes?: any;
  objectId?: any;
};

const ReportIssue = ({
  user: {
    data: { userId }
  },
  ownerId,
  ownerName,
  profiles,
  classes,
  onClose,
  open,
  objectId
}: Props) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [reasonList, setReasonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorBody, setErrorBody] = useState('');
  useEffect(() => {
    const loadData = async () => {
      const { report_reasons = [] } = await getReasons(2);
      setReasonList(report_reasons);
    };

    if (open) {
      loadData();
    }
  }, [open]);
  const handleSubmit = useCallback(async () => {
    if (selectedReason.length === 0) {
      setOpenError(true);
      setErrorTitle('Choose a report reason');
      setErrorBody(
        'Please select an issue from the drop-down menu so we can understand what???s going on.'
      );
      return;
    }

    try {
      setLoading(true);
      await report({
        reportCreatorId: userId,
        objectCreatorIds: [Number(ownerId)],
        reasonId: selectedReason,
        reportTypeId: 2,
        description: ''
      });
      setReported(true);
    } catch (err) {
      setOpenError(true);
      setErrorTitle('Something went wrong');
      setErrorBody('Please try again!');
    } finally {
      setLoading(false);
    }
  }, [setReported, selectedReason, userId, ownerId]);
  const handleSelectReason = useCallback(
    (e) => {
      setSelectedReason(e.target.value);
    },
    [setSelectedReason]
  );
  const handleClose = useCallback(() => {
    onClose();
    setSelectedReason('');
  }, [onClose]);
  const handleDoneClick = useCallback(() => {
    setSelectedReason('');
    setReported(false);
    handleClose();
  }, [setReported, handleClose]);
  const handleErrorDialogClose = useCallback(() => {
    setOpenError(false);
  }, []);
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
      {loading && (
        <CircularProgress
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%'
          }}
        />
      )}
      {!reported && (
        <>
          <FormControl fullWidth variant="outlined" className={classes.selectForm}>
            <InputLabel className={classes.InputLabel} id="reporter-select-label">
              Who are you reporting?
            </InputLabel>
            <Select
              labelId="reporter-select-label"
              className={cx(classes.select, classes.nameSelect)}
              value={[ownerId]}
              fullWidth
              disabled
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left'
                },
                getContentAnchorEl: null
              }}
              renderValue={(selected) => (
                <div className={classes.chipWrapper}>
                  {(selected as any).map((value) => (
                    <Chip className={classes.chip} key={value} label={ownerName} />
                  ))}
                </div>
              )}
            />
            <FormHelperText className={classes.helperText}>
              User may be temporarily or permanently removed from CircleIn
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth variant="outlined" className={classes.selectForm}>
            <InputLabel className={classes.InputLabel} id="reason-select-label">
              What happened?
            </InputLabel>
            <Select
              labelId="reason-select-label"
              className={classes.select}
              value={selectedReason}
              fullWidth
              onChange={handleSelectReason}
            >
              <MenuItem value="" className={classes.emptyOption} disabled />
              {reasonList.map((item) => (
                <MenuItem
                  className={classes.menuItem}
                  value={item.id}
                  key={`reason-item-${item.id}`}
                >
                  {selectedReason === item.id ? (
                    <CheckCircleIcon className={classes.mr1} />
                  ) : (
                    <RadioButtonUncheckedIcon className={classes.mr1} />
                  )}
                  {item.reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" className={classes.noteText}>
            {
              'The safety and well-being of all of our CircleIn users is important to us. By pressing "Submit" on this report, you authorize CircleIn to access the data to investigate the situation. You may be contacted for further information.'
            }
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
          <Typography variant="body1" className={classes.finalNote}>
            {
              "Thank you for submitting your report. We take reports very seriously. We want you to have a safe experience and we're sorry you're experiencing some issues. We may contact you soon if we have furthur questions about this incident. For additional support please email us at "
            }
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

      <SimpleErrorDialog
        open={openError}
        title={errorTitle}
        body={errorBody}
        handleClose={handleErrorDialogClose}
      />
    </Dialog>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(
  mapStateToProps,
  null
)(withStyles(styles as any)(withSnackbar(ReportIssue as any)));
