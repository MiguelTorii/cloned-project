// @flow

import React from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import green from '@material-ui/core/colors/green';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
    // [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    //   width: 400,
    //   marginLeft: 'auto',
    //   marginRight: 'auto'
    // }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  quillLabel: {
    marginTop: theme.spacing.unit * 3
  },
  quill: {
    marginTop: theme.spacing.unit
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  title: String,
  userClass: String,
  description: String,
  loading: boolean,
  handleChange: Function,
  handleDescriptionChange: Function,
  handleSubmit: Function
};

type State = {};

class QuestionForm extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const {
      classes,
      title,
      userClass,
      description,
      loading,
      handleSubmit,
      handleChange,
      handleDescriptionChange
    } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Ask a Question
          </Typography>
          <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
            <TextValidator
              label="What's your question?"
              margin="normal"
              onChange={handleChange('title')}
              name="title"
              autoFocus
              value={title}
              disabled={loading}
              validators={['required']}
              errorMessages={['title is required']}
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-native-helper">
                Select a Class
              </InputLabel>
              <NativeSelect
                value={userClass}
                onChange={handleChange('userClass')}
                input={<Input name="age" id="age-native-helper" />}
              >
                <option value="" />
                <option value="algebra">Algebra</option>
                <option value="history">History</option>
              </NativeSelect>
            </FormControl>
            <InputLabel className={classes.quillLabel}>Description:</InputLabel>
            <ReactQuill
              className={classes.quill}
              value={description}
              onChange={handleDescriptionChange}
            />
            <div className={classes.wrapper}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submit}
              >
                Create
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </ValidatorForm>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(QuestionForm);
