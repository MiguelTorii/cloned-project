import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import useStyles from './styles';
import { extractTextFromHtml } from '../../utils/helpers';
import withRoot from '../../withRoot';

const ContentCard = ({
  dragRef,
  image,
  text,
  x,
  y,
  hasCorrectAnimation,
  hasIncorrectAnimation,
  isDragging,
  isOver
}) => {
  const classes: any = useStyles();
  // Memo
  const extractText = useMemo(() => extractTextFromHtml(text), [text]);
  return (
    <Box
      {...({ ref: dragRef } as any)}
      display="flex"
      alignItems="center"
      className={clsx(
        classes.contentCard,
        (isDragging || isOver) && 'hover',
        isDragging && 'dragging',
        hasCorrectAnimation && 'correct',
        hasIncorrectAnimation && 'incorrect'
      )}
      style={{
        left: x,
        top: y
      }}
    >
      {image && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={classes.imageContainer}
        >
          <img src={image} alt="Flashcard" className={classes.contentImage} />
        </Box>
      )}
      {extractText && <Typography className={classes.contentText}>{extractText}</Typography>}
    </Box>
  );
};

ContentCard.propTypes = {
  image: PropTypes.string,
  text: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  hasCorrectAnimation: PropTypes.bool,
  hasIncorrectAnimation: PropTypes.bool,
  dragRef: PropTypes.func
};
ContentCard.defaultProps = {
  image: '',
  text: '',
  x: 0,
  y: 0,
  isDragging: false,
  isOver: false,
  hasCorrectAnimation: false,
  hasIncorrectAnimation: false,
  dragRef: undefined
};
export default withRoot(ContentCard);
