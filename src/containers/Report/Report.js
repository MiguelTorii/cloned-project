// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { report } from '../../api/posts';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  paper: {
    width: '80%'
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  dialog: {
    ...dialogStyle,
    width: 600
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

  // eslint-disable-next-line no-undef
  radioGroupRef: ?Object;

  handleEntering = () => {
    if (this.radioGroupRef) { this.radioGroupRef.focus(); }
  };

  handleChange = (event, value) => {
    this.setState({ reasonId: value });
  };

  handleTextChange = (event) => {
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
    if (isLoading) { return <CircularProgress size={12} />; }
    if (userId === '' || error) { return 'Oops, there was an error loading your data, please try again.'; }

    return (
      <ErrorBoundary>
        <Dialog
          className={classes.dialog}
          disableActions={loading}
          okTitle="Report"
          onCancel={onClose}
          onOk={this.handleSubmit}
          open={open}
          showActions
          showCancel
          title="Report"
        >
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
          <RadioGroup
            ref={(ref) => {
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
        </Dialog>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(mapStateToProps, null)(withStyles(styles)(Report));
