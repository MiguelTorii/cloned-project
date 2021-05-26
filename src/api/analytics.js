// @flow

import createEvent from './events';
import { EventData } from '../types/models';
import { LOG_EVENT_CATEGORIES } from 'constants/common';

const CIRCLEIN_EVENT_NAMES = [
  'Chat- Send Message',
  'Chat- Send Message',
  'Video- Start Video',
  'Video- Start Video',
  'Video- End Video',
  'Video- Session Length',
  'Post- Send Time Log',
  'FlashCard- Send Time Log'
];

const toEventData = (eventName: string, props: object): EventData => {
  const [category] = eventName.split('- ');

  let objectId = '';
  const customProps = {};

  if (props.Length) customProps.duration_ms = parseInt(props.Length, 10) * 1000;

  if (category === LOG_EVENT_CATEGORIES.CHAT) {
    objectId = props['Channel SID'];
    customProps.type = 'Sent'
  }
  if (category === LOG_EVENT_CATEGORIES.VIDEO) {
    objectId = props.channelName;
    customProps.type = props.type
    customProps.start_time = props.start_time
    customProps.end_time = props.end_time
  }
  if (category === LOG_EVENT_CATEGORIES.POST
    || category === LOG_EVENT_CATEGORIES.FLASHCARD) {
    customProps.type = props.type
    customProps.feedId = props.feedId
    customProps.flashcardId = props.flashcardId
    customProps.cardId = props.cardId
    customProps.elapsed = props.elapsed
    customProps.total_idle_time = props.total_idle_time
    customProps.effective_time = props.effective_time
    customProps.platform = props.platform
  }

  return {
    ...customProps,
    category,
    objectId,
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
