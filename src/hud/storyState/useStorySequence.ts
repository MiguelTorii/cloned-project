import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import store from 'store';
import { fetchGreetings } from '../../api/home';
import { StorySequence, IStorySequenceOptions } from './StorySequence';
import useHudEvents from '../events/useHudEvents';
import { hudEventNames } from '../events/hudEventNames';
import { UserState } from '../../reducers/user';
import { User } from '../../types/models';
import { currentStoryCompleted, setCurrentStatement } from './hudStoryActions';
import { STORAGE_KEYS } from '../../constants/app';
import { DATE_FORMAT } from '../../constants/common';

const STORY_COMPLETION_DELAY_IN_MS = 30000;

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

  const closeStoryInternal = () => {
    if (storySequence) {
      storySequence.endStory();
    }
    storySequence = null;

    if (storyCompletedTimeoutId) {
      clearTimeout(storyCompletedTimeoutId);
      storyCompletedTimeoutId = null;
    }
  };

  const canUserCloseStory = (): boolean => storySequence && storySequence.canBeClosedByUser;

  const closeStory = () => {
    if (!canUserCloseStory()) {
      return;
    }

    // Keep current date into the local storage to show the story once per day.
    store.set(STORAGE_KEYS.STORY_CLOSE_DATE, moment().format(DATE_FORMAT));

    closeStoryInternal();

    dispatch(setCurrentStatement(''));
  };

  const isStoryClosedToday = (): boolean =>
    store.get(STORAGE_KEYS.STORY_CLOSE_DATE) === moment().format(DATE_FORMAT);

  const startNextStory = (options: IStorySequenceOptions): void => {
    // End the last story before starting the next story.
    closeStoryInternal();

    // Start the next story.
    const nextStorySequence = new StorySequence(options, () => {
      dispatch(currentStoryCompleted());
      postEvent(hudEventNames.CURRENT_STORY_COMPLETED);

      if (storyCompletedTimeoutId) {
        clearTimeout(storyCompletedTimeoutId);
      }
      if (options.canBeClosedByUser) {
        storyCompletedTimeoutId = setTimeout(() => {
          closeStory();
        }, STORY_COMPLETION_DELAY_IN_MS);
      }
    });
    storySequence = nextStorySequence;
    nextStorySequence.startStory(dispatch);
  };

  if (!greetingLoadTriggered && user && !isStoryClosedToday()) {
    fetchGreetings(moment().format('YYYY-MM-DDThh:mm:ss')).then((welcomeMessage) => {
      greetingStatements = [welcomeMessage.greetings.title, welcomeMessage.greetings.body];

      // Don't say anything if we are already in some other conversation.
      if (storySequence && storySequence.isReading()) {
        return;
      }

      startNextStory({ statements: greetingStatements, canBeClosedByUser: true });
    });

    // Set the greeting load triggered state as soon as is requested,
    // i.e. don't wait for the promise to return (this ensures that we
    // don't put 2 requests in flight at the same time).
    greetingLoadTriggered = true;
  }

  const sayGreeting = () => {
    // Check if the story has already showed up today.
    if (isStoryClosedToday()) {
      return;
    }

    if (greetingStatements) {
      startNextStory({ statements: greetingStatements, canBeClosedByUser: true });
    }
  };

  return {
    sayGreeting,
    startNextStory,
    canUserCloseStory,
    closeStory
  };
};

export default useStorySequence;
