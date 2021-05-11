import React, { useCallback, useEffect, useState } from 'react';
import withRoot from '../../withRoot';
import Grid from "@material-ui/core/Grid";
import FlashcardEditor from './FlashcardEditor';
import Box from '@material-ui/core/Box';
import OutsideClickHandler from 'react-outside-click-handler';
import AddDeckButton from '../FlashcardsDeckCreator/AddDeckButton';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
import update from 'immutability-helper';
import useStyles from './styles';

type Props = {
  initialList: Array<Object>,
  onUpdate: Function
};

const FlashcardsListEditor = ({ initialList = [], onUpdate }: Props) => {
  // Hooks
  const classes = useStyles();

  // States
  const [cardList, setCardList] = useState(
    initialList.map((item, index) => ({ ...item, id: index + 1 }))
  );
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  // Effects

  // eslint-disable-next-line
  useEffect(() => onUpdate(cardList), [cardList]);

  // Event Handlers
  const handleAddNewDeck = useCallback(() => {
    const maxId = _.max(cardList.map((item) => item.id));
    setCardList(update(cardList, {
      $push: [{ id: maxId ? (maxId + 1) : 1 }]
    }));
  }, [cardList, setCardList]);

  const handleDeleteDeck = useCallback((index) => {
    if (activeCardIndex) {
      if (index === activeCardIndex) setActiveCardIndex(null);
      else if (activeCardIndex > index) setActiveCardIndex(activeCardIndex - 1);
    }

    setCardList(update(cardList, {
      $splice: [[index, 1]]
    }));
  }, [cardList, setCardList, activeCardIndex, setActiveCardIndex]);

  const handleUpdateDeck = useCallback((index, deck) => {
    setCardList(update(cardList, {
        [index]: { $set: { ...deck } }
    }));
  }, [cardList, setCardList]);

  const handleOutsideClick = useCallback(() => {
    setActiveCardIndex(null);
  }, [setActiveCardIndex]);

  const handleDragEnd = useCallback((result) => {
    const indexSrc = result.source.index;
    const indexDst = result.destination.index;

    if (indexDst === null || indexDst === indexSrc) return ;

    const [removed] = cardList.splice(indexSrc, 1);
    cardList.splice(indexDst, 0, removed);

    setCardList([...cardList]);
    setActiveCardIndex(indexDst);
  }, [cardList, setCardList, setActiveCardIndex]);

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
                  {
                    cardList.map((item, index) => (
                      <Grid key={item.id} item xs={12} onMouseDown={() => setActiveCardIndex(index)}>
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
                                  dndProps={provided.dragHandleProps}
                                  onDelete={handleDeleteDeck}
                                  onUpdateData={handleUpdateDeck}
                                />
                              </div>
                            )
                          }
                        </Draggable>
                      </Grid>
                    ))
                  }
                  { provided.placeholder }
                </Grid>
              )
            }
          </Droppable>
        </DragDropContext>
      </OutsideClickHandler>
      <Box mt={2}>
        <AddDeckButton onClick={handleAddNewDeck} />
      </Box>
    </>
  )
};

export default withRoot(FlashcardsListEditor);
