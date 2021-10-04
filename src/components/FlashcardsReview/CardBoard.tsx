import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactCardFlip from "react-card-flip";
import withRoot from "../../withRoot";
import CardBoardContent from "./CardBoardContent";

const CardBoard = ({
  data,
  onAction
}) => {
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
  return <ReactCardFlip isFlipped={!isQuestion} key={currentData.id}>
      <div key="front">
        <CardBoardContent content={currentData.question} image={currentData.questionImage} onFlip={handleFlip} isQuestion />
      </div>
      <div key="back">
        <CardBoardContent content={currentData.answer} image={currentData.answerImage} onFlip={handleFlip} isQuestion={false} onAction={onAction} />
      </div>
    </ReactCardFlip>;
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