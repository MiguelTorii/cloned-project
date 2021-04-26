// @flow
import React, { memo, useEffect, useState } from 'react';
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { withResizeDetector, useResizeDetector } from 'react-resize-detector';
import * as userActions from 'actions/user'
import { Announcement } from 'types/models'
import { INTERVAL } from '../../constants/app';
import HourlyGiveawayBanner from './Components/HourlyGiveawayBanner';
import { setIntervalWithFirstCall } from '../../utils/helpers';
import CommonBanner from './Components/CommonBanner';

type Props = {
  announcement: Announcement,
  bannerHeight: number,
  setBannerHeight: Function,
  classes: Object,
  getAnnouncement: Function,
  location: { pathname: string },
  onLoaded: Function,
  height: number
};

const Banner = ({
  expertMode,
  announcement,
  getAnnouncement,
  setBannerHeight,
  location: { pathname },
  height
}: Props) => {

  useEffect(() => {
    const intervalID = setIntervalWithFirstCall(() => {
      const minute = new Date().getMinutes();

      if (announcement === undefined || minute === 1) {
        getAnnouncement();
      }

    }, 1 * INTERVAL.MINUTE);

    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    setBannerHeight({ bannerHeight: undefined === height ? 0 : height });
  }, [height]);

  if (!announcement || expertMode || pathname === '/chat') return null;

  return announcement.endDate ?
    <CommonBanner
      announcement={announcement}
    /> :
    <HourlyGiveawayBanner
      announcement={announcement} />;
}

const mapStateToProps = ({ user: { announcementData, expertMode } }): {} => ({
  announcement: announcementData,
  expertMode
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      getAnnouncement: userActions.getAnnouncement,
    },
    dispatch
  );

// Banner.whyDidYouRender= true
export default memo(connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withResizeDetector(Banner))))
