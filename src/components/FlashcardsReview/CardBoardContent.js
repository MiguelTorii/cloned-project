import React  from 'react';
import withRoot from '../../withRoot';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import Button from "@material-ui/core/Button";
import IconRepeat from "@material-ui/icons/Replay";
import PropTypes from 'prop-types';
import useStyles from './styles';
import parse from 'html-react-parser';
import { ANSWER_LEVELS } from './index';
import ClickableImage from 'components/ClickableImage';

const CardBoardContent = (
  {
    content,
    image,
    isQuestion,
    onFlip,
    onAction
  }
) => {
  const classes = useStyles();

  const isEditing = false;

  return (
    <div className={classes.cardBoardContainer}>
      { isEditing && (
        <div className={classes.gradientBar} />
      )}
      <div className={classes.cardBoardContent}>
        <Box display="flex" width="100%" height="100%" alignItems="center">
          {image && (
            <Box
              width={content ? 250 : '100%'}
              height={content ? 250 : '100%'}
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr={3}
            >
              <ClickableImage src={image} className={classes.cardBoardImage} alt="Flashcard" />
            </Box>
          )}
          {content && (
            <Box
              className={
                clsx(
                  classes.cardBoardTextContainer,
                  content.length < 200 && 'large-font'
                )
              }
            >
              <div>
                { parse(content) }
              </div>
            </Box>
          )}
        </Box>
      </div>
      { !isQuestion && (
        <Box mt={2} mb={2}>
          <Box display="flex" justifyContent="center" alignItems="center">
            { ANSWER_LEVELS.map((item) => (
              <Box ml={2} mr={2} key={item.level}>
                <Button
                  startIcon={<span>{item.emoji}</span>}
                  className={classes.cardBoardActionButton}
                  onClick={() => onAction(item.level)}
                >
                  { item.title }
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <div className={classes.cardBoardFooter}>
        <div>
        </div>
        <Button
          size="large"
          endIcon={<IconRepeat />}
          classes={{
            root: classes.flipButton
          }}
          onClick={onFlip}
        >
          { isQuestion ?
            'Flip for Answer' :
            'Flip'
          }
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
  isQuestion: PropTypes.bool,
  onFlip: PropTypes.func,
  onAction: PropTypes.func
};

CardBoardContent.defaultProps = {
  editable: false,
  isQuestion: true,
  onAction: () => {}
};

export default withRoot(CardBoardContent);
