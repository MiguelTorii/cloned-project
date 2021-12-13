import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGreetings } from '../../api/home';
import { StorySequence, StorySequenceOptions } from './StorySequence';
import useHudEvents from '../events/useHudEvents';
import { hudEventNames } from '../events/hudEventNames';
import { UserState } from '../../reducers/user';
import { User } from '../../types/models';

let storySequence: StorySequence = null;
let greetingLoadTriggered = false;
let greetingStatements: string[] = [];

const useStorySequence = () => {
  const dispatch = useDispatch();

  const { postEvent } = useHudEvents();

  const user: User = useSelector((state: { user: UserState }) => state.user.data);

  const startNextStory = (options: StorySequenceOptions): void => {
    // End the last story before starting the next story.
    if (storySequence) {
      storySequence.endStory(dispatch);
    }

    // Start the next story.
    const nextStorySequence = new StorySequence(options, () =>
      postEvent(hudEventNames.CURRENT_STORY_COMPLETED)
    );
    storySequence = nextStorySequence;
    nextStorySequence.startStory(dispatch);
  };

  if (!greetingLoadTriggered && user) {
    fetchGreetings(moment().format('YYYY-MM-DDThh:mm:ss')).then((welcomeMessage) => {
      greetingStatements = [welcomeMessage.greetings.title, welcomeMessage.greetings.body];

      // Don't say anything if we are already in some other conversation.
      if (storySequence && storySequence.isReading()) {
        return;
      }

      startNextStory({ statements: greetingStatements, isPersistent: true });
    });

    // Set the greeting load triggered state as soon as is requested,
    // i.e. don't wait for the promise to return (this ensures that we
    // don't put 2 requests in flight at the same time).
    greetingLoadTriggered = true;
  }

  const sayGreeting = () => {
    if (greetingStatements) {
      startNextStory({ statements: greetingStatements, isPersistent: true });
    }
  };

  return {
    sayGreeting,
    startNextStory
  };
};

export default useStorySequence;
