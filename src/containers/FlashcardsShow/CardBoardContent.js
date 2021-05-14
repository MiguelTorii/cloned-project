import React  from 'react';
import withRoot from '../../withRoot';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import ReactQuill from "react-quill";
import QuillToolbar from '../../components/QillToolbar';
import Button from "@material-ui/core/Button";
import IconRepeat from "@material-ui/icons/Replay";
import PropTypes from 'prop-types';
import useStyles from './styles';

const CardBoardContent = (
  {
    content,
    image,
    editable,
    toolbarId,
    onFlip
  }
) => {
  const classes = useStyles();
  // const [isEditing, setIsEditing] = useState(false);

  const isEditing = false;

  return (
    <div className={classes.cardBoardContainer}>
      { isEditing && (
        <div className={classes.gradientBar} />
      )}
      <div className={classes.cardBoardContent}>
        <Box display="flex" width="100%" height="100%" alignItems="center">
          { image && (
            <Box
              width={250}
              height={250}
              display="flex"
              alignItems="center"
              mr={3}
            >
              <img src={image} className={classes.cardBoardImage} alt="Flashcard" />
            </Box>
          )}
          <Box
            className={
              clsx(
                classes.cardBoardTextContainer,
                content.length < 200 && 'large-font'
              )
            }
          >
            <ReactQuill
              modules={{
                toolbar: {
                  container: `#${toolbarId}`
                }
              }}
              readOnly
              value={content}
            />
          </Box>
        </Box>
      </div>
      <div className={classes.cardBoardFooter}>
        <div>
          <div className={clsx(!isEditing && classes.hidden)}>
            <QuillToolbar elementId={toolbarId} />
          </div>
        </div>
        <Button
          size="large"
          endIcon={<IconRepeat />}
          classes={{
            root: classes.flipButton
          }}
          onClick={onFlip}
        >
          Flip
        </Button>
      </div>
    </div>
  );
};

CardBoardContent.propTypes = {
  content: PropTypes.string.isRequired,
  image: PropTypes.string,
  toolbarId: PropTypes.string,
  editable: PropTypes.bool,
  onFlip: PropTypes.func
};

CardBoardContent.defaultProps = {
  editable: false
};

export default withRoot(CardBoardContent);
