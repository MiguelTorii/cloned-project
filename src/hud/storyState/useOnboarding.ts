import { useEffect } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import useStorySequence from './useStorySequence';
import useHudEvents, { HudEvent } from '../events/useHudEvents';
import { setNavigationHighlight } from '../navigationState/hudNavigationActions';
import useNavigationHighlighter from './useNavigationHighlighter';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { onboardingStorySections } from './onboardingStorySections';
import { StorySection } from './StorySection';
import { hudEventNames } from '../events/hudEventNames';
import { HudStoryState } from './hudStoryState';

let onboardingTriggered = false;
let currentStorySection: StorySection | null = null;
let nextStorySectionIndex = 0;

const getNextStorySections = (): StorySection[] => {
  const storySections: StorySection[] = [];

  for (let i = nextStorySectionIndex; i < onboardingStorySections.length; i++) {
    const nextStorySection = onboardingStorySections[i];
    if (nextStorySection) {
      storySections.push(nextStorySection);

      if (!nextStorySection.canSkip) {
        break;
      }
    } else {
      break;
    }
  }
  return storySections;
};

const useOnboarding = () => {
  const dispatch = useDispatch();

  const { postEvent, listenToEvents } = useHudEvents();

  const { startNextStory } = useStorySequence();

  useNavigationHighlighter();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedLeafAreaId: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const onboardingFlowTriggered: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.onboardingFlowTriggered
  );

  const startStorySection = (storySection: StorySection): void => {
    currentStorySection = storySection;
    nextStorySectionIndex += 1;

    // Go to a specific route, as required by the story section.
    if (storySection.startingRoute) {
      dispatch(push(storySection.startingRoute));
    }

    // Start the conversation.
    startNextStory(storySection);

    // Highlight a navigation control if needed.
    if (storySection.highlightRootAreaId && storySection.highlightLeafAreaId) {
      dispatch(
        setNavigationHighlight(storySection.highlightRootAreaId, storySection.highlightLeafAreaId)
      );
    }
  };

  useEffect(() => {
    if (!onboardingTriggered && onboardingFlowTriggered) {
      onboardingTriggered = true;

      listenToEvents((hudEvent: HudEvent) => {
        if (hudEvent.eventName === hudEventNames.CURRENT_STORY_COMPLETED) {
          if (currentStorySection && currentStorySection.completionEvent) {
            const { completionEvent } = currentStorySection;
            currentStorySection = null;
            postEvent(completionEvent);
          }
        } else {
          const nextStorySections = getNextStorySections();
          nextStorySections.forEach((storySection: StorySection) => {
            if (storySection.triggerEventName === hudEvent.eventName) {
              if (
                !storySection.leafAreaId ||
                storySection.leafAreaId === hudEvent.eventData?.leafAreaId
              ) {
                startStorySection(storySection);
              }
            }
          });
        }
      });

      postEvent(hudEventNames.START_ONBOARDING);
    }
  }, [onboardingFlowTriggered]);

  return {};
};

export default useOnboarding;
