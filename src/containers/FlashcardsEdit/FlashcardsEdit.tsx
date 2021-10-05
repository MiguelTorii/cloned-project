import React, { useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import withRoot from '../../withRoot';
import FlashcardsDeckEditor from '../../components/FlashcardsDeckManager/FlashcardsDeckEditor';
import { getFlashcards } from '../../api/posts';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';

const FlashcardsEdit = ({ flashcardId }) => {
  const [data, setData] = useState({});
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);
  const me = useSelector((state) => (state as any).user.data);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoadingFlashcards(true);
    getFlashcards({
      flashcardId,
      userId: me.userId
    }).then((rsp) => {
      setData({
        title: rsp.title,
        summary: rsp.summary,
        classId: rsp.classId,
        sectionId: rsp.sectionId,
        deck: (rsp.deck || []).map((item: any) => ({
          id: item.id,
          question: item.question,
          questionImage: item.question_image_url,
          answer: item.answer,
          answerImage: item.answer_image_url
        }))
      });
      setIsLoadingFlashcards(false);
    });
  }, [flashcardId, me.userId]);
  const handleAfterUpdate = useCallback(() => {
    dispatch(push(`/flashcards/${flashcardId}?source=deck`));
  }, [dispatch, flashcardId]);

  if (isLoadingFlashcards) {
    return <LoadingSpin />;
  }

  return (
    <Box pt={3} mb={2}>
      <FlashcardsDeckEditor
        flashcardId={flashcardId}
        data={data}
        onAfterUpdate={handleAfterUpdate}
      />
    </Box>
  );
};

export default withRoot(FlashcardsEdit);
