import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGreetings } from '../../api/home';
import { setConversation, setInitialLoad } from './hudStoryActions';
import { HudStoryState } from './hudStoryState';

// story sequence delay in milliseconds
const storySequenceDelay = 7000;

const storyTimeout = (storyMessage, index) => {
  const dispatch = useDispatch();
  setTimeout(() => {
    dispatch(setConversation(storyMessage));
  }, storySequenceDelay * index);
};

const useStorySequence = () => {
  const dispatch = useDispatch();
  const startConversation = (storySequence: string[]) => {
    const storySequenceWithEndMarker = [...storySequence, ''];
    storySequenceWithEndMarker.forEach((storyMessage, index) => {
      setTimeout(() => {
        dispatch(setConversation(storyMessage));
      }, storySequenceDelay * index);
    });
  };

  const initialLoadTriggered: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.initialLoadTriggered
  );

  const loadStory = () => {
    if (!initialLoadTriggered) {
      fetchGreetings(moment().format('YYYY-MM-DDThh:mm:ss')).then((welcomeMessage) => {
        const storySequence = [welcomeMessage.greetings.title, welcomeMessage.greetings.body];
        startConversation(storySequence);
        dispatch(setInitialLoad());
      });
    }
  };
  return loadStory;
};

export default useStorySequence;
