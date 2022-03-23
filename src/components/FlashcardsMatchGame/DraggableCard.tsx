import React from 'react';

import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';

import Box from '@material-ui/core/Box';

import { DRAG_TYPES } from 'constants/enums';

import ContentCard from './ContentCard';

const DraggableCard = ({
  image,
  text,
  x,
  y,
  cardId,
  index,
  hasCorrectAnimation,
  hasIncorrectAnimation,
  onCorrectDrop,
  onIncorrectDrop
}) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: DRAG_TYPES.CARD,
    item: {
      cardId,
      index,
      image,
      text
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });
  const [{ isOver }, dropRef] = useDrop({
    accept: DRAG_TYPES.CARD,
    drop: (item: any) => {
      if (item.cardId === cardId) {
        onCorrectDrop(item.index, index);
      } else {
        onIncorrectDrop(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });
  // Effects
  // Render
  return (
    <Box {...{ ref: dropRef }}>
      <ContentCard
        dragRef={dragRef}
        isDragging={isDragging}
        isOver={isOver}
        image={image}
        text={text}
        x={x}
        y={y}
        hasCorrectAnimation={hasCorrectAnimation}
        hasIncorrectAnimation={hasIncorrectAnimation}
      />
    </Box>
  );
};

DraggableCard.propTypes = {
  cardId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  image: PropTypes.string,
  text: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  hasCorrectAnimation: PropTypes.bool,
  hasIncorrectAnimation: PropTypes.bool,
  onCorrectDrop: PropTypes.func,
  onIncorrectDrop: PropTypes.func
};
DraggableCard.defaultProps = {
  image: '',
  text: '',
  x: 0,
  y: 0,
  hasCorrectAnimation: false,
  hasIncorrectAnimation: false,
  onCorrectDrop: () => {},
  onIncorrectDrop: () => {}
};
export default DraggableCard;
