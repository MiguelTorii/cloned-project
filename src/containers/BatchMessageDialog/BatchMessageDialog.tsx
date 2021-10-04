import React, { useMemo, useState, useCallback } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "components/Dialog/Dialog";
import ClassMultiSelect from "containers/ClassMultiSelect/ClassMultiSelect";
import Typography from "@material-ui/core/Typography";
import MultipleChatTextField from "containers/CommunityChat/MultipleChatTextField";
import { makeStyles } from "@material-ui/core/styles";
import { sendBatchMessage } from "api/chat";
import Tooltip from "containers/Tooltip/Tooltip";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import type { State as StoreState } from "../../types/state";
const useStyles = makeStyles(theme => ({
  dialogRoot: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  }
}));

const BatchMessageDialog = ({
  chat,
  open,
  closeDialog
}) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(null);
  const {
    data: {
      local
    }
  } = chat;
  const classes = useStyles();
  const readyToSend = useMemo(() => Boolean(message && selectedClasses.length > 0 || !loading), [loading, message, selectedClasses.length]);
  const onSendMessage = useCallback(async () => {
    setLoading(true);
    const chatIds = {};
    Object.keys(local).forEach(sid => {
      const {
        sectionId
      } = local[sid];

      if (selectedClasses.find(sc => sc.sectionId === sectionId)) {
        chatIds[sid] = true;
      }
    });
    const res = await sendBatchMessage({
      message,
      chatIds: Object.keys(chatIds)
    });

    if (res) {
      closeDialog();
      setMessage('');
      setSelectedClasses([]);
    }

    setLoading(false);
  }, [closeDialog, local, message, selectedClasses]);
  return <Dialog open={open} fullWidth maxWidth="sm" onClose={closeDialog} onCancel={closeDialog}>
      <div className={classes.dialogRoot}>
        <Typography className={classes.title}>Send a message to multiple classes</Typography>

        <MultipleChatTextField setMessage={setMessage} input={input} message={message} setInput={setInput} />

        <Tooltip id={9049} placement="right" text="Here is where you can select which classes you want to message. 👋">
          <ClassMultiSelect variant="standard" placeholder="Select Classes..." selected={selectedClasses} onSelect={setSelectedClasses} />
        </Tooltip>

        <Button variant="contained" onClick={onSendMessage} disabled={!readyToSend} color="primary">
          {loading ? <CircularProgress /> : 'Send Multiple Messages'}
        </Button>
      </div>
    </Dialog>;
};

const mapStateToProps = ({
  chat
}: StoreState): {} => ({
  chat
});

export default connect(mapStateToProps, null)(BatchMessageDialog);