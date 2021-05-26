import React, { useCallback, useState } from 'react';
import withRoot from '../../withRoot';
import Grid from "@material-ui/core/Grid";
import FlashcardEditor from './FlashcardEditor';
import Box from '@material-ui/core/Box';
import OutsideClickHandler from 'react-outside-click-handler';
import AddDeckButton from '../FlashcardsDeckManager/AddDeckButton';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import update from 'immutability-helper';
import useStyles from './styles';
import PropTypes from 'prop-types';
import _ from 'lodash';

const FlashcardsListEditor = ({ data, readOnly, toolbarPrefix, onUpdate, onUpdateFlashcardField }: Props) => {
  // Hooks
  const classes = useStyles();

  // States
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  // Event Handlers
  const handleAddNewDeck = useCallback(() => {
    const maxId = _.max(data.map((item) => item.id));
    onUpdate(update(data, {
      $push: [{
        id: maxId ? (maxId + 1) : 1,
        question: '',
        answer: ''
      }]
    }));
  }, [data, onUpdate]);

  const handleDeleteDeck = useCallback((index) => {
    if (activeCardIndex) {
      if (index === activeCardIndex) setActiveCardIndex(null);
      else if (activeCardIndex > index) setActiveCardIndex(activeCardIndex - 1);
    }

    onUpdate(update(data, {
      $splice: [[index, 1]]
    }));
  }, [data, onUpdate, activeCardIndex, setActiveCardIndex]);

  const handleUpdateDeckField = useCallback((index, field, value) => {
    onUpdateFlashcardField(index, field, value);
  }, [onUpdateFlashcardField]);

  const handleOutsideClick = useCallback(() => {
    if (!readOnly) setActiveCardIndex(null);
  }, [setActiveCardIndex, readOnly]);

  const handleDragEnd = useCallback((result) => {
    const indexSrc = result.source.index;
    const indexDst = result.destination.index;

    if (indexDst === null || indexDst === indexSrc) return ;

    const newData = [...data];
    const [removed] = newData.splice(indexSrc, 1);
    newData.splice(indexDst, 0, removed);

    onUpdate(newData);
    setActiveCardIndex(indexDst);
  }, [data, onUpdate, setActiveCardIndex]);

  const handleFlashcardMouseDown = useCallback((index) => {
    if (!readOnly) setActiveCardIndex(index);
  }, [setActiveCardIndex, readOnly]);

  return (
    <>
      <OutsideClickHandler onOutsideClick={handleOutsideClick}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {
              (provided) => (
                <Grid
                  container
                  {...provided.droppableProps}
                  placeholder={provided.placeholder}
                  ref={provided.innerRef}
                  style={{width: '100%'}}
                >
                  { data.map((item, index) => (
                    <Grid key={item.id} item xs={12} onMouseDown={() => handleFlashcardMouseDown(index)}>
                      <Draggable draggableId={`item-${item.id}`} index={index}>
                        {
                          (provided) => (
                            <div
                              className={classes.draggableItem}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <FlashcardEditor
                                data={item}
                                active={activeCardIndex === index}
                                index={index}
                                toolbarPrefix={`${toolbarPrefix}-${index}`}
                                readOnly={readOnly}
                                dndProps={provided.dragHandleProps}
                                onDelete={handleDeleteDeck}
                                onUpdate={handleUpdateDeckField}
                              />
                            </div>
                          )
                        }
                      </Draggable>
                    </Grid>
                  ))}
                  { provided.placeholder }
                </Grid>
              )
            }
          </Droppable>
        </DragDropContext>
      </OutsideClickHandler>
      { !readOnly && (
        <Box mt={2}>
          <AddDeckButton onClick={handleAddNewDeck} />
        </Box>
      )}
    </>
  )
};

FlashcardsListEditor.propTypes = {
  data: PropTypes.array,
  onUpdate: PropTypes.func,
  onUpdateFlashcardField: PropTypes.func,
  readOnly: PropTypes.bool,
  toolbarPrefix: PropTypes.string
};

FlashcardsListEditor.defaultProps = {
  data: [],
  onUpdate: () => {},
  onUpdateFlashcardField: () => {},
  readOnly: false,
  toolbarPrefix: ''
};


export default withRoot(FlashcardsListEditor);
