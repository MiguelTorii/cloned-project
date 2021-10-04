import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Link from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getInitials } from "utils/chat";
import type { StudyCircle } from "../../types/models";
import { styles } from "../_styles/MyStudyCircle";
import { buildPath } from "../../utils/helpers";
import { PROFILE_PAGE_SOURCE } from "../../constants/common";

const MyLink = ({
  href,
  ...props
}) => <RouterLink to={href} {...props} />;

type Props = {
  classes: Record<string, any>;
  circle: StudyCircle;
  isLoading: boolean;
  onRemove: (...args: Array<any>) => any;
  onStartChat: (...args: Array<any>) => any;
};

class MyStudyCircle extends React.PureComponent<Props> {
  handleRemove = userId => () => {
    const {
      onRemove
    } = this.props;
    onRemove(userId);
  };
  handleStartChat = ({
    userId,
    firstName,
    lastName
  }) => () => {
    const {
      onStartChat
    } = this.props;
    onStartChat({
      userId,
      firstName,
      lastName
    });
  };
  renderContent = () => {
    const {
      classes,
      isLoading,
      circle
    } = this.props;

    if (isLoading) {
      return <CircularProgress />;
    }

    if (circle.length === 0) {
      return <div className={classes.empty}>
          <Typography variant="h6" paragraph align="center">
            You haven’t added anyone to your study circle yet! Check back here once you’ve added
            students.
          </Typography>
          <Button component={MyLink} href="/" variant="outlined" color="primary">
            Go to Study
          </Button>
        </div>;
    }

    return <List dense className={classes.list}>
        {circle.map(item => <ListItem key={item.userId}>
            <ListItemAvatar className={classes.avatarLink} component={MyLink} href={buildPath(`/profile/${item.userId}`, {
          from: PROFILE_PAGE_SOURCE.STUDY_CIRCLE
        })}>
              <Avatar alt={item.firstName} src={item.profileImageUrl}>
                {getInitials(`${item.firstName} ${item.lastName}`)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText disableTypography primary={<Typography>
                  <Link component={MyLink} href={buildPath(`/profile/${item.userId}`, {
            from: PROFILE_PAGE_SOURCE.STUDY_CIRCLE
          })}>
                    {`${item.firstName} ${item.lastName}`}
                  </Link>
                </Typography>} />
            <ListItemSecondaryAction>
              <Button variant="outlined" color="primary" size="small" className={classes.margin} onClick={this.handleStartChat({
            userId: item.userId,
            firstName: item.firstName,
            lastName: item.lastName
          })}>
                Message
              </Button>
              <Button variant="outlined" color="secondary" size="small" className={classes.margin} onClick={this.handleRemove(item.userId)}>
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>)}
      </List>;
  };

  render() {
    const {
      classes
    } = this.props;
    return <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Typography variant="h5" paragraph>
            Study Circle
          </Typography>
          <div className={classes.circle}>{this.renderContent()}</div>
        </Paper>
      </div>;
  }

}

export default withStyles(styles)(MyStudyCircle);