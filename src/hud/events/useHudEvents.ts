export type HudEvent = {
  eventName: string;
  eventData: Record<string, string>;
  rootAreaId: string;
  leafAreaId: string;
};

export type HudEventHandler = (hudEvent: HudEvent) => void;

const hudEventHandlers: HudEventHandler[] = [];
const unsentHudEvents: HudEvent[] = [];
let rootAreaId: string | null = null;
let leafAreaId: string | null = null;

const useHudEvents = () => {
  const postEvent = (eventName: string, eventData?: Record<string, string>): void => {
    const hudEvent = {
      eventName,
      eventData,
      rootAreaId,
      leafAreaId
    };
    unsentHudEvents.push(hudEvent);

    hudEventHandlers.forEach((hudEventHandler: HudEventHandler) => {
      try {
        hudEventHandler(hudEvent);
      } catch {
        // TODO better error handling
        console.log('Unable to process hud event.', eventName);
      }
    });

    // TODO call API with bulk event message
  };

  // TODO find a better way to sync the event bus and the redux state
  const setHudAreaSync = (nextRootAreaId: string, nextLeafAreaId?: string): void => {
    rootAreaId = nextRootAreaId;
    leafAreaId = nextLeafAreaId;
  };

  const listenToEvents = (hudEventHandler: HudEventHandler): void => {
    hudEventHandlers.push(hudEventHandler);
  };

  return {
    setHudAreaSync,
    postEvent,
    listenToEvents
  };
};

export default useHudEvents;
