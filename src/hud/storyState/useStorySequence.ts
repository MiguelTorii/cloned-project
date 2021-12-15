import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGreetings } from '../../api/home';
import { StorySequence, StorySequenceOptions } from './StorySequence';
import useHudEvents from '../events/useHudEvents';
import { hudEventNames } from '../events/hudEventNames';
import { UserState } from '../../reducers/user';
import { User } from '../../types/models';
import { currentStoryCompleted, setCurrentStatement } from './hudStoryActions';

const STORY_COMPLETION_TO_CLOSE_DELAY_IN_MS = 30000;

let storySequence: StorySequence = null;
let greetingLoadTriggered = false;
let greetingStatements: string[] = [];

/**
 * Actually a number but specified as NodeJS.Timeout in the .dts file,
 * so use `any` type to make typescript compiler happy.
 */
let storyCompletedTimeoutId: any = null;

const useStorySequence = () => {
  const dispatch = useDispatch();

  const { postEvent } = useHudEvents();

  const user: User = useSelector((state: { user: UserState }) => state.user.data);

  const closeStory = () => {
    if (storySequence) {
      storySequence.endStory(dispatch);
    }
    storySequence = null;
    dispatch(setCurrentStatement(''));

    if (storyCompletedTimeoutId) {
      clearTimeout(storyCompletedTimeoutId);
      storyCompletedTimeoutId = null;
    }
  };

  const startNextStory = (options: StorySequenceOptions): void => {
    // End the last story before starting the next story.
    closeStory();

    // Start the next story.
    const nextStorySequence = new StorySequence(options, () => {
      dispatch(currentStoryCompleted());
      postEvent(hudEventNames.CURRENT_STORY_COMPLETED);

      if (storyCompletedTimeoutId) {
        clearTimeout(storyCompletedTimeoutId);
      }
      storyCompletedTimeoutId = setTimeout(() => {
        closeStory();
      }, STORY_COMPLETION_TO_CLOSE_DELAY_IN_MS);
    });
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

  const sayStatement = (statement: string) => {
    startNextStory({ statements: [statement], isPersistent: true });
  };

  return {
    sayGreeting,
    startNextStory,
    sayStatement,
    closeStory
  };
};

export default useStorySequence;
