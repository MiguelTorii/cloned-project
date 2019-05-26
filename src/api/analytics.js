// @flow

import amplitude from 'amplitude-js';

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
  } catch (err) {
    console.log(err);
  }
};

export const setUserProperties = ({ props }: { props: Object }) => {
  try {
    amplitude.getInstance().setUserProperties(props);
    amplitude.getInstance('web').setUserProperties(props);
  } catch (err) {
    console.log(err);
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
    amplitude.getInstance().logEvent(event, props);
    amplitude.getInstance('web').logEvent(event, props);
  } catch (err) {
    console.log(err);
  }
};
