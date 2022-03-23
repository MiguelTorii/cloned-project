import React, { useMemo } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconRepeat from '@material-ui/icons/Replay';

import { extractTextFromHtml } from 'utils/helpers';

import ClickableImage from 'components/ClickableImage/ClickableImage';
import QuillToolbar from 'components/QillToolbar/QuillToolbar';
import withRoot from 'withRoot';

import useStyles from './styles';

const CardBoardContent = ({ content, image, editable, toolbarId, onFlip }) => {
  const classes: any = useStyles();
  // const [isEditing, setIsEditing] = useState(false);
  const isEditing = false;
  const contentText = useMemo(() => extractTextFromHtml(content), [content]);
  return (
    <div className={classes.cardBoardContainer}>
      {isEditing && <div className={classes.gradientBar} />}
      <div className={classes.cardBoardContent}>
        <Box display="flex" width="100%" height="100%" alignItems="center">
          {image && (
            <Box
              width={contentText.length > 0 ? 250 : '100%'}
              height={contentText.length > 0 ? 250 : '100%'}
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr={3}
            >
              <ClickableImage src={image} className={classes.cardBoardImage} alt="Flashcard" />
            </Box>
          )}
          {contentText.length > 0 && (
            <Box
              className={clsx(classes.cardBoardTextContainer, content.length < 200 && 'large-font')}
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
          )}
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
  editable: false,
  image: null,
  toolbarId: null,
  onFlip: () => {}
};
export default withRoot(CardBoardContent);
