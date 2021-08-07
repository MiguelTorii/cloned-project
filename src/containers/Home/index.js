/* eslint-disable no-nested-ternary */
/* eslint-disable func-names */
/* eslint-disable no-sequences */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-unused-expressions */
// @flow
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import useScript from 'hooks/useScript';
import Classes from 'pages/Classes';
import Feed from 'pages/Feed';
import AuthRedirect from 'pages/AuthRedirect';
import HomePage from 'pages/Home';
import Workflow from 'pages/Workflow';
import type { State as StoreState } from '../../types/state';

const styles = () => ({
  loading: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Home = ({ campaign, classes, user }) => {
  const {
    data: { userId },
    isLoading,
    expertMode
  } = user;

  const widgetUrl = useMemo(
    () => !userId && 'https://widget.freshworks.com/widgets/67000003041.js',
    [userId]
  );

  const widgetId = useMemo(() => !userId && 67000003041, [userId]);

  const status = useScript(widgetUrl);

  useEffect(() => {
    async function loadWidget() {
      if (!userId && typeof window !== 'undefined') {
        window.fwSettings = {
          widget_id: widgetId,
          hideChatButton: true
        };

        !(function () {
          if (typeof window.FreshworksWidget !== 'function') {
            const n = function () {
              n.q.push(arguments);
            };
            (n.q = []), (window.FreshworksWidget = n);
          }
        })();
      }
    }

    async function hideWidget() {
      if (userId) window.FreshworksWidget('hide', 'launcher');
      else window.FreshworksWidget('show', 'launcher');
    }

    loadWidget();
    hideWidget();
  }, [widgetId, widgetUrl, status, userId]);

  if (isLoading && !userId)
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );

  if (!userId) return <AuthRedirect />;
  if (!campaign.newClassExperience) return <Feed />;
  if (!campaign.landingPageCampaign) return <Classes />;

  if (expertMode) return <Workflow />;
  return  <HomePage />;
};

const mapStateToProps = ({ campaign, user }: StoreState): {} => ({
  campaign,
  user
});

export default connect(mapStateToProps, null)(withStyles(styles)(Home));
