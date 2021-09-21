import get from 'lodash/get';

export default (theme) => {
  const greenRingColor = theme.circleIn.palette.onlineBadgetColor;
  const grayRingColor = '#5F6165';

  return {
    root: {
      position: 'relative',
      display: 'inline-flex'
    },
    badge: {
      position: 'absolute',
      bottom: ({ fromChat }) => (fromChat ? 0 : 15),
      right: ({ fromChat }) => (fromChat ? 0 : 15),
      width: ({ fromChat }) => (fromChat ? 11 : 24),
      height: ({ fromChat }) => (fromChat ? 11 : 24),
      boxShadow: (props) =>
        `${get(theme, props.bgColorPath)} 0 0 0 ${props.fromChat ? 3 : 7}px`,
      borderRadius: '50%',
      backgroundColor: (props) =>
        (props.isOnline ? greenRingColor : get(theme, props.bgColorPath)),
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: (props) =>
          `${props.fromChat ? 3 : 8.5}px solid ${
            props.isOnline ? greenRingColor : grayRingColor
          }`,
        content: '""'
      }
    }
  };
};
