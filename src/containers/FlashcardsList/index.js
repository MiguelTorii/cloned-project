import React, { useCallback, useEffect, useMemo, useState } from 'react';
import withRoot from '../../withRoot';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import useStyles from './styles';
import FiltersBar from '../../components/FiltersBar';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { getFlashcards } from '../../actions/user';
import FlashcardsDeck from '../../components/FlashcardsDeck';
import LoadImg from '../../components/LoadImg';
import ImgEmptyState from 'assets/img/no_flashcards.png';
import CircularProgress from "@material-ui/core/CircularProgress";
import { isApiCalling } from '../../utils/helpers';
import { userActions } from '../../constants/action-types';

const Filters = {
  all: {
    text: 'My Decks'
  },
  bookmarked: {
    text: 'My Bookmarked Decks'
  }
};

const FlashcardsList = () => {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.data);
  const decks = useSelector((state) => state.user.flashcards);
  const isLoadingDecks = useSelector(isApiCalling(userActions.GET_FLASHCARDS));

  // Internal states
  const [filter, setFilter] = useState('all');

  // Memos
  const arrFilters = useMemo(() => {
    return Object.keys(Filters).map((key) => ({
      value: key,
      text: Filters[key].text
    }));
  }, []);

  const decksToShow = useMemo(() => {
    switch (filter) {
      case 'all':
        return decks.ids.map((id) => decks.byId[id]);
      case 'bookmarked':
        return decks
          .ids
          .filter((id) => decks.byId[id].bookmarked)
          .map((id) => decks.byId[id]);
      default:
        return [];
    }
  }, [decks, filter]);

  // Callbacks
  const renderEmptyState = useCallback(() => (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      <LoadImg url={ImgEmptyState} />
      <Box mt={3} fontSize={24}>
        { filter === 'all' && 'No flashcard decks yet.' }
        { filter === 'bookmarked' && 'No bookmarked decks yet.' }
      </Box>
      <Box mt={1} fontSize={16}>
        { filter === 'all' && 'Level up your studying by creating your first flashcard deck!' }
        { filter === 'bookmarked' && 'Start creating your own deck or check out your class feed to start bookmarking!' }
      </Box>
    </Box>
  ), [filter]);

  // Effects
  useEffect(() => {
    dispatch(getFlashcards(me.userId));
  }, [dispatch, me.userId]);

  // Helpers for rendering
  const renderContent = () => {
    if (isLoadingDecks) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      );
    }

    if (decksToShow.length === 0) {
      return renderEmptyState();
    }

    return (
      <Grid container spacing={3}>
        {
          decksToShow.map((deck) => (
            <Grid item key={deck.feed_id} xs={12} md={6} lg={4} xl={3}>
              <FlashcardsDeck
                data={deck}
              />
            </Grid>
          ))
        }
      </Grid>
    );
  };

  // Rendering
  return (
    <div className={classes.container}>

      { /* Title Section */ }
      <Grid
        container
        justify="flex-start"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Typography variant="h5">
            Flashcards
          </Typography>
        </Grid>
        <Grid item>
          <GradientButton>
            Create
          </GradientButton>
        </Grid>
      </Grid>

      { /* Deck Filter */ }
      <Box mt={4}>
        <FiltersBar
          data={arrFilters}
          activeValue={filter}
          onSelectItem={setFilter}
        />
      </Box>

      { /* Render decks */ }
      <Box mt={3}>
        { renderContent() }
      </Box>
    </div>
  );
};

export default withRoot(FlashcardsList);
