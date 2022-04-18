import { useCallback, useContext, memo } from 'react';

import { useClickOutside } from '@mantine/hooks';
import update from 'immutability-helper';
import max from 'lodash/max';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useHotkeys } from 'react-hotkeys-hook';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { HOTKEYS } from 'hooks/useHotKey';

import AddDeckButton from '../FlashcardsDeckManager/AddDeckButton';

import FlashcardEditor from './FlashcardEditor';
import { FlashcardListContext, FlashcardListContextProvider } from './FlashcardListContext';
import useStyles from './styles';

export const EDITOR_TYPES = {
  QUESTION: 'question',
  ANSWER: 'answer'
};

type Props = {
  data?: any;
  readOnly?: any;
  toolbarPrefix?: any;
  onUpdate?: any;
  onSetRef?: any;
  onUpdateFlashcardField?: any;
};

const FlashcardsListEditorComponent = ({
  data,
  readOnly,
  toolbarPrefix,
  onUpdate,
  onSetRef,
  onUpdateFlashcardField
}: Props) => {
  // Hooks
  const classes: any = useStyles();
  const { activeFlashcard, setActiveFlashcard } = useContext(FlashcardListContext);
  // States
  // Event Handlers
  const handleAddNewDeck = useCallback(() => {
    const maxId = max(data.map((item) => item.id)) || 1;

    onUpdate(
      update(data, {
        $push: [
          {
            id: maxId,
            question: '',
            answer: ''
          }
        ]
      })
    );
  }, [data, onUpdate]);
  const handleDeleteDeck = useCallback(
    (index) => {
      onUpdate(
        update(data, {
          $splice: [[index, 1]]
        })
      );
    },
    [data, onUpdate]
  );
  const handleUpdateDeckField = useCallback(
    (index, field, value) => {
      onUpdateFlashcardField(index, field, value);
    },
    [onUpdateFlashcardField]
  );
  const handleDragEnd = useCallback(
    (result) => {
      const indexSrc = result.source.index;
      const indexDst = result.destination.index;

      if (indexDst === null || indexDst === indexSrc) {
        return;
      }

      const newData = [...data];
      const [removed] = newData.splice(indexSrc, 1);
      newData.splice(indexDst, 0, removed);
      onUpdate(newData);
    },
    [data, onUpdate]
  );
  const handleGoToNextCard = useCallback(() => {
    if (readOnly) {
      return;
    }

    const modalElement = document.getElementById('flashcards-edit-modal');
    const { index, card } = activeFlashcard;

    if (index === null) {
      setActiveFlashcard({
        index: 0,
        card: EDITOR_TYPES.QUESTION
      });
      return;
    }

    if (card === EDITOR_TYPES.QUESTION) {
      setActiveFlashcard({
        index,
        card: EDITOR_TYPES.ANSWER
      });
    } else {
      if (index === data.length - 1) {
        handleAddNewDeck();
      }

      setActiveFlashcard({
        index: index + 1,
        card: EDITOR_TYPES.QUESTION
      });
      modalElement.scrollTo({
        top: modalElement.scrollTop + 220,
        behavior: 'smooth'
      });
    }
  }, [activeFlashcard, setActiveFlashcard, handleAddNewDeck, readOnly]);
  const handleGoToPrevCard = useCallback(() => {
    if (readOnly) {
      return;
    }

    const modalElement = document.getElementById('flashcards-edit-modal');
    const { index, card } = activeFlashcard;

    if (index === null) {
      return;
    }

    if (card === EDITOR_TYPES.ANSWER) {
      setActiveFlashcard({
        index,
        card: EDITOR_TYPES.QUESTION
      });
    } else if (index > 0) {
      setActiveFlashcard({
        index: index - 1,
        card: EDITOR_TYPES.ANSWER
      });
      modalElement.scrollTo({
        top: modalElement.scrollTop - 220,
        behavior: 'smooth'
      });
    } else {
      setActiveFlashcard({
        index: null,
        card: null
      });
    }
  }, [activeFlashcard, setActiveFlashcard, readOnly]);
  const handleOutsideClick = useCallback(() => {
    if (readOnly) {
      return;
    }

    setActiveFlashcard({
      index: null,
      card: null
    });
  }, [readOnly]);

  const ref = useClickOutside(handleOutsideClick);

  // Handle Shortcut keys
  useHotkeys(HOTKEYS.TAB.key, handleGoToNextCard, {}, [handleGoToNextCard]);
  useHotkeys(HOTKEYS.PRIOR_TAB.key, handleGoToPrevCard, {}, [handleGoToPrevCard]);

  return (
    <div ref={ref}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Grid
              container
              {...provided.droppableProps}
              placeholder={provided.placeholder}
              ref={provided.innerRef}
              style={{
                width: '100%'
              }}
            >
              {data.map((item, index) => (
                <Grid key={item.id} item xs={12}>
                  <Draggable draggableId={`item-${item.id}`} index={index}>
                    {(provided) => (
                      <div
                        className={classes.draggableItem}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <FlashcardEditor
                          data={item}
                          onSetRef={onSetRef}
                          index={index}
                          toolbarPrefix={`${toolbarPrefix}-${item.id}`}
                          readOnly={readOnly}
                          dndProps={provided.dragHandleProps}
                          onDelete={handleDeleteDeck}
                          onUpdate={handleUpdateDeckField}
                        />
                      </div>
                    )}
                  </Draggable>
                </Grid>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
      {!readOnly && (
        <Box mt={2}>
          <AddDeckButton onClick={handleAddNewDeck} />
        </Box>
      )}
    </div>
  );
};

FlashcardsListEditorComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      answer: PropTypes.string,
      answerImage: PropTypes.string,
      id: PropTypes.number,
      question: PropTypes.string,
      questionImage: PropTypes.string
    })
  ),
  onUpdate: PropTypes.func,
  onUpdateFlashcardField: PropTypes.func,
  onSetRef: PropTypes.func,
  readOnly: PropTypes.bool,
  toolbarPrefix: PropTypes.string
};

FlashcardsListEditorComponent.defaultProps = {
  data: [],
  onUpdate: () => {},
  onUpdateFlashcardField: () => {},
  onSetRef: () => {},
  readOnly: false,
  toolbarPrefix: ''
};

const FlashcardsListEditor = memo((props: Props) => (
  <FlashcardListContextProvider>
    <FlashcardsListEditorComponent {...props} />
  </FlashcardListContextProvider>
));

export default FlashcardsListEditor;
