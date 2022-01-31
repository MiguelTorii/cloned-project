/* eslint-disable valid-typeof */

/* eslint-disable no-sequences */

/* eslint-disable prefer-rest-params */

/* eslint-disable no-unused-expressions */

/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useCallback } from 'react';
import amplitude from 'amplitude-js';
import { hotjar } from 'react-hotjar';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import useScript from '../../hooks/useScript';
import { AMPLITUDE_IDS, ENV, HOTJAR_ID, HOTJAR_SV } from '../../constants/app';
import {
  LOGGED_IN_WIDGET_ID,
  LOGGED_OUT_WIDGET_ID,
  LOGGED_IN_WIDGET_URL,
  LOGGED_OUT_WIDGET_URL
} from './constants';
import withRoot from '../../withRoot';
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user';
import * as userActions from '../../actions/user';
import * as signInActions from '../../actions/sign-in';
import {
  getChatLandingCampaign,
  getHudCampaign,
  getLeaderboardAndSupportCenterVisibilityCampaign
} from '../../actions/campaign';
import useHudRoutes from '../../hud/frame/useHudRoutes';
import { CampaignState } from '../../reducers/campaign';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  dialog: { ...dialogStyle },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

type Props = {
  classes?: any;
  user?: any;
  campaign?: any;
  checkUserSession?: Function;
  confirmTooltip?: Function;
};

const UserInitializer = ({ user, checkUserSession }: Props) => {
  const [widgetUrl, setWidgetUrl] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();

  useHudRoutes();

  const {
    data: { userId, schoolId, school, email, firstName }
  } = user;
  useEffect(() => {
    async function loadStyle() {
      await import('./custom-widget.css');
    }

    if (userId) {
      loadStyle();
    }
  }, [userId]);
  useEffect(() => {
    setWidgetUrl(userId ? LOGGED_IN_WIDGET_URL : LOGGED_OUT_WIDGET_URL);
  }, [userId]);
  const status = useScript(widgetUrl);
  useEffect(() => {
    const oldScript = document.querySelector(
      `script[src="${userId ? LOGGED_OUT_WIDGET_URL : LOGGED_IN_WIDGET_URL}"]`
    );

    if (oldScript) {
      oldScript.remove();
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      AMPLITUDE_IDS.forEach((id) => {
        amplitude.getInstance().init(id, null, {
          batchEvents: true
        });
        amplitude.getInstance('student-application').init(id, null, {
          includeReferrer: true
        });
        amplitude.getInstance('student-application').setUserId(userId);
        amplitude.getInstance('student-application').logEvent('Init');
      });

      if (ENV !== 'dev') {
        hotjar.initialize(HOTJAR_ID, HOTJAR_SV);
        (window as any).hj('identify', userId, {
          user_id: userId,
          school_id: schoolId,
          school,
          email,
          first_name: firstName
        });
      }
    }
  }, [userId, schoolId, school, email, firstName]);
  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).fwSettings = {
        widget_id: userId ? LOGGED_IN_WIDGET_ID : LOGGED_OUT_WIDGET_ID,
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

    if (!userId) {
      (window as any).FreshworksWidget('show', 'launcher');
    }
  }, [userId, status]);

  const updateDimensions = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkUserSession();

      window.addEventListener('resize', updateDimensions);
    };

    init();
    return () => window.removeEventListener('resize', updateDimensions); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userId !== '') {
      dispatch(getChatLandingCampaign());
      dispatch(getHudCampaign());
      dispatch(getLeaderboardAndSupportCenterVisibilityCampaign());
    }
  }, [dispatch, userId]);

  return <></>;
};

const mapStateToProps = ({ user, campaign }: StoreState): {} => ({
  user,
  campaign
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      checkUserSession: signInActions.checkUserSession,
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles as any)(UserInitializer)));
