// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ThumbnailsItem from './ThumbnailsItem';

const styles = () => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2000
  }
});

type Props = {
  classes: Object,
  participants: Array<Object>,
  isSharing: boolean,
  isSharingData: boolean,
  pinnedParticipant: ?Object,
  dataReceived: Function,
  onPin: Function
};

type State = {};

class Thumbnails extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      participants,
      isSharing,
      isSharingData,
      dataReceived,
      pinnedParticipant,
      onPin
    } = this.props;

    return (
      <div className={classes.root}>
        {participants.map(item => (
          <ThumbnailsItem
            key={item.participant.sid}
            participant={item.participant}
            isSharing={item.type === 'local' ? isSharing : false}
            isSharingData={item.type === 'local' ? isSharingData : false}
            dataReceived={dataReceived}
            isPinned={
              pinnedParticipant &&
              pinnedParticipant.sid === item.participant.sid
            }
            onPin={onPin}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Thumbnails);
