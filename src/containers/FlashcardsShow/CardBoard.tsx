import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactCardFlip from 'react-card-flip';
import { useHotkeys } from 'react-hotkeys-hook';
import CardBoardContent from './CardBoardContent';
import withRoot from '../../withRoot';

const QUESTION_TOOLBAR_ID = 'cardboard_toolbar_question';
const ANSWER_TOOLBAR_ID = 'cardboard_toolbar_answer';

const CardBoard = ({ data }) => {
  const [isQuestion, setIsQuestion] = useState(true);
  const [currentData, setCurrentData] = useState({});
  // Effects
  useEffect(() => {
    setIsQuestion(true);
    setCurrentData(data);
  }, [data]);
  // Event Handlers
  const handleFlip = useCallback(() => {
    setIsQuestion(!isQuestion);
  }, [isQuestion, setIsQuestion]);
  // Handle Shortcut Keys
  useHotkeys('Space', handleFlip, {}, [handleFlip]);
  return (
    <ReactCardFlip isFlipped={!isQuestion} key={(currentData as any).id}>
      <div key="front">
        <CardBoardContent
          content={(currentData as any).question}
          image={(currentData as any).question_image_url}
          toolbarId={QUESTION_TOOLBAR_ID}
          onFlip={handleFlip}
        />
      </div>
      <div key="back">
        <CardBoardContent
          content={(currentData as any).answer}
          image={(currentData as any).answer_image_url}
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
