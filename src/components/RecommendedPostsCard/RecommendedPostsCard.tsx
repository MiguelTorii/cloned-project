import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReplyIcon from "@material-ui/icons/Reply";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { styles } from "../_styles/RecommendedPostsCard";
type Props = {
  classes: Record<string, any>;
  isLoading: boolean;
};
type State = {};

class RecommendedPostsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const {
      classes,
      isLoading
    } = this.props;
    const posts = [{
      label: 'Most Viewed',
      href: '',
      icon: <VisibilityIcon className={classes.icon} />
    }, {
      label: 'Most Shared',
      href: '',
      icon: <ReplyIcon className={classes.icon} />
    }, {
      label: 'Most Thanks',
      href: '',
      icon: <FavoriteBorderIcon className={classes.icon} />
    }, {
      label: 'Most Saved',
      href: '',
      icon: <BookmarkBorderIcon className={classes.icon} />
    }];

    if (isLoading) {
      return <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>;
    }

    return <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Recommended Posts
        </Typography>
        <div className={classes.cards}>
          {posts.map(item => <div key={item.label} className={classes.card}>
              <ButtonBase>
                <Paper className={classes.button} elevation={12}>
                  {item.icon}
                </Paper>
              </ButtonBase>
              <Typography variant="h5" align="center">
                {item.label}
              </Typography>
            </div>)}
        </div>
      </Paper>;
  }

}

export default withStyles(styles)(RecommendedPostsCard);