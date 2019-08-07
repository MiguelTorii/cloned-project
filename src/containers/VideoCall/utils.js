import Video from 'twilio-video';
import update from 'immutability-helper';

const getDevicesOfKind = (deviceInfos, kind) => {
  return deviceInfos.filter(deviceInfo => {
    return deviceInfo.kind === kind;
  });
};

const switchLocalTracks = (room, track) => {
  room.localParticipant.tracks.forEach(trackPublication => {
    if (trackPublication.kind === track.kind) {
      trackPublication.track.stop();
      room.localParticipant.unpublishTrack(trackPublication.track);
    }
  });
  room.localParticipant.publishTrack(track);
};

export const getDeviceSelectionOptions = () => {
  return navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
    const kinds = ['audioinput', 'audiooutput', 'videoinput'];
    return kinds.reduce((deviceSelectionOptions, kind) => {
      // eslint-disable-next-line no-param-reassign
      deviceSelectionOptions[kind] = getDevicesOfKind(deviceInfos, kind);
      return deviceSelectionOptions;
    }, {});
  });
};

export const applyVideoInputDeviceSelection = (deviceId, video, room) => {
  return Video.createLocalVideoTrack({
    deviceId: {
      exact: deviceId
    }
  })
    .then(localTrack => {
      localTrack.attach(video);
      if (room) {
        switchLocalTracks(room, localTrack);
      }
      return localTrack;
    })
    .catch(err => {
      console.log('applyVideoInputDeviceSelection failed:', err);
      throw err;
    });
};

export const applyAudioInputDeviceSelection = (deviceId, audio, room) => {
  return Video.createLocalAudioTrack({
    deviceId: {
      exact: deviceId // NOTE: on ios safari - it respects the deviceId only if its exact.
    }
  })
    .then(localTrack => {
      localTrack.attach(audio);
      if (room) {
        switchLocalTracks(room, localTrack);
      }
      return localTrack;
    })
    .catch(err => {
      console.log('applyAudioInputDeviceSelection failed:', err);
      throw err;
    });
};

export const applyAudioOutputDeviceSelection = (deviceId, audio) => {
  return typeof audio.setSinkId === 'function'
    ? audio.setSinkId(deviceId)
    : Promise.reject(
        new Error(
          'This browser does not support setting an audio output device'
        )
      );
};

export const detachTrack = track => {
  //   track.detach().forEach(detachedElement => {
  //     detachedElement.remove();
  //   });
  track.detach();
  track.stop();
};

export const addParticipant = (state, participant, track, local = false) => {
  return update(state, {
    participants: {
      $apply: b => {
        const index = b.findIndex(
          item => item.participant.sid === participant.sid
        );
        if (index === -1) {
          return [
            ...b,
            {
              type: 'remote',
              participant,
              video: track && track.kind === 'video' ? [track] : [],
              audio: track && track.kind === 'audio' ? [track] : [],
              data: track && track.kind === 'data' ? [track] : []
            }
          ];
        }
        if (index > -1 && track) {
          return update(b, {
            [index]: {
              [track.kind]: {
                $apply: t => {
                  const trackIndex = t.findIndex(item =>
                    local ? item.id === track.id : item.sid === track.sid
                  );
                  if (trackIndex === -1) {
                    return [...t, track];
                  }
                  return t;
                }
              }
            }
          });
        }
        return b;
      }
    }
  });
};

export const removeParticipant = (state, participant) => {
  return update(state, {
    participants: {
      $apply: b => {
        const index = b.findIndex(
          item => item.participant.sid === participant.sid
        );
        if (index > -1) {
          return update(b, { $splice: [[index, 1]] });
        }
        return b;
      }
    }
  });
};

export const removeTrack = (state, participant, track, local = false) => {
  return update(state, {
    participants: {
      $apply: b => {
        const index = b.findIndex(
          item => item.participant.sid === participant.sid
        );
        if (index > -1) {
          return update(b, {
            [index]: {
              [track.kind]: {
                $apply: t => {
                  const trackIndex = t.findIndex(item =>
                    local ? item.id === track.id : item.sid === track.sid
                  );
                  if (trackIndex > -1) {
                    return update(t, { $splice: [[trackIndex, 1]] });
                  }
                  return t;
                }
              }
            }
          });
        }
        return b;
      }
    }
  });
};

export const addProfile = (
  state,
  { userId, firstName, lastName, userProfileUrl }
) => {
  return update(state, {
    profiles: {
      $apply: b => {
        return { ...b, [userId]: { firstName, lastName, userProfileUrl } };
      }
    }
  });
};
