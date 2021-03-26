/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow
import React from 'react';
import type { Node } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';

const MyLink = React.forwardRef(({ href, ...props }, ref) =>
  // eslint-disable-next-line react/destructuring-assignment
  <RouterLink to={`/feed?id=${props.feedid}`} {...props} ref={ref} />);

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing()
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  link: {
    cursor: 'pointer'
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    backgroundColor: theme.circleIn.palette.feedBackground,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2)
    },
    marginBottom: theme.spacing(8),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  }
});

type Props = {
  classes: Object,
  children: Node,
  feedId: number
};

class PostItem extends React.PureComponent<Props> {
  render() {
    const { classes, children, feedId } = this.props;

    return (
      <div className={classes.container}>
        <Hidden smUp implementation="css">
          <div className={classes.actions}>
            <Typography className={classes.link}>
              <Link component={MyLink} feedid={feedId}>
                Back to Study
              </Link>
            </Typography>
          </div>
        </Hidden>
        <Paper className={classes.root} elevation={0}>
          {children}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PostItem);
