// @flow

import amplitude from 'amplitude-js';
import mixpanel from 'mixpanel-browser';
import createEvent from './events';
import { EventData } from '../types/models';

const MIXPANEL_EVENTS = [
  'Feed - Start Search',
  'Feed- Open Filter',
  'Onboarding- First Onboarding Opened',
  'Onboarding- Started',
  'Onboarding- Ended',
  'Flashcard- Created',
  'Flashcard- Rated',
  'Home- Start Ask Question',
  'Home- Start Share Link',
  'Home- Start Ask Question',
  'Join Class- Opened',
  'Referral- Copied',
  'Referral- Opened',
  'User - View Chat Room',
  'User- Submitted Class Form',
  'User- Generated Link',
  'User- Opened Generated Link',
  'Chat- Send Message-Text',
  'Chat- Send Message-Image',
  'Video- Start Video-Chat',
  'Video- Start Video-Profile',
  'Video- Start Video-Video',
  'Video- Session Length',
];

const CIRCLEIN_EVENTS = [
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

export const logEventLocally = (eventData: EventData) => {
  try {
    createEvent(eventData);
  } catch (err) {
    console.log(err);
  }
}

const fromAmplitudeEvent = ({ event, props}) => {
  let eventName = event;

  if (props && props.Content) {
    eventName += `-${props.Content}`;
  } else if (props && props['Initiated From']) {
    eventName += `-${props['Initiated From']}`;
  }

  return eventName;
}

const sendToMixpanel = ({ event, props }) => {
  const eventName = fromAmplitudeEvent({ event, props });

  if (MIXPANEL_EVENTS.includes(eventName)) {
    mixpanel.track(eventName);
  }
}

const sendToCircleIn = ({ event, props }) => {
  const eventName = fromAmplitudeEvent({ event, props });

  if (CIRCLEIN_EVENTS.includes(eventName)) {
    const [category, type] = eventName.split('- ');
    const eventData = { category, type, objectId: '' };
    logEventLocally(eventData);
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
    sendToMixpanel({event, props});
    sendToCircleIn({ event, props });
  } catch (err) {
    console.log(err);
  }
};
