import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { useLocation } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import withRoot from '../../withRoot';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import FiltersBar from '../../components/FiltersBar/FiltersBar';
import FlashcardsDeck from '../../components/FlashcardsDeck/FlashcardsDeck';
import Dialog from '../../components/Dialog/Dialog';
import FlashcardsDeckCreator from '../../components/FlashcardsDeckManager/FlashcardsDeckCreator';
import SlideUp from '../../components/Transition/SlideUp';
import ImgEmptyState from '../../assets/svg/empty_flashcards.svg';
import { isApiCalling, getPastClassIds } from '../../utils/helpers';
import { userActions } from '../../constants/action-types';
import { getFlashcards, confirmTooltip as confirmTooltipAction } from '../../actions/user';
import useStyles from './styles';
import type { State as StoreState } from '../../types/state';
import { useAppSelector } from 'redux/store';

const Filters = {
  mine: {
    text: 'My Decks'
  },
  bookmarked: {
    text: 'My Bookmarked Decks'
  },
  past: {
    text: 'Past Class Decks'
  }
};

type Props = {
  viewedTooltips?: any;
  confirmTooltip?: any;
};

const FlashcardsList = ({ viewedTooltips, confirmTooltip }: Props) => {
  // Hooks
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const me = useSelector((state) => (state as any).user.data);
  const decks = useAppSelector((state) => state.user.flashcards);
  const isLoadingDecks = useSelector(isApiCalling(userActions.GET_FLASHCARDS));
  const pastClasses = useSelector((state) => (state as any).user.userClasses.pastClasses);
  const location = useLocation();

  // Internal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pastClassIds = useMemo(() => getPastClassIds(pastClasses), [pastClasses]);
  // Memos
  const arrFilters = useMemo(
    () =>
      Object.keys(Filters).map((key) => ({
        value: key,
        text: Filters[key].text
      })),
    []
  );
  const currentFilter = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get('filter') || 'mine';
  }, [location]);
  const decksToShow = useMemo(() => {
    const result = decks.ids.map((id) => decks.byId[id]);
    const myDecks = result.filter((item) => !pastClassIds.includes(item.classId));

    if (currentFilter === 'bookmarked') {
      return result.filter((item) => item.bookmarked);
    }

    if (currentFilter === 'past') {
      return result.filter((item) => pastClassIds.includes(item.classId));
    }

    return myDecks;
  }, [decks, currentFilter, pastClassIds]);
  // Callbacks
  const renderEmptyState = useCallback(
    () => (
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <img src={ImgEmptyState} alt="No flashcards" />
        <Box mt={3} fontSize={24}>
          {currentFilter === 'mine' && 'No flashcard decks yet.'}
          {currentFilter === 'bookmarked' && 'No bookmarked decks yet.'}
          {currentFilter === 'past' && 'No decks from any past classes yet.'}
        </Box>
        <Box mt={1} fontSize={16} className={classes.emptyContent}>
          {currentFilter === 'mine' &&
            'Level up your studying by creating your first flashcard deck!'}
          {currentFilter === 'bookmarked' &&
            'Start creating your own deck or check out your class feed to start bookmarking!'}
          {currentFilter === 'past' &&
            'Flashcard decks that you created for past classes or classes that have ended will appear here.'}
        </Box>
      </Box>
    ),
    [currentFilter, classes]
  );
  const handleCreate = useCallback(() => {
    setIsCreateModalOpen(true);
  }, [setIsCreateModalOpen]);
  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, [setIsCreateModalOpen]);
  const handleSelectFilter = useCallback(
    (filter) => {
      dispatch(push(`/flashcards?filter=${filter}`));
    },
    [dispatch]
  );
  // Effects
  useEffect(() => {
    switch (currentFilter) {
      case 'mine':
        dispatch(getFlashcards(me.userId));
        break;

      case 'bookmarked':
        dispatch(getFlashcards(undefined, true));
        break;

      case 'past':
        dispatch(getFlashcards(me.userId));
        break;

      default:
        throw new Error('Undefined filter');
    }
  }, [dispatch, me.userId, currentFilter]);

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
        {decksToShow.map((deck) => (
          <Grid item key={deck.feedId} xs={12} md={6} lg={4} xl={3}>
            <FlashcardsDeck data={deck} />
          </Grid>
        ))}
      </Grid>
    );
  };

  // Rendering
  return (
    <div className={classes.container}>
      {/* Deck Filter */}
      <Grid container justifyContent="flex-start" spacing={3}>
        <Grid item>
          <GradientButton onClick={handleCreate}>Create</GradientButton>
        </Grid>
        <Grid item>
          <FiltersBar
            data={arrFilters}
            activeValue={currentFilter}
            onSelectItem={handleSelectFilter}
          />
        </Grid>
      </Grid>

      {/* Render decks */}
      <Box mt={3}>{renderContent()}</Box>

      {/* Render Deck Creation Dialog */}
      <Dialog
        fullScreen
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        TransitionComponent={SlideUp}
      >
        <FlashcardsDeckCreator />
      </Dialog>
    </div>
  );
};

const mapStateToProps = ({ user }: StoreState) => ({
  viewedTooltips: user.syncData.viewedTooltips
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(FlashcardsList);
