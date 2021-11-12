import { useDispatch } from 'react-redux';
import { setConversation } from '../actions/story';

const useStorySequence = (storySequence: string[]) => {
  const dispatch = useDispatch();
  storySequence.forEach((storyMessage, index) => {
    setTimeout(() => {
      dispatch(setConversation(storyMessage));
    }, 5000 * index);
  });
};

export default useStorySequence;
