// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    flex: 1
  },
  content: {
    marginLeft: theme.spacing.unit * 4
  }
});

type Props = {
  classes: Object,
  about: Array<Object>,
  onOpenEdit: Function
};

class About extends React.PureComponent<Props> {
  render() {
    const { classes, about, onOpenEdit } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.content}>
            <Typography variant="h4" gutterBottom>
              About Me
            </Typography>
            {about.length === 0 ? (
              <Button variant="outlined" color="primary" onClick={onOpenEdit}>
                Help your classmates learn more about you
              </Button>
            ) : (
              about.map(item => (
                <div key={item.id}>
                  <Typography variant="subtitle2" gutterBottom>
                    {item.section}
                  </Typography>
                  <Typography variant="body2" paragraph>
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
