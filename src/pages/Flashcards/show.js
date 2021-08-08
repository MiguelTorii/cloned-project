import React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from '../../containers/Layout';
import FlashcardsShow from '../../containers/FlashcardsShow';
import withRoot from '../../withRoot';
import LoadingSpin from 'components/LoadingSpin';
import Flashcards from 'pages/View/Flashcards';
import { useSelector } from 'react-redux';
import { isApiCalling } from 'utils/helpers';
import { campaignActions } from 'constants/action-types';
import { Grid } from '@material-ui/core';

const FlashcardsShowPage = () => {
  const isNewVersion = useSelector((state) => state.campaign.newFlashcardsExperience);
  const isLoading = useSelector(isApiCalling(campaignActions.GET_FLASHCARDS_CAMPAIGN));

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpin />;
    }

    if (!isNewVersion) {
      return <Flashcards />;
    }

    return <FlashcardsShow />;
  };

  return (
    <main>
      <Layout>
        <Grid container justify="center">
          <Grid item xs={11} lg={10}>
            { renderBody() }
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default FlashcardsShowPage;
