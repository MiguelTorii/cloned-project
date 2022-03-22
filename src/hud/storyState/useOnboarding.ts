import { useEffect, useState } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import useStorySequence from './useStorySequence';
import useHudEvents, { HudEvent } from '../events/useHudEvents';
import {
  clearNavigationHighlight,
  setNavigationHighlight
} from '../navigationState/hudNavigationActions';
import useNavigationHighlighter from './useNavigationHighlighter';
import { onboardingStorySections } from './onboardingStorySections';
import { StorySection } from './StorySection';
import { hudEventNames } from '../events/hudEventNames';
import { HudStoryState } from './hudStoryState';
import { updateOnboardingAction } from '../../actions/user';
import { logEventLocally } from '../../api/analytics';
import { UserState } from '../../reducers/user';
import { User } from '../../types/models';
import { openOnboardingCompletedPopup } from './hudStoryActions';
import { onboardingStorySectionsNoRewards } from './onboardingStorySectionsNoRewards';
import useCampaigns from 'hooks/useCampaigns';

let onboardingTriggered = false;
let currentStorySection: StorySection | null = null;
let nextStorySectionIndex = 0;

const getNextStorySections = (allOnboardingStorySections: StorySection[]): StorySection[] => {
  const storySections: StorySection[] = [];

  for (let i = nextStorySectionIndex; i < allOnboardingStorySections.length; i++) {
    const nextStorySection = allOnboardingStorySections[i];
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
  const { isRewardsCampaignActive } = useCampaigns();

  const { postEvent, listenToEvents } = useHudEvents();

  const { startNextStory } = useStorySequence();

  const [allOnboardingStorySections, setAllOnboardingStorySections] = useState(
    onboardingStorySectionsNoRewards
  );

  useNavigationHighlighter();

  const user: User = useSelector((state: { user: UserState }) => state.user.data);

  const onboardingFlowTriggered: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.onboardingFlowTriggered
  );

  const startStorySection = (storySection: StorySection): void => {
    currentStorySection = storySection;
    nextStorySectionIndex = allOnboardingStorySections.indexOf(storySection) + 1;

    // Go to a specific route, as required by the story section.
    if (storySection.startingRoute) {
      dispatch(push(storySection.startingRoute));
    }

    // Start the conversation.
    startNextStory(storySection);

    // Highlight a navigation control if needed.
    // Use a timeout because the hud events can be dispatched before the
    // redux state settles.
    setTimeout(() => {
      if (storySection.highlightRootAreaId || storySection.highlightLeafAreaId) {
        dispatch(
          setNavigationHighlight(storySection.highlightRootAreaId, storySection.highlightLeafAreaId)
        );
      }
    }, 0);
  };

  useEffect(() => {
    if (isRewardsCampaignActive) {
      setAllOnboardingStorySections(onboardingStorySections);
    } else {
      setAllOnboardingStorySections(onboardingStorySectionsNoRewards);
    }
  }, [isRewardsCampaignActive]);

  useEffect(() => {
    if (!onboardingTriggered && onboardingFlowTriggered) {
      onboardingTriggered = true;

      listenToEvents((hudEvent: HudEvent) => {
        // Once the onboarding is complete, stop handling HUD events.
        if (!onboardingFlowTriggered) {
          return;
        }

        if (hudEvent.eventName === hudEventNames.ONBOARDING_COMPLETED) {
          logEventLocally({
            category: 'Onboarding',
            objectId: user.userId,
            type: 'Ended'
          });
          dispatch(updateOnboardingAction(true));
          dispatch(openOnboardingCompletedPopup());
          dispatch(clearNavigationHighlight());
        }

        if (hudEvent.eventName === hudEventNames.CURRENT_STORY_COMPLETED) {
          if (currentStorySection && currentStorySection.completionEvent) {
            const { completionEvent } = currentStorySection;
            currentStorySection = null;
            postEvent(completionEvent);
          }
        } else {
          const nextStorySections = getNextStorySections(allOnboardingStorySections);
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
