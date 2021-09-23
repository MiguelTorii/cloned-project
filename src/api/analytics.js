// @flow

import {
  LOG_EVENT_CATEGORIES,
  CIRCLEIN_EVENT_NAMES,
  EVENT_TYPES
} from 'constants/app';
import createEvent from './events';
import { EventData } from '../types/models';

const toEventData = (eventName: string, props: object): EventData => {
  const [category, eventType] = eventName.split('- ');

  let objectId = '';
  const customProps = {};

  if (props.Length) { customProps.duration_ms = parseInt(props.Length, 10) * 1000; }

  if (category === LOG_EVENT_CATEGORIES.CHAT) {
    objectId = props['Channel SID'];
    customProps.type = 'Sent';
  }
  if (category === LOG_EVENT_CATEGORIES.VIDEO) {
    objectId = props.channelName;
    customProps.type = props.type;
    customProps.start_time = props.start_time;
    customProps.end_time = props.end_time;
  }

  // Data Metrics
  if (eventType === EVENT_TYPES.VIEWED || eventType === EVENT_TYPES.EXITED) {
    customProps.type = eventType;
    customProps.elapsed = props.elapsed;
    customProps.total_idle_time = props.total_idle_time;
    customProps.effective_time = props.effective_time;
    customProps.platform = props.platform;
  }

  // Post item data metrics
  if (category === LOG_EVENT_CATEGORIES.POST) {
    customProps.feed_id = props.feed_id;
  }

  // Flashcard data metrics
  if (category === LOG_EVENT_CATEGORIES.FLASHCARD) {
    customProps.flashcard_id = props.flashcard_id;
    customProps.card_id = props.card_id;
  }

  // Flashcard individual item time spent
  if (category === LOG_EVENT_CATEGORIES.FLASHCARD_REVIEW) {
    customProps.flashcard_id = props.flashcard_id;
  }

  // Flashcard Quiz time spent
  if (category === LOG_EVENT_CATEGORIES.FLASHCARD_QUIZ) {
    customProps.flashcard_id = props.flashcard_id;
  }

  // In-App notes time spent
  if (category === LOG_EVENT_CATEGORIES.IN_APP_NOTES) {
    customProps.note_id = props.note_id;
    customProps.classId = props.classId;
    customProps.sectionId = props.sectionId;
  }

  return {
    ...customProps,
    category,
    objectId
  };
};

export const logEventLocally = (eventData: EventData) => {
  try {
    createEvent(eventData);
  } catch (err) {
    console.log(err);
  }
};

const sendToCircleIn = (eventName: string, props: object) => {
  if (CIRCLEIN_EVENT_NAMES.includes(eventName)) {
    createEvent(toEventData(eventName, props));
  }
};

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
