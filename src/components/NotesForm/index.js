// @flow

import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import EditPhotoThumbnail from '../EditPhotoThumbnail';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
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
  thumbnails: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  loading: boolean,
  handleSubmit: Function
};

type State = {};

class NotesForm extends React.PureComponent<ProvidedProps & Props, State> {
  handleImageDelete = (id: string) => {
    console.log(id);
  };

  render() {
    const { classes, loading, handleSubmit } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Share Notes
          </Typography>
          <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.thumbnails}>
              {['a', 'b', 'c', 'd', 'e'].map(item => (
                <EditPhotoThumbnail
                  key={item}
                  id={item}
                  onDelete={this.handleImageDelete}
                />
              ))}
            </div>
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

export default withStyles(styles)(NotesForm);
