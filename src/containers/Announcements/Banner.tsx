import React, { memo, useEffect } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withResizeDetector } from 'react-resize-detector';
import * as userActions from '../../actions/user';
import { Announcement } from '../../types/models';
import { INTERVAL } from '../../constants/app';
import HourlyGiveawayBanner from './Components/HourlyGiveawayBanner/HourlyGiveawayBanner';
import { setIntervalWithFirstCall } from '../../utils/helpers';
import CommonBanner from './Components/CommonBanner';
import type { State as StoreState } from '../../types/state';

type Props = {
  announcement?: Announcement;
  getAnnouncement?: (...args: Array<any>) => any;
  setBannerHeight?: any;
  height?: number;
  bannerHeight?: number;
  expertMode?: any;
  onLoaded?: any;
};

const Banner = ({
  expertMode,
  announcement,
  getAnnouncement,
  setBannerHeight,
  onLoaded,
  height,
  bannerHeight
}: Props) => {
  useEffect(() => {
    const intervalID = setIntervalWithFirstCall(() => {
      if (announcement === undefined) {
        getAnnouncement();
      }
    }, 1 * INTERVAL.MINUTE);
    return () => clearInterval(intervalID);
  }, [announcement, getAnnouncement]);
  useEffect(() => {
    setBannerHeight({
      bannerHeight: undefined === height ? 0 : height
    });
  }, [height, setBannerHeight]);

  if (!announcement || expertMode) {
    return null;
  }

  return announcement.endDate ? (
    <CommonBanner announcement={announcement} />
  ) : (
    <HourlyGiveawayBanner announcement={announcement} />
  );
};

const mapStateToProps = ({ user: { announcementData, expertMode } }: StoreState): {} => ({
  announcement: announcementData,
  expertMode
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      getAnnouncement: userActions.getAnnouncement
    },
    dispatch
  ); // Banner.whyDidYouRender= true

export default memo(
  connect<{}, {}, Props>(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(withResizeDetector(Banner)))
);