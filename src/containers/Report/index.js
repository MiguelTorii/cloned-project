// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { report } from '../../api/posts';

const styles = theme => ({
  paper: {
    width: '80%'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

type Props = {
  classes: Object,
  user: UserState,
  ownerId: string,
  objectId: number,
  open: boolean,
  onClose: Function
};

type State = {
  reasonId: string,
  description: string,
  loading: boolean
};

class Report extends React.PureComponent<Props, State> {
  state = {
    reasonId: '1',
    description: '',
    loading: false
  };

  handleEntering = () => {
    if (this.radioGroupRef) this.radioGroupRef.focus();
  };

  handleChange = (event, value) => {
    this.setState({ reasonId: value });
  };

  handleTextChange = event => {
    this.setState({ description: event.target.value });
  };

  handleSubmit = async () => {
    const {
      user: {
        data: { userId }
      },
      ownerId,
      objectId,
      onClose
    } = this.props;
    const { reasonId, description } = this.state;

    this.setState({ loading: true });
    try {
      await report({
        reportCreatorId: userId,
        objectCreatorId: ownerId,
        reasonId,
        objectId,
        reportTypeId: 2,
        description
      });
    } finally {
      this.setState({ loading: false, reasonId: '1', description: '' });
      onClose();
    }
  };

  // eslint-disable-next-line no-undef
  radioGroupRef: ?Object;

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      },
      open,
      onClose
    } = this.props;
    const { reasonId, description, loading } = this.state;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <Dialog
        maxWidth="md"
        disableBackdropClick={loading}
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        classes={{
          paper: classes.paper
        }}
        open={open}
        onClose={onClose}
      >
        <DialogTitle id="confirmation-dialog-title">Report</DialogTitle>
        <DialogContent>
          <RadioGroup
            ref={ref => {
              this.radioGroupRef = ref;
            }}
            aria-label="Reason"
            name="reason"
            value={reasonId}
            onChange={this.handleChange}
          >
            <FormControlLabel
              value="1"
              disabled={loading}
              control={<Radio />}
              label="Inappropriate"
            />
            <FormControlLabel
              value="2"
              disabled={loading}
              control={<Radio />}
              label="Irrelevant"
            />
            <FormControlLabel
              value="3"
              disabled={loading}
              control={<Radio />}
              label="Bullying or Harassment- this post is bullying me"
            />
            <FormControlLabel
              value="4"
              disabled={loading}
              control={<Radio />}
              label="Bullying or Harassment- this post is bullying someone else"
            />
          </RadioGroup>
          <TextField
            id="report-description"
            label="Description"
            placeholder="Add more details"
            disabled={loading}
            fullWidth
            multiline
            rowsMax="4"
            value={description}
            onChange={this.handleTextChange}
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={onClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              disabled={loading}
              onClick={this.handleSubmit}
              type="submit"
              color="primary"
              variant="contained"
            >
              Report
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Report));
