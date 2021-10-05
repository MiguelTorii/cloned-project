/* eslint-disable react/no-danger */
import React, { useRef, useState, useCallback } from 'react';
import Textarea from 'react-textarea-autosize';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
// import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ClearIcon from '@material-ui/icons/Clear';
import EmojiSelector from '../../components/EmojiSelector/EmojiSelector';

const styles = (theme) => ({
  tooltip: {
    fontSize: 14
  },
  root: {
    display: 'flex',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing()
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderRadius: theme.spacing(4),
    // backgroundColor: theme.circleIn.palette.primaryBackground,
    marginLeft: 8
  },
  form: {
    display: 'flex',
    flex: 1
  },
  textfield: {
    width: '100%' // paddingLeft: theme.spacing(2),
  },
  sendIcon: {
    color: theme.circleIn.palette.brand
  },
  imgIcon: {
    padding: 0
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  input: {
    display: 'none'
  },
  imgContainer: {
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    objectFit: 'scale-down',
    width: 60,
    borderRadius: 4
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  formContainer: {
    flex: 1,
    padding: theme.spacing(1, 1 / 2, 0, 1 / 2),
    borderRadius: theme.spacing(),
    border: 'solid 1px rgba(255, 255, 255, 0.2)'
  }
});

type Props = {
  classes: Record<string, any>;
  setMessage: (...args: Array<any>) => any;
  message: string;
  input: string;
  setInput: (...args: Array<any>) => any;
};

const MultipleChatTextField = ({ classes, setMessage, message, input, setInput }: Props) => {
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
  // if (fileInput.current) fileInput.current.click();
  // }, [])
  const handleInputChange = useCallback(() => {
    if (fileInput.current && fileInput.current.files && fileInput.current.files.length > 0) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (fileInput.current && fileInput.current.files && fileInput.current.files.length > 0) {
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
                  style: {
                    maxHeight: 100,
                    paddingTop: 5,
                    width: '100%'
                  }
                }}
                multiline
                rows={4} // placeholder="Type a message"
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

export default withStyles(styles as any)(MultipleChatTextField);
