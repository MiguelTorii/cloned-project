import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { logEvent } from '../../api/analytics';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 200
  },
  dialog: { ...dialogStyle, width: 700 }
});

type Props = {
  classes: Record<string, any>;
  open: boolean;
  onClose: (...args: Array<any>) => any;
};
type State = {
  class1: string;
  class2: string;
  class3: string;
  class4: string;
  class5: string;
  submited: boolean;
};

class RequestClass extends React.PureComponent<Props, State> {
  state = {
    class1: '',
    class2: '',
    class3: '',
    class4: '',
    class5: '',
    submited: false
  };

  handleSubmit = async () => {
    const { state } = this;
    const classes = ['class1', 'class2', 'class3', 'class4', 'class5'];
    const results = [];
    classes.forEach((item) => {
      if (state[item].trim() !== '') {
        results.push(state[item]);
      }
    });

    if (results.length > 0) {
      logEvent({
        event: 'User- Submitted Class Form',
        props: {
          Classes: results
        }
      });
      this.setState({
        submited: true
      });
    }
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    } as any);
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      submited: false
    });
    onClose();
  };

  renderForm = () => {
    const { classes } = this.props;
    const { class1, class2, class3, class4, class5 } = this.state;
    return (
      <Fragment>
        <Typography paragraph>
          We are adding more classes soon. Please enter the class you are attempting to access
          below. Add up to five classes.
        </Typography>
        <Typography variant="h6">Class Name</Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="standard-name"
            label="Class 1"
            className={classes.textField}
            value={class1}
            onChange={this.handleChange('class1')}
            margin="normal"
          />
          <TextField
            id="standard-name"
            label="Class 2"
            className={classes.textField}
            value={class2}
            onChange={this.handleChange('class2')}
            margin="normal"
          />
          <TextField
            id="standard-name"
            label="Class 3"
            className={classes.textField}
            value={class3}
            onChange={this.handleChange('class3')}
            margin="normal"
          />
          <TextField
            id="standard-name"
            label="Class 4"
            className={classes.textField}
            value={class4}
            onChange={this.handleChange('class4')}
            margin="normal"
          />
          <TextField
            id="standard-name"
            label="Class 5"
            className={classes.textField}
            value={class5}
            onChange={this.handleChange('class5')}
            margin="normal"
          />
        </form>
      </Fragment>
    );
  };

  renderThanks = () => (
    <Fragment>
      <Typography paragraph>We will contact you when your classes become available.</Typography>
    </Fragment>
  );

  render() {
    const { classes, open } = this.props;
    const { submited } = this.state;

    if (!open) {
      return null;
    }

    return (
      <ErrorBoundary>
        <Dialog
          className={classes.dialog}
          okTitle={submited ? 'Thanks!' : 'Submit'}
          onCancel={this.handleClose}
          onOk={submited ? this.handleClose : this.handleSubmit}
          open={open}
          showActions
          showCancel={!submited}
          title={submited ? 'Thank you for submitting!' : 'Missing a class?'}
        >
          {submited ? this.renderThanks() : this.renderForm()}
        </Dialog>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles as any)(RequestClass);
