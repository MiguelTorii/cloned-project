// @flow

import createEvent from './events';
import { EventData } from '../types/models';

const CIRCLEIN_EVENT_NAMES = [
  'Chat- Send Message',
  'Chat- Send Message',
  'Video- Start Video',
  'Video- Start Video',
  'Video- Start Video',
  'Video- Session Length',
];

const toEventData = (eventName: string, props: object): EventData => {
  const [category] = eventName.split('- ');

  let objectId = '';
  const customProps = {};

  if (props.Length) customProps.duration_ms = parseInt(props.Length, 10) * 1000;

  if (category === 'Chat') objectId = props['Channel SID'];
  if (category === 'Video') objectId = props.channelName;

  return {
    ...customProps,
    category,
    objectId,
    type: category === 'Video' ? 'Ended' : 'Sent',
  }
}

export const logEventLocally = (eventData: EventData) => {
  try {
    createEvent(eventData);
  } catch (err) {
    console.log(err);
  }
}

const sendToCircleIn = (eventName: string, props: object) => {
  if (CIRCLEIN_EVENT_NAMES.includes(eventName)) {
    createEvent(toEventData(eventName, props));
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
    sendToCircleIn(event, props);
  } catch (err) {
    console.log(err);
  }
};
