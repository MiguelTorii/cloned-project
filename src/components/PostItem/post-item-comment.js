// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 2
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.unit * 2
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  thanks: {
    marginLeft: theme.spacing.unit
  },
  icon: {
    marginLeft: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {};

class PostItemComment extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Avatar>CR</Avatar>
        <div className={classes.info}>
          <div className={classes.header}>
            <Typography component="p" variant="subtitle2" noWrap>
              James M.
            </Typography>
            <Typography component="p" variant="caption" noWrap>
              4 days ago
            </Typography>
          </div>
          <Typography component="p" variant="body1">
            Some comment some comment some comment some comment some comment
            some comment some comment some comment some comment some comment
            some comment some comment some comment some comment some comment
            some comment some comment some comment some comment some comment
            some comment some comment some comment some comment some comment
          </Typography>
          <div className={classes.actions}>
            <ThumbUpIcon />
            <Typography
              component="p"
              variant="subtitle2"
              className={classes.thanks}
            >
              12
            </Typography>
            <Button color="primary">Reply</Button>
            <Button color="primary">Report</Button>
          </div>
          <Button>
            See 10 Answers
            <ExpandMoreIcon className={classes.icon} />
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PostItemComment);
