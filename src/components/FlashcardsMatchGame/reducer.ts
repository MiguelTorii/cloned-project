import update from 'immutability-helper';
import _ from 'lodash';
import moment from 'moment';
import { shuffleArray } from '../../utils/helpers';

// Action Types
const INITIALIZE_GAME = 'INITIALIZE_GAME';
const PLACE_MORE_CARDS = 'PLACE_MORE_CARDS';
const DRAG_CARD_CORRECT = 'DRAG_CARD_CORRECT';
const DRAG_CARD_INCORRECT = 'DRAG_CARD_INCORRECT';
const RECORD_DRAGGED_CARDS = 'RECORD_DRAGGED_CARDS';
const REMOVE_LOGS = 'REMOVE_LOGS';
// Actions
export const initializeGame = (matchGameId, cardsData, containerWidth, containerHeight) => ({
  type: INITIALIZE_GAME,
  payload: {
    matchGameId,
    cardsData,
    containerWidth,
    containerHeight
  }
});
export const placeCards = () => ({
  type: PLACE_MORE_CARDS
});
export const dragCardCorrect = (index1, index2) => ({
  type: DRAG_CARD_CORRECT,
  payload: {
    index1,
    index2
  }
});
export const recordDraggedCards = (index1, index2) => ({
  type: RECORD_DRAGGED_CARDS,
  payload: {
    index1,
    index2
  }
});
export const dragCardIncorrect = () => ({
  type: DRAG_CARD_INCORRECT
});
export const removeLogs = (count) => ({
  type: REMOVE_LOGS,
  payload: {
    count
  }
});
export const DRAG_TYPE_CARD = 'CARD';
export const CARD_TYPES = {
  QUESTION: 'Q',
  ANSWER: 'A'
};
// Utility Methods
const CARD_PLACE_OFFSET = 10;
const MOVE_UNIT = 1;
const dx = [0, -1, 0, 1];
const dy = [-1, 0, 1, 0];

const intersectRect = (rect1, rect2) => {
  if (rect2.x >= rect1.x + rect1.w) {
    return false;
  }

  if (rect1.x >= rect2.x + rect2.w) {
    return false;
  }

  if (rect2.y >= rect1.y + rect1.h) {
    return false;
  }

  return rect1.y < rect2.y + rect2.h;
};

const getCardPosition = (containerWidth, containerHeight, cardWidth, cardHeight, placedCards) => {
  const randomX = Math.floor(Math.random() * containerWidth);
  const randomY = Math.floor(Math.random() * containerHeight);

  const size = _.max([containerWidth, containerHeight]);

  let offsetX = 0;
  let offsetY = 0;
  let currentStepLength = 0;
  let currentStep = 0;
  let direction = dx.length - 1;
  let mode = 1;

  while (currentStepLength * MOVE_UNIT <= size) {
    const cardX = randomX + offsetX * MOVE_UNIT;
    const cardY = randomY + offsetY * MOVE_UNIT;

    if (
      cardX >= 0 &&
      cardX < containerWidth - cardWidth &&
      cardY >= 0 &&
      cardY < containerHeight - cardHeight
    ) {
      const intersectIndex = placedCards.findIndex((rect) =>
        intersectRect(rect, {
          x: cardX - CARD_PLACE_OFFSET,
          y: cardY - CARD_PLACE_OFFSET,
          w: cardWidth + 2 * CARD_PLACE_OFFSET,
          h: cardHeight + 2 * CARD_PLACE_OFFSET
        })
      );

      if (intersectIndex < 0) {
        return [cardX, cardY];
      }
    }

    if (currentStep === currentStepLength) {
      direction = (direction + 1) % dx.length;
      mode = (mode + 1) % 2;
      currentStep = 0;

      if (mode === 0) {
        currentStepLength += 1;
      }
    }

    offsetX += dx[direction];
    offsetY += dy[direction];
    currentStep += 1;
  }

  return null;
};

export const initialState = {
  matchGameId: null,
  matchCards: [],
  containerWidth: null,
  containerHeight: null,
  logs: [],
  lastIndex: 0,
  correctCount: 0,
  incorrectCount: 0,
  matchStartTime: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE_GAME: {
      const { matchGameId, cardsData, containerWidth, containerHeight } = action.payload;
      const indexes = shuffleArray([...(new Array(cardsData.length) as any).keys()]);
      const cards = [];
      indexes.forEach((index) => {
        const card = cardsData[index];
        cards.push({
          cardId: card.id,
          cardType: CARD_TYPES.QUESTION,
          contentText: card.question,
          contentImage: card.questionImage,
          width: card.questionWidth,
          height: card.questionHeight,
          visible: false
        });
        cards.push({
          cardId: card.id,
          cardType: CARD_TYPES.ANSWER,
          contentText: card.answer,
          contentImage: card.answerImage,
          width: card.answerWidth,
          height: card.answerHeight,
          visible: false
        });
      });
      return update(state, {
        matchGameId: {
          $set: matchGameId
        },
        matchCards: {
          $set: cards
        },
        containerWidth: {
          $set: containerWidth
        },
        containerHeight: {
          $set: containerHeight
        },
        lastIndex: {
          $set: 0
        },
        correctCount: {
          $set: 0
        },
        incorrectCount: {
          $set: 0
        },
        matchStartTime: {
          $set: moment()
        },
        logs: {
          $set: []
        }
      });
    }

    case PLACE_MORE_CARDS: {
      const { matchCards, lastIndex, containerWidth, containerHeight } = state;
      const placedRects = [];
      let currentIndex;

      for (currentIndex = lastIndex; currentIndex < matchCards.length; currentIndex += 2) {
        let i;

        for (i = 0; i < 2; ++i) {
          const position = getCardPosition(
            containerWidth,
            containerHeight,
            matchCards[currentIndex + i].width,
            matchCards[currentIndex + i].height,
            placedRects
          );

          if (!position) {
            break;
          }

          placedRects.push({
            x: position[0],
            y: position[1],
            w: matchCards[currentIndex + i].width,
            h: matchCards[currentIndex + i].height
          });
        }

        if (i !== 2) {
          break;
        }

        for (i = 0; i < 2; ++i) {
          matchCards[currentIndex + i].x = placedRects[placedRects.length - 2 + i].x;
          matchCards[currentIndex + i].y = placedRects[placedRects.length - 2 + i].y;
          matchCards[currentIndex + i].visible = true;
        }
      }

      // If only one card is left, leave 2
      if (currentIndex === matchCards.length - 2) {
        matchCards[currentIndex].visible = false;
        currentIndex -= 1;
        matchCards[currentIndex].visible = false;
        currentIndex -= 1;
      }

      return update(state, {
        lastIndex: {
          $set: currentIndex
        }
      });
    }

    case DRAG_CARD_CORRECT: {
      const { index1, index2 } = action.payload;
      return update(state, {
        matchCards: {
          [index1]: {
            visible: {
              $set: false
            }
          },
          [index2]: {
            visible: {
              $set: false
            }
          }
        },
        correctCount: (count) => count + 1
      });
    }

    case DRAG_CARD_INCORRECT: {
      return update(state, {
        incorrectCount: (count) => count + 1
      });
    }

    case RECORD_DRAGGED_CARDS: {
      const { matchCards } = state;
      const { index1, index2 } = action.payload;
      return update(state, {
        logs: {
          $push: [
            {
              flashcard_id: matchCards[index1].cardId,
              matched_flashcard_id: matchCards[index2].cardId,
              match_time: moment().utc().valueOf()
            }
          ]
        }
      });
    }

    case REMOVE_LOGS: {
      const { count } = action.payload;
      return update(state, {
        logs: {
          $splice: [[0, count]]
        }
      });
    }

    default:
      throw new Error('Undefined Action Type');
  }
};

export default reducer;
