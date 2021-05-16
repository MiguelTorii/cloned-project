import React, { useCallback, useEffect, useState } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';
import ReactCardFlip from 'react-card-flip';
import CardBoardContent from './CardBoardContent';

const QUESTION_TOOLBAR_ID = 'cardboard_toolbar_question';
const ANSWER_TOOLBAR_ID = 'cardboard_toolbar_answer';

const CardBoard = ({ data }) => {
  const [isQuestion, setIsQuestion] = useState(true);
  const [cardKey, setCardKey] = useState(null);

  // Effects
  useEffect(() => {
    setIsQuestion(true);
    setCardKey(data.id);
  }, [data]);

  // Event Handlers
  const handleFlip = useCallback(() => {
    setIsQuestion(!isQuestion);
  }, [isQuestion, setIsQuestion]);

  return (
    <ReactCardFlip isFlipped={!isQuestion} key={cardKey}>
      <div key="front">
        <CardBoardContent
          content={data.question}
          image={data.question_image_url}
          toolbarId={QUESTION_TOOLBAR_ID}
          onFlip={handleFlip}
        />
      </div>
      <div key="back">
        <CardBoardContent
          content={data.answer}
          image={data.answer_image_url}
          toolbarId={ANSWER_TOOLBAR_ID}
          onFlip={handleFlip}
        />
      </div>
    </ReactCardFlip>
  );
};

CardBoard.propTypes = {
  data: PropTypes.shape({
    question: PropTypes.string,
    question_image_url: PropTypes.string,
    answer: PropTypes.string,
    answer_image_url: PropTypes.string
  }).isRequired
};

export default withRoot(CardBoard);
