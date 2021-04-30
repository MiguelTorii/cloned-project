// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing(0, 1, 1, 1)
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.circleIn.palette.feedBackground,
    flex: 1,
    borderRadius: '0 0 10px 10px'
  },
  content: {
    marginLeft: theme.spacing(4)
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  grow: {
    flex: 1
  }
});

type Props = {
  classes: Object,
  about: Array<Object>,
  isMyProfile: boolean,
  onOpenEdit: Function
};

class About extends React.PureComponent<Props> {
  render() {
    const { classes, about, isMyProfile, onOpenEdit } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.content}>
            <div className={classes.header}>
              <Typography variant="h4" gutterBottom className={classes.grow}>
                About Me
              </Typography>
              {isMyProfile && (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={onOpenEdit}
                >
                  Edit About Me
                </Button>
              )}
            </div>
            {about.length === 0 && isMyProfile ? (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={onOpenEdit}
              >
                Help your classmates learn more about you
              </Button>
            ) : (
              about.map(item => (
                <div key={item.id}>
                  <Typography variant="h6" gutterBottom>
                    {item.section}
                  </Typography>
                  <Typography variant="subtitle1" paragraph>
                    {item.answer}
                  </Typography>
                </div>
              ))
            )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(About);
