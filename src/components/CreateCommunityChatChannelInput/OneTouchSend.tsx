import React, { useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import MuiTabs from "components/Tabs/TabPanel";
import * as chatActions from "actions/chat";
import styles from "components/_styles/CreateCommunityChatChannelInput/oneTouchSend";
import SendStudent from "./SendStudent";
import SendClass from "./SendClass";
type Props = {
  classes: Record<string, any>;
  onClosePopover: (...args: Array<any>) => any;
  onOpenChannel: (...args: Array<any>) => any;
  setIsOpen: (...args: Array<any>) => any;
  createMessage: Record<string, any>;
  handleClearCreateMessage: (...args: Array<any>) => any;
  permission: Array;
  handleUpdateGroupName: (...args: Array<any>) => any;
};

const CreateChatChannelInput = ({
  classes,
  onClosePopover,
  onOpenChannel,
  setIsOpen,
  permission,
  createMessage,
  handleClearCreateMessage,
  handleUpdateGroupName
}: Props) => {
  const sendStudent = useCallback(() => <SendStudent onOpenChannel={onOpenChannel} setIsOpen={setIsOpen} permission={permission} createMessage={createMessage} handleClearCreateMessage={handleClearCreateMessage} handleUpdateGroupName={handleUpdateGroupName} onClosePopover={onClosePopover} />, [onOpenChannel, setIsOpen]);
  const oneTouchSend = useCallback(() => <SendClass onClosePopover={onClosePopover} />, []);
  return <>
      <div className={classes.header}>
        <Typography className={classes.typography} variant="h6">
          Select Students or Classes
        </Typography>
        <CloseIcon className={classes.closeIcon} onClick={onClosePopover} />
      </div>

      <MuiTabs firstTab={() => sendStudent()} secondTab={() => oneTouchSend()} />
    </>;
};

const mapStateToProps = ({
  user,
  chat
}: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: any): {} => bindActionCreators({
  closeNewChannel: chatActions.closeNewChannel
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateChatChannelInput));