import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGreetings } from '../../api/home';
import { setConversation, setInitialLoad } from './hudStoryActions';
import { HudStoryState } from './hudStoryState';

const useStorySequence = () => {
  const dispatch = useDispatch();
  const startConversation = (storySequence: string[]) => {
    storySequence.forEach((storyMessage, index) => {
      setTimeout(() => {
        dispatch(setConversation(storyMessage));
      }, 5000 * index);
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
        setInitialLoad(true);
      });
    }
  };
  return loadStory;
};

export default useStorySequence;
