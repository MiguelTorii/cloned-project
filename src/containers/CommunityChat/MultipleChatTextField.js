/* eslint-disable react/no-danger */
// @flow
import React, { useRef, useState, useCallback } from 'react';
import Textarea from 'react-textarea-autosize';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
// import IconButton from '@material-ui/core/IconButton'
import ButtonBase from '@material-ui/core/ButtonBase';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto'
import ClearIcon from '@material-ui/icons/Clear';
import EmojiSelector from 'components/EmojiSelector/EmojiSelector';
import get from 'lodash/get';
import useStyles from './_styles/multipleChatTextField';

type Props = {
  setMessage: Function,
  message: string,
  input: string,
  setInput: Function
};

const MultipleChatTextField = ({ setMessage, message, input, setInput }: Props) => {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const fileInput = useRef(null);

  const handleChange = useCallback(
    (event) => {
      setMessage(event.target.value);
    },
    [setMessage]
  );

  // const handleOpenInputFile = useCallback(() => {
  // if (fileInput.current) fileInput.current.click()
  // }, [])

  const handleInputChange = useCallback(() => {
    if (get(fileInput, 'current.files.length')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (get(fileInput, 'current.files.length')) {
          setImage(event.target.result);
          setInput(fileInput.current.files[0]);
        }
        if (fileInput.current) {
          fileInput.current.value = '';
        }
      };

      reader.readAsDataURL(fileInput.current.files[0]);
    }
  }, [setInput]);

  const handleRemoveImg = useCallback(() => {
    setImage(null);
    setIsHover(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const handleSelect = useCallback(
    (emoji) => {
      setMessage((m) => `${m}${emoji}`);
    },
    [setMessage]
  );

  return (
    <Paper className={classes.root} elevation={0}>
      <form autoComplete="off" className={classes.form}>
        <div className={classes.formContainer}>
          <div className={classes.inputContainer}>
            <input
              accept="image/*"
              className={classes.input}
              ref={fileInput}
              onChange={handleInputChange}
              type="file"
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                minHeight: 44
              }}
            >
              {/* Remove false to add images */}
              {false && image && (
                <ButtonBase
                  className={classes.imgContainer}
                  onClick={handleRemoveImg}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img className={classes.img} src={image} alt="test" />
                  {isHover && (
                    <div className={classes.clearIcon}>
                      <ClearIcon fontSize="small" />
                    </div>
                  )}
                </ButtonBase>
              )}
              <InputBase
                value={message}
                onChange={handleChange}
                className={classes.textfield}
                inputComponent={Textarea}
                inputProps={{
                  style: { maxHeight: 100, paddingTop: 5, width: '100%' }
                }}
                multiline
                rows={4}
                // placeholder="Type a message"
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>
          <div className={classes.buttonsContainer}>
            {/* Uncomment to add images */}
            {/* <div className={classes.iconButton}> */}
            {/* <IconButton */}
            {/* className={classes.imgIcon} */}
            {/* onClick={handleOpenInputFile} */}
            {/* aria-label="Insert Photo" */}
            {/* > */}
            {/* <InsertPhotoIcon /> */}
            {/* </IconButton> */}
            {/* </div> */}
            <EmojiSelector onSelect={handleSelect} />
          </div>
        </div>
      </form>
    </Paper>
  );
};

export default MultipleChatTextField;
