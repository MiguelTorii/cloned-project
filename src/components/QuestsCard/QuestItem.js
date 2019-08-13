// @flow
import React from 'react';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
// import IconButton from '@material-ui/core/IconButton';
// import ClearIcon from '@material-ui/icons/Clear';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

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
    transition: 'width 0.5s, height 0.5s, opacity 0.5s',
    display: 'flex',
    flexDirection: 'column'
  },
  current: {
    zIndex: 100,
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
  userId: string,
  iconUrl: string,
  pointsAvailable: number,
  task: string,
  action: Object,
  isCurrent: boolean,
  isHidden: boolean
};

type State = {};

class QuestItem extends React.PureComponent<Props, State> {
  static defaultProps = {};

  state = {};

  renderQuestLink = action => {
    const {
      name,
      value,
      attributes: {
        feedFilter: { classId }
      }
    } = action;
    const { userId } = this.props;
    if (name === 'GotoScreen') {
      switch (value) {
        case 'EditProfile':
          return `/profile/${userId}?edit=true`;
        case 'RewardsStore':
          return '/store';
        case 'Feed':
          return `/feed?classId=${classId}&sectionId=${0}`;
        default:
          return '/';
      }
    }

    return '/';
  };

  render() {
    const {
      classes,
      iconUrl,
      pointsAvailable,
      task,
      action,
      isCurrent,
      isHidden
    } = this.props;

    return (
      <ButtonBase
        className={cx(
          classes.root,
          isCurrent && classes.current,
          isHidden && classes.hiden
        )}
        disabled={!isCurrent}
        component={MyLink}
        href={this.renderQuestLink(action)}
        // elevation={1}
      >
        <div className={classes.header}>
          <Typography
            variant={isCurrent ? 'subtitle2' : 'caption'}
            className={classes.headerTitle}
          >
            {`${pointsAvailable} points`}
          </Typography>
          {/* <IconButton aria-label="Remove" className={classes.removeButton}>
            <ClearIcon fontSize="small" />
          </IconButton> */}
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
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(QuestItem);
