import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import _ from 'lodash';
import useStyles from './styles';
import AddDeckButton from '../FlashcardsDeckManager/AddDeckButton';
import FlashcardEditor from './FlashcardEditor';

const FlashcardsListEditor = ({
  data,
  readOnly,
  toolbarPrefix,
  onUpdate,
  onSetRef,
  onUpdateFlashcardField,
}: Props) => {
  // Hooks
  const classes = useStyles();

  // States

  // Event Handlers
  const handleAddNewDeck = useCallback(() => {
    const maxId = _.max(data.map((item) => item.id));
    onUpdate(
      update(data, {
        $push: [
          {
            id: maxId ? maxId + 1 : 1,
            question: '',
            answer: '',
          },
        ],
      })
    );
  }, [data, onUpdate]);

  const handleDeleteDeck = useCallback(
    (index) => {
      onUpdate(
        update(data, {
          $splice: [[index, 1]],
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

      if (indexDst === null || indexDst === indexSrc) return;

      const newData = [...data];
      const [removed] = newData.splice(indexSrc, 1);
      newData.splice(indexDst, 0, removed);

      onUpdate(newData);
    },
    [data, onUpdate]
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Grid
              container
              {...provided.droppableProps}
              placeholder={provided.placeholder}
              ref={provided.innerRef}
              style={{ width: '100%' }}
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
    </>
  );
};

FlashcardsListEditor.propTypes = {
  data: PropTypes.array,
  onUpdate: PropTypes.func,
  onUpdateFlashcardField: PropTypes.func,
  onSetRef: PropTypes.func,
  readOnly: PropTypes.bool,
  toolbarPrefix: PropTypes.string,
};

FlashcardsListEditor.defaultProps = {
  data: [],
  onUpdate: () => {},
  onUpdateFlashcardField: () => {},
  onSetRef: () => {},
  readOnly: false,
  toolbarPrefix: '',
};

export default FlashcardsListEditor;
