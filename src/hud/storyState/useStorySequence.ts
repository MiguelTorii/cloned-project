import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGreetings } from '../../api/home';
import { setGreeting, setGreetingLoadTriggered } from './hudStoryActions';
import { HudStoryState } from './hudStoryState';
import { StorySequence } from './StorySequence';

const useStorySequence = () => {
  const dispatch = useDispatch();

  const [storySequence, setStorySequence] = useState<StorySequence>(null);

  const startConversation = (statements: string[]) => {
    // End the last story before starting the next story.
    if (storySequence) {
      storySequence.endStory(dispatch);
    }

    // Start the next story.
    const nextStorySequence = new StorySequence(statements);
    setStorySequence(nextStorySequence);
    nextStorySequence.startStory(dispatch);
  };

  const greetingLoadTriggered: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.greetingLoadTriggered
  );

  const greetingStatements: string[] = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.greetingStatements
  );

  const loadStory = () => {
    if (!greetingLoadTriggered) {
      fetchGreetings(moment().format('YYYY-MM-DDThh:mm:ss')).then((welcomeMessage) => {
        const statements = [welcomeMessage.greetings.title, welcomeMessage.greetings.body];
        dispatch(setGreeting(statements));
        startConversation(statements);
      });

      // Set the greeting load triggered state as soon as is requested,
      // i.e. don't wait for the promise to return (this ensures that we
      // don't put 2 requests in flight at the same time).
      dispatch(setGreetingLoadTriggered());
    }
  };

  const sayGreeting = () => {
    if (greetingStatements) {
      startConversation(greetingStatements);
    }
  };

  return {
    loadStory,
    sayGreeting
  };
};

export default useStorySequence;
