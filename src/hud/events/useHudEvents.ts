import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { hudEventNames } from './hudEventNames';

import type { HudNavigationState } from '../navigationState/hudNavigationState';

export type HudEvent = {
  eventName: string;
  eventData: Record<string, string>;
};

export type HudEventHandler = (hudEvent: HudEvent) => void;

const hudEventHandlers: HudEventHandler[] = [];
const unsentHudEvents: HudEvent[] = [];

const useHudEvents = () => {
  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  useEffect(() => {
    postEvent(hudEventNames.NAVIGATED_TO_AREA, {
      mainAreaId: selectedMainArea,
      leafAreaId: selectedMainSubArea
    });
  }, [selectedMainArea, selectedMainSubArea]);

  const postEvent = (eventName: string, eventData?: Record<string, string>): void => {
    const hudEvent = {
      eventName,
      eventData
    };
    unsentHudEvents.push(hudEvent);

    hudEventHandlers.forEach((hudEventHandler: HudEventHandler) => {
      try {
        hudEventHandler(hudEvent);
      } catch (error) {
        // TODO better error handling
        console.log(`Unable to process hud event ${eventName}`, error);
      }
    });

    // TODO call API with bulk event message
  };

  const listenToEvents = (hudEventHandler: HudEventHandler): void => {
    hudEventHandlers.push(hudEventHandler);
  };

  return {
    postEvent,
    listenToEvents
  };
};

export default useHudEvents;
