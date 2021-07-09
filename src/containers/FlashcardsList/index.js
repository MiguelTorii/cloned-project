import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import ImgEmptyState from 'assets/svg/empty_flashcards.svg';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLocation } from 'react-router';
import { push } from 'connected-react-router';
import GiveFeedback from 'containers/GiveFeedback'
import withRoot from '../../withRoot';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import useStyles from './styles';
import FiltersBar from '../../components/FiltersBar';
import { getFlashcards, confirmTooltip as confirmTooltipAction } from '../../actions/user';
import FlashcardsDeck from '../../components/FlashcardsDeck';
import { isApiCalling } from '../../utils/helpers';
import { userActions } from '../../constants/action-types';
import Dialog from '../../components/Dialog';
import FlashcardsDeckCreator from '../../components/FlashcardsDeckManager/FlashcardsDeckCreator';
import SlideUp from '../../components/Transition/SlideUp';
import OnboardingFlashcards from 'containers/OnboardingFlashcards';

const Filters = {
  mine: {
    text: 'My Decks'
  },
  bookmarked: {
    text: 'My Bookmarked Decks'
  }
};

const FlashcardsList = ({
  viewedTooltips,
  confirmTooltip,
}) => {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.data);
  const decks = useSelector((state) => state.user.flashcards);
  const isLoadingDecks = useSelector(isApiCalling(userActions.GET_FLASHCARDS));
  const location = useLocation();

  // Internal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false)

  // Memos
  const arrFilters = useMemo(() => {
    return Object.keys(Filters).map((key) => ({
      value: key,
      text: Filters[key].text
    }));
  }, []);

  const currentFilter = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get('filter') || 'mine';
  }, [location]);

  const decksToShow = useMemo(() => {
    const result = decks.ids.map((id) => decks.byId[id]);
    if (currentFilter === 'bookmarked') {
      return result.filter((item) => item.bookmarked);
    }
    return result;
  }, [decks, currentFilter]);

  // Callbacks
  const renderEmptyState = useCallback(() => (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      <img src={ImgEmptyState} alt="No flashcards" />
      <Box mt={3} fontSize={24}>
        { currentFilter === 'mine' && 'No flashcard decks yet.' }
        { currentFilter === 'bookmarked' && 'No bookmarked decks yet.' }
      </Box>
      <Box mt={1} fontSize={16}>
        { currentFilter === 'mine' && 'Level up your studying by creating your first flashcard deck!' }
        { currentFilter === 'bookmarked' && 'Start creating your own deck or check out your class feed to start bookmarking!' }
      </Box>
    </Box>
  ), [currentFilter]);

  const handleOpenFeedback = useCallback(() => {
    setOpenFeedback(true)
  }, [])

  const handleCloseFeedback = useCallback(() => {
    setOpenFeedback(false)
  }, [])

  const handleCreate = useCallback(() => {
    // history.push('/flashcards/new');
    setIsCreateModalOpen(true);
  }, [setIsCreateModalOpen]);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, [setIsCreateModalOpen]);

  const handleSelectFilter = useCallback((filter) => {
    dispatch(push(`/flashcards?filter=${filter}`));
  }, [dispatch]);

  const updateOnboarding = useCallback(async () => {
    await confirmTooltip(8453)
  }, [confirmTooltip])

  const onboardingOpen = useMemo(() => (
    Boolean(viewedTooltips && !viewedTooltips.includes(8453))
  ), [viewedTooltips])

  // Effects
  useEffect(() => {
    switch (currentFilter) {
    case 'mine':
      dispatch(getFlashcards(me.userId));
      break;
    case 'bookmarked':
      dispatch(getFlashcards(undefined, true));
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
      <OnboardingFlashcards
        userId={me.userId}
        updateOnboarding={updateOnboarding}
        open={onboardingOpen}
      />

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
          <GradientButton onClick={handleCreate}>
            Create
          </GradientButton>

          <Typography
            variant='caption'
            color='primary'
            className={classes.feedback}
            onClick={handleOpenFeedback}
          >
            Give Feedback
          </Typography>
        </Grid>
      </Grid>

      <GiveFeedback
        origin='Flashcard'
        open={openFeedback}
        onClose={handleCloseFeedback}
      />

      { /* Deck Filter */ }
      <Box mt={4}>
        <FiltersBar
          data={arrFilters}
          activeValue={currentFilter}
          onSelectItem={handleSelectFilter}
        />
      </Box>

      { /* Render decks */ }
      <Box mt={3}>
        { renderContent() }
      </Box>

      { /* Render Deck Creation Dialog */ }
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

const mapStateToProps = ({ user }: StoreState): {} => ({
  viewedTooltips: user.syncData.viewedTooltips,
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      confirmTooltip: confirmTooltipAction,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(FlashcardsList));

