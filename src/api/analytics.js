// @flow

import amplitude from 'amplitude-js';
import mixpanel from 'mixpanel-browser';
import createEvent from './events';
import { EventData } from '../types/models';

const MIXPANEL_EVENT_NAMES = [
  'Chat- Send Message-Image',
  'Chat- Send Message-Text',
  'Feed- Open Filter',
  'Feed- Start Search',
  'Flashcard- Created',
  'Flashcard- Rated',
  'Home- Start Ask Question',
  'Home- Start Ask Question',
  'Home- Start Share Link',
  'Join Class- Opened',
  'Onboarding- Ended',
  'Onboarding- First Onboarding Opened',
  'Onboarding- Started',
  'Referral- Copied',
  'Referral- Opened',
  'User- Generated Link',
  'User- Opened Generated Link',
  'User- Submitted Class Form',
  'User- View Chat Room',
  'Video- Session Length',
  'Video- Start Video-Chat',
  'Video- Start Video-Profile',
  'Video- Start Video-Video',
];

const CIRCLEIN_EVENT_NAMES = [
  'Chat- Send Message-Text',
  'Chat- Send Message-Image',
  'Video- Start Video-Chat',
  'Video- Start Video-Profile',
  'Video- Start Video-Video',
  'Video- Session Length',
];

export const init = (key: string, newKey: string) => {
  try {
    amplitude.getInstance().init(key, null, { includeReferrer: true });
    amplitude
      .getInstance('web')
      .init(newKey, null, { includeReferrer: true, batchEvents: true });
  } catch (err) {
    console.log(err);
  }
};

export const setUserId = (userId: string) => {
  try {
    amplitude.getInstance().setUserId(userId);
    amplitude.getInstance('web').setUserId(userId);
    mixpanel.identify(userId);
  } catch (err) {
    console.log(err);
  }
};

export const setUserAlias = (userId: string) => {
  mixpanel.alias(userId);
}

export const setUserProperties = ({ props }: { props: Object }) => {
  try {
    amplitude.getInstance().setUserProperties(props);
    amplitude.getInstance('web').setUserProperties(props);
  } catch (err) {
    console.log(err);
  }
};

const fromAmplitudeToEventName = ({ event, props }): string => {
  let eventName = event;

  if (props && props.Content) {
    eventName += `-${props.Content}`;
  } else if (props && props['Initiated From']) {
    eventName += `-${props['Initiated From']}`;
  }

  return eventName;
}

const toEventName = (eventData: EventData): string => {
  return `${eventData.category}- ${eventData.type}`;
}

const toEventData = (eventName: string): EventData => {
  const [category, type] = eventName.split('- ');
  return { category, type, objectId: '' };
}

const sendToMixpanel = (eventName) => {
  if (MIXPANEL_EVENT_NAMES.includes(eventName)) mixpanel.track(eventName);
}

export const logEventLocally = (eventData: EventData) => {
  try {
    createEvent(eventData);
    sendToMixpanel(toEventName(eventData));
  } catch (err) {
    console.log(err);
  }
}

const sendToCircleIn = (eventName: string) => {
  if (CIRCLEIN_EVENT_NAMES.includes(eventName)) {
    createEvent(toEventData(eventName));
  }
}

export const logEvent = ({
  event,
  props
}: {
  event: string,
  props: Object
}) => {
  try {
    amplitude.getInstance().logEvent(event, props);
    amplitude.getInstance('web').logEvent(event, props);

    const eventName = fromAmplitudeToEventName({ event, props });

    sendToMixpanel(eventName);
    sendToCircleIn(eventName);
  } catch (err) {
    console.log(err);
  }
};
