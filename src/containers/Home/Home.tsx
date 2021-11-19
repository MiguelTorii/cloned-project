/* eslint-disable no-nested-ternary */

/* eslint-disable func-names */

/* eslint-disable no-sequences */

/* eslint-disable prefer-rest-params */

/* eslint-disable no-unused-expressions */
import React, { useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect } from 'react-router';
import useScript from '../../hooks/useScript';
import Classes from '../../pages/Classes/ClassesPage';
import Feed from '../../pages/Feed/FeedPage';
import AuthRedirect from '../../pages/AuthRedirect/AuthRedirectPage';
import type { State as StoreState } from '../../types/state';
import { isApiCalling } from '../../utils/helpers';
import { campaignActions } from '../../constants/action-types';

const styles = () => ({
  loading: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  campaign?: any;
  classes?: any;
  user?: any;
};

const Home = ({ campaign, classes, user }: Props) => {
  const {
    data: { userId },
    isLoading,
    expertMode
  } = user;
  const isLoadingCampaign = useSelector(isApiCalling(campaignActions.GET_CHAT_LANDING_CAMPAIGN));
  const widgetUrl = useMemo(
    () => !userId && 'https://widget.freshworks.com/widgets/67000003041.js',
    [userId]
  );
  const widgetId = useMemo(() => !userId && 67000003041, [userId]);
  const status = useScript(widgetUrl);
  useEffect(() => {
    function loadWidget() {
      if (!userId && typeof window !== 'undefined') {
        (window as any).fwSettings = {
          widget_id: widgetId,
          hideChatButton: true
        };

        if (typeof (window as any).FreshworksWidget !== 'function') {
          const n = function () {
            n.q.push(arguments);
          };
          n.q = [];
          (window as any).FreshworksWidget = n;
        }
      }
    }

    function hideWidget() {
      if (userId) {
        (window as any).FreshworksWidget('hide', 'launcher');
      } else {
        (window as any).FreshworksWidget('show', 'launcher');
      }
    }

    loadWidget();
    hideWidget();
  }, [widgetId, widgetUrl, status, userId]);

  if (isLoadingCampaign || (isLoading && !userId)) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (!userId) {
    return <AuthRedirect />;
  }

  if (expertMode) {
    return <Feed />;
  }

  if (!campaign.newClassExperience) {
    return <Feed />;
  }

  if (!campaign.landingPageCampaign) {
    return <Classes />;
  }

  if (campaign.chatLanding) {
    return <Redirect to="/chat" />;
  }

  return <Redirect to="/home" />;
};

const mapStateToProps = ({ campaign, user }: StoreState): {} => ({
  campaign,
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(withStyles(styles as any)(Home));
