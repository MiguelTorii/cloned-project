import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useSelector } from "react-redux";
import { isApiCalling } from "utils/helpers";
import { campaignActions } from "constants/action-types";
import Grid from "@material-ui/core/Grid";
import CreateFlashcards from "containers/CreateFlashcards/CreateFlashcards";
import PostTips from "components/PostTips/PostTips";
import { useParams } from "react-router";
import FlashcardsList from "../../containers/FlashcardsList/FlashcardsList";
import Layout from "../../containers/Layout/Layout";
import withRoot from "../../withRoot";

const FlashcardsListPage = () => {
  const isNewVersion = useSelector(state => state.campaign.newFlashcardsExperience);
  const isLoading = useSelector(isApiCalling(campaignActions.GET_FLASHCARDS_CAMPAIGN));
  const {
    flashcardId
  } = useParams();

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpin />;
    }

    if (isNewVersion) {
      return <FlashcardsList />;
    }

    return <Grid container>
        <Grid item xs={12} sm={12} md={9}>
          <CreateFlashcards flashcardId={flashcardId} />
        </Grid>
        <Grid item xs={12} sm={0} md={3}>
          <PostTips type="flashcards" />
        </Grid>
      </Grid>;
  };

  return <main>
      <CssBaseline />
      <Layout>{renderBody()}</Layout>
    </main>;
};

export default withRoot(FlashcardsListPage);