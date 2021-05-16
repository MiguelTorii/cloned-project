import React, { useCallback, useEffect, useState } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';
import ReactCardFlip from 'react-card-flip';
import CardBoardContent from './CardBoardContent';

const CardBoard = ({ data, onAction }) => {
  const [isQuestion, setIsQuestion] = useState(true);
  const [cardKey, setCardKey] = useState(null);

  // Effects
  useEffect(() => {
    setIsQuestion(true);
    setCardKey(data.id);
  }, [data, setIsQuestion, setCardKey]);

  // Event Handlers
  const handleFlip = useCallback(() => {
    setIsQuestion(!isQuestion);
  }, [isQuestion, setIsQuestion]);

  return (
    <ReactCardFlip isFlipped={!isQuestion} key={cardKey}>
      <div key="front">
        <CardBoardContent
          content={data.question}
          image={data.questionImage}
          onFlip={handleFlip}
          isQuestion={true}
        />
      </div>
      <div key="back">
        <CardBoardContent
          content={data.answer}
          image={data.answerImage}
          onFlip={handleFlip}
          isQuestion={false}
          onAction={onAction}
        />
      </div>
    </ReactCardFlip>
  );
};

CardBoard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    question: PropTypes.string,
    questionImage: PropTypes.string,
    answer: PropTypes.string,
    answerImage: PropTypes.string
  }).isRequired,
  onAction: PropTypes.func
};

CardBoard.defaultProps = {
  onAction: () => {}
};

export default withRoot(CardBoard);
