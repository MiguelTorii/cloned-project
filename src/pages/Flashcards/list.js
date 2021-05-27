import React, { useEffect } from 'react';
import withRoot from '../../withRoot';
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from '../../containers/Layout';
import FlashcardsList from '../../containers/FlashcardsList';
import LoadingSpin from 'components/LoadingSpin';
import Flashcards from 'pages/Create/Flashcards';
import { useDispatch, useSelector } from 'react-redux';
import { getFlashcardsCampaign } from 'actions/campaign';
import { isApiCalling } from 'utils/helpers';
import { campaignActions } from 'constants/action-types';

const FlashcardsListPage = () => {
  const isNewVersion = useSelector((state) => state.campaign.newFlashcardsExperience);
  const isLoading = useSelector(isApiCalling(campaignActions.GET_FLASHCARDS_CAMPAIGN));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFlashcardsCampaign());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpin />;
  }

  if (!isNewVersion) {
    return <Flashcards />;
  }

  return (
    <main>
      <CssBaseline />
      <Layout>
        <FlashcardsList />
      </Layout>
    </main>
  );
};

export default withRoot(FlashcardsListPage);
