import React from 'react';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
// import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { styles } from '../_styles/QuestsCard/QuestItem';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

type Props = {
  classes: Record<string, any>;
  userId: string;
  iconUrl: string;
  pointsAvailable: number;
  task: string;
  action: Record<string, any>;
  isCurrent: boolean;
  isHidden: boolean;
  status: string;
};
type State = {};

class QuestItem extends React.PureComponent<Props, State> {
  static defaultProps = {};

  state = {};

  renderQuestLink = (action) => {
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
    const { classes, iconUrl, pointsAvailable, task, action, isCurrent, isHidden, status } =
      this.props;
    return (
      <ButtonBase
        className={cx(classes.root, isCurrent && classes.current, isHidden && classes.hiden)}
        disabled={!isCurrent}
        component={MyLink}
        href={this.renderQuestLink(action)} // elevation={1}
      >
        <div className={classes.header}>
          <Typography variant={isCurrent ? 'subtitle2' : 'caption'} className={classes.headerTitle}>
            {`${pointsAvailable.toLocaleString()} points`}
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
        <div className={cx(classes.imageWrapper, !isCurrent && classes.imageWrapperSmall)}>
          <img
            src={iconUrl}
            alt="Quest"
            className={cx(classes.image, !isCurrent && classes.imageSmall)}
          />
        </div>
        {status === 'complete' && (
          <div className={classes.completed}>
            <CheckCircleIcon className={classes.completedIcon} fontSize="small" />
          </div>
        )}
      </ButtonBase>
    );
  }
}

export default withStyles(styles as any)(QuestItem);
