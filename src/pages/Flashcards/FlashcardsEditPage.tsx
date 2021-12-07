import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useParams } from 'react-router';
import Layout from '../../containers/Layout/Layout';
import withRoot from '../../withRoot';
import FlashcardsEdit from '../../containers/FlashcardsEdit/FlashcardsEdit';

const FlashcardsEditPage = () => {
  const { flashcardId } = useParams();

  return (
    <main>
      <CssBaseline />
      <Layout>
        <FlashcardsEdit flashcardId={flashcardId} />
      </Layout>
    </main>
  );
};

export default withRoot(FlashcardsEditPage);
