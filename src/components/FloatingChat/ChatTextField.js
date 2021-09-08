/* eslint-disable react/sort-comp */
/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Textarea from 'react-textarea-autosize';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import SendIcon from '@material-ui/icons/Send';
import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
// import { ReactComponent as PaperClip } from 'assets/svg/quill-paper.svg';
import { ReactComponent as FloatChatInsertPhotoIcon } from 'assets/svg/float_chat_insert_photo.svg';
import AttachFile from 'components/FileUpload/AttachFile';
import { bytesToSize } from 'utils/chat';
import * as notificationsActions from '../../actions/notifications';
import { uploadMedia } from '../../actions/user';
import EmojiSelector from '../EmojiSelector';

import styles from '../_styles/FloatingChat/ChatTextField';

type Props = {
  classes: Object,
  expanded: boolean,
  hideImage: boolean,
  onSendMessage: Function,
  onSendInput: Function,
  enqueueSnackbar: Function,
  onTyping: Function,
  userId: string
};

type State = {
  message: string,
  addNextLine: boolean,
  image: ?Object,
  input: ?Object,
  isHover: boolean
};

class ChatTextField extends React.PureComponent<Props, State> {
  state = {
    message: '',
    addNextLine: false,
    image: null,
    input: null,
    isHover: false,
    files: [],
    loading: false
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { onSendMessage, onSendInput } = this.props;
    const { message, input } = this.state;
    if (message.trim() !== '') {
      onSendMessage(message);
      this.setState({ message: '' });
    }

    if (input) {
      onSendInput(input);
      this.setState({ input: null, image: null, isHover: false });
    }
  };

  handleChange = (event) => {
    const { onTyping } = this.props;
    this.setState({ message: event.target.value });
    onTyping();
  };

  handleOpenInputFile = () => {
    if (this.fileInput) this.fileInput.click();
  };

  handleKeyDown = (event) => {
    const { addNextLine, input, files } = this.state;
    const { onSendInput } = this.props;
    if (event.keyCode === 13 && (files.length > 0 || !addNextLine)) {
      event.preventDefault();
      const { onSendMessage } = this.props;
      const { message } = this.state;
      if (message.trim() !== '' || !!files.length) {
        onSendMessage(message, files);
        this.setState({ message: '', files: [] });
      }
      if (input) {
        onSendInput(input);
        this.setState({ input: null, image: null, isHover: false });
      }
    }
    if (event.keyCode === 16) {
      this.setState({ addNextLine: true });
    }
  };

  handleKeyUp = (event) => {
    if (event.keyCode === 16) {
      this.setState({ addNextLine: false });
    }
  };

  handleInputChange = async () => {
    const { enqueueSnackbar } = this.props;
    const fileType = this.fileInput.files[0].type;
    const { files } = this.state;
    const { userId } = this.props;

    if (fileType.includes('image')) {
      if (
        this.fileInput &&
        this.fileInput.files &&
        this.fileInput.files.length > 0
      ) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (
            this.fileInput &&
            this.fileInput.files &&
            this.fileInput.files.length > 0
          ) {
            this.setState({
              image: event.target.result,
              input: this.fileInput.files[0]
            });
          }
          if (this.fileInput) {
            this.fileInput.value = '';
          }
        };

        reader.readAsDataURL(this.fileInput.files[0]);
      }
    } else {
      const file = this.fileInput.files[0];
      const { type, name, size } = file;
      if (size < 40 * 1024 * 1024) {
        this.setState({ loading: true });

        const result = await uploadMedia(userId, 1, file);

        const { readUrl } = result;

        const anyFile = {
          type,
          name,
          url: readUrl,
          size: bytesToSize(size)
        };

        this.setState({ files: [...files, anyFile], loading: false });
      } else {
        enqueueSnackbar({
          notification: {
            message: 'Upload File size is over 40 MB',
            options: {
              variant: 'warning',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 3000
            }
          }
        });
      }
    }
  };

  handleRemoveImg = () => {
    this.setState({ image: null, input: null, isHover: false });
  };

  handleMouseEnter = () => {
    this.setState({ isHover: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHover: false });
  };

  handleSelect = (emoji) => {
    this.setState(({ message }) => ({ message: `${message}${emoji}` }));
  };

  onClose = (deleteFile) => {
    const { files } = this.state;
    const filterFiles = files.filter((file) => file.url !== deleteFile.url);
    this.setState({ files: filterFiles });
  };

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  render() {
    const { hideImage, classes, expanded } = this.props;
    const { message, image, isHover, files, loading } = this.state;

    return (
      <Paper className={classes.root} elevation={1}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <form
            autoComplete="off"
            className={classes.form}
            onSubmit={this.handleSubmit}
          >
            {!hideImage && (
              <IconButton
                onClick={this.handleOpenInputFile}
                className={classes.iconButton}
                aria-label="Insert Photo"
              >
                <FloatChatInsertPhotoIcon />
                {/* <PaperClip /> */}
              </IconButton>
            )}
            <input
              // accept="*/*"
              accept="image/*"
              className={classes.input}
              ref={(fileInput) => {
                this.fileInput = fileInput;
              }}
              onChange={this.handleInputChange}
              type="file"
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                minHeight: 44
              }}
            >
              <InputBase
                value={message}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                className={classes.textfield}
                inputComponent={Textarea}
                inputProps={{
                  style: { maxHeight: expanded ? 200 : 100, paddingTop: 5 }
                }}
                multiline
                rowsMax={2}
                placeholder="Type a message"
                autoComplete="off"
                autoFocus
                endAdornment={
                  image && (
                    <ButtonBase
                      className={classes.imgContainer}
                      onClick={this.handleRemoveImg}
                      onMouseEnter={this.handleMouseEnter}
                      onMouseLeave={this.handleMouseLeave}
                    >
                      <img className={classes.img} src={image} alt="test" />
                      {isHover && (
                        <div className={classes.clearIcon}>
                          <ClearIcon fontSize="small" />
                        </div>
                      )}
                    </ButtonBase>
                  )
                }
              />
            </div>
            <EmojiSelector onSelect={this.handleSelect} isFloatChat />
            {(message || image) && (
              <Divider light className={classes.divider} />
            )}
            {(message || image) && (
              <Tooltip
                arrow
                classes={{
                  tooltip: classes.tooltip
                }}
                placement="top"
                title="Press enter to send"
              >
                <IconButton
                  color="primary"
                  type="submit"
                  className={classes.iconButton}
                  aria-label="Send"
                >
                  <SendIcon className={classes.sendMessageIcon} />
                </IconButton>
              </Tooltip>
            )}
          </form>
        )}
        {files.length > 0 && (
          <div className={classes.files}>
            {files.map((file) => (
              <AttachFile
                smallChat
                file={file}
                onClose={() => this.onClose(file)}
              />
            ))}
          </div>
        )}
      </Paper>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChatTextField));
