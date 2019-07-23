// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  root: {
    // ...theme.mixins.gutters(),
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    height: 113,
    width: 113,
    minWidth: 113,
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: 8,
    position: 'relative',
    opacity: 0.35,
    transition: 'width 0.5s, height 0.5s, opacity 0.5s'
  },
  current: {
    zIndex: 1000,
    opacity: 1,
    height: 156,
    width: 156,
    minWidth: 156,
    marginLeft: -30,
    marginRight: -30
  },
  hiden: {
    position: 'absolute',
    opacity: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerTitle: {
    flex: 1
  },
  removeButton: {
    padding: theme.spacing.unit / 2
  },
  body: {
    marginTop: theme.spacing.unit,
    fontSize: 9,
    transition: 'font-size 0.5s'
  },
  bodyCurrent: {
    fontSize: 11.5
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit
    // transition: 'padding 0.5s'
  },
  imageWrapperSmall: {
    // padding: theme.spacing.unit / 2
  },
  image: {
    height: 40,
    width: 40,
    transition: 'width 0.5s, height 0.5s'
  },
  imageSmall: {
    height: 20,
    width: 20
  }
});

type Props = {
  classes: Object,
  iconUrl: string,
  pointsAvailable: number,
  task: string,
  isCurrent: boolean,
  isHidden: boolean
};

type State = {};

class QuestItem extends React.PureComponent<Props, State> {
  static defaultProps = {};

  state = {};

  render() {
    const {
      classes,
      iconUrl,
      pointsAvailable,
      task,
      isCurrent,
      isHidden
    } = this.props;

    return (
      <Paper
        className={cx(
          classes.root,
          isCurrent && classes.current,
          isHidden && classes.hiden
        )}
        elevation={1}
      >
        <div className={classes.header}>
          <Typography
            variant={isCurrent ? 'subtitle2' : 'caption'}
            className={classes.headerTitle}
          >
            {`${pointsAvailable} points`}
          </Typography>
          <IconButton aria-label="Remove" className={classes.removeButton}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </div>
        <Typography
          variant="caption"
          className={cx(classes.body, isCurrent && classes.bodyCurrent)}
        >
          {task}
        </Typography>
        <div
          className={cx(
            classes.imageWrapper,
            !isCurrent && classes.imageWrapperSmall
          )}
        >
          <img
            src={iconUrl}
            alt="Quest"
            className={cx(classes.image, !isCurrent && classes.imageSmall)}
          />
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(QuestItem);
