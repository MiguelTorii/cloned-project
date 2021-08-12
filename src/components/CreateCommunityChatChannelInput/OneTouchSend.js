// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiTabs from 'components/Tabs';
import * as chatActions from 'actions/chat';
import SendStudent from './SendStudent';
import SendClass from './SendClass';

const styles = (theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2, 2, 1, 2),
    borderBottom: '1px solid rgba(233, 236, 239, 0.25)'
  },
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(2)
  },
  typography: {
    fontSize: 20,
    color: 'white'
  }
});

type Props = {
  classes: Object,
  onClosePopover: Function,
  onOpenChannel: Function,
  setIsOpen: Function,
  createMessage: Object,
  handleClearCreateMessage: Function,
  permission: Array,
  handleUpdateGroupName: Function
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
  const sendStudent = useCallback(
    () => (
      <SendStudent
        onOpenChannel={onOpenChannel}
        setIsOpen={setIsOpen}
        permission={permission}
        createMessage={createMessage}
        handleClearCreateMessage={handleClearCreateMessage}
        handleUpdateGroupName={handleUpdateGroupName}
      />
    ),
    [onOpenChannel, setIsOpen]
  );
  const oneTouchSend = useCallback(() => <SendClass />, []);

  return (
    <>
      <div className={classes.header}>
        <Typography className={classes.typography} variant="h6">
          Select Students or Classes
        </Typography>
        <CloseIcon className={classes.closeIcon} onClick={onClosePopover} />
      </div>

      <MuiTabs
        firstTab={() => sendStudent()}
        secondTab={() => oneTouchSend()}
      />
    </>
  );
};

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      closeNewChannel: chatActions.closeNewChannel
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateChatChannelInput));
