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
import { KEY_IS_FIRST_TIME, KEY_IS_FIRST_TIME_OPTION_YES } from '../../routeConstants';

let onboardingTriggered = false;
let currentStorySection: StorySection | null = null;

let lastSelectedMainArea: string | null = null;
let lastSelectedMainSubArea: string | null = null;

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

  const query: string = useSelector((state: any) => state.router.location.query);
  const isFirstTime = query[KEY_IS_FIRST_TIME];

  const startStorySection = (storySection: StorySection): void => {
    currentStorySection = storySection;

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
    if (!onboardingTriggered || !selectedLeafAreaId) {
      return;
    }

    if (
      lastSelectedMainArea === selectedMainArea &&
      lastSelectedMainSubArea === selectedLeafAreaId
    ) {
      // There was no route change, so don't trigger any additional onboarding events.
      return;
    }

    // TODO find a better way to synchronize the event bus and the redux state.
    lastSelectedMainArea = selectedMainArea;
    lastSelectedMainSubArea = selectedLeafAreaId;

    onboardingStorySections.forEach((storySection: StorySection) => {
      if (!storySection.triggerEventName && storySection.leafAreaId === selectedLeafAreaId) {
        startStorySection(storySection);
      }
    });
  }, [selectedMainArea, selectedLeafAreaId]);

  if (!onboardingTriggered && isFirstTime === KEY_IS_FIRST_TIME_OPTION_YES) {
    onboardingTriggered = true;

    listenToEvents((hudEvent: HudEvent) => {
      if (hudEvent.eventName === hudEventNames.CURRENT_STORY_COMPLETED) {
        if (currentStorySection && currentStorySection.completionEvent) {
          postEvent(currentStorySection.completionEvent);
          currentStorySection = null;
        }
      } else {
        onboardingStorySections.forEach((storySection: StorySection) => {
          if (storySection.triggerEventName === hudEvent.eventName) {
            if (!storySection.leafAreaId || storySection.leafAreaId === hudEvent.leafAreaId) {
              startStorySection(storySection);
            }
          }
        });
      }
    });

    postEvent(hudEventNames.START_ONBOARDING);
  }

  return {};
};

export default useOnboarding;
