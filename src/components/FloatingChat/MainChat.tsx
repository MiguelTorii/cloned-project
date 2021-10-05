import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import RemoveIcon from '@material-ui/icons/Remove';
import FloatChatNewIcon from '../../assets/svg/float_chat_new.svg';
import styles from '../_styles/FloatingChat/MainChat';

type Props = {
  classes: Record<string, any>;
  children: React.ReactNode;
  unread: number;
  onCreateChannel: (...args: Array<any>) => any;
};
type State = {
  open: boolean;
};

class MainChat extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

  handleOpen = () =>
    this.setState((prevState) => ({
      open: !prevState.open
    }));

  handleCreateChannel = (type) => () => {
    const { onCreateChannel } = this.props;
    onCreateChannel(type);
  };

  render() {
    const { classes, children, unread } = this.props;
    const { open } = this.state;
    return (
      <Paper className={cx(classes.paper, open && classes.paperOpen)} elevation={24}>
        <div className={cx(classes.header, unread && classes.notificationHeader)}>
          <ButtonBase className={classes.headerTitle} onClick={this.handleOpen}>
            <Typography variant="h6" className={classes.title}>
              Direct Messages
            </Typography>
            <Badge className={classes.margin} badgeContent={unread} color="secondary">
              <span />
            </Badge>
          </ButtonBase>
          <ButtonBase className={classes.iconButton} onClick={this.handleCreateChannel('single')}>
            <img
              id="circlein-newchat"
              src={FloatChatNewIcon}
              alt="newChat"
              className={classes.img}
            />
          </ButtonBase>
          {open && (
            <ButtonBase className={classes.iconButton} onClick={this.handleOpen}>
              <RemoveIcon className={classes.icon} />
            </ButtonBase>
          )}
        </div>
        <div className={cx(!open && classes.hide, classes.content)}>
          <Divider />
          <div className={classes.items}>{children}</div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles as any)(MainChat);
