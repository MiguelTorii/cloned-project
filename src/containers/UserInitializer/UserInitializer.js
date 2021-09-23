/* eslint-disable valid-typeof */
/* eslint-disable no-sequences */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
// @flow

import React, { useState, useEffect, useCallback } from 'react';
import amplitude from 'amplitude-js';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { hotjar } from 'react-hotjar';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import useScript from 'hooks/useScript';
import { AMPLITUDE_IDS, ENV, HOTJAR_ID, HOTJAR_SV } from 'constants/app';
import {
  LOGGED_IN_WIDGET_ID,
  LOGGED_OUT_WIDGET_ID,
  LOGGED_IN_WIDGET_URL,
  LOGGED_OUT_WIDGET_URL
} from './constants';
import withRoot from '../../withRoot';
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import OnboardingPopup from '../OnboardingPopup/OnboardingPopup';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import { grades } from '../../constants/clients';
import { updateProfile as updateUserProfile } from '../../api/user';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user';
import * as userActions from '../../actions/user';
import * as signInActions from '../../actions/sign-in';
import {
  getChatLandingCampaign,
  getFlashcardsCampaign,
  getLeaderboardAndSupportCenterVisibilityCampaign
} from '../../actions/campaign';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  dialog: {
    ...dialogStyle
  },
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

const Props = {
  classes: Object,
  user: Object,
  campaign: Object,
  checkUserSession: Function,
  confirmTooltip: Function,
  updateOnboarding: Function
};

const UserInitializer = ({
  classes,
  user,
  campaign,
  checkUserSession,
  confirmTooltip,
  updateOnboarding
}: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    email: ''
  });
  const [widgetUrl, setWidgetUrl] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [onboardingPopupOpen, setOnboardingPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const viewedOnboarding = useSelector(
    (state) => state.user.syncData.viewedOnboarding
  );
  const chatLanding = useSelector((state) => state.campaign.chatLanding);

  // Check to show onboarding popup or not.
  // This got complex after chat landing campaign. (5 seconds delay)
  useEffect(() => {
    let timeoutId = null;

    if (viewedOnboarding) { setOnboardingPopupOpen(false); } else if (viewedOnboarding === false) {
      if (!chatLanding) { setOnboardingPopupOpen(true); } else {
        // Since it is delayed 5 seconds, it shows up after 6 seconds to make it natural.
        timeoutId = setTimeout(() => {
          setOnboardingPopupOpen(true);
        }, 6000);
      }
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [chatLanding, viewedOnboarding]);

  const {
    data: { userId, schoolId, school, email, firstName }
  } = user;

  useEffect(() => {
    async function loadStyle() {
      await import('./custom-widget.css');
    }

    if (userId) { loadStyle(); }
  }, [userId]);
  useEffect(() => {
    setWidgetUrl(userId ? LOGGED_IN_WIDGET_URL : LOGGED_OUT_WIDGET_URL);
  }, [userId]);

  const status = useScript(widgetUrl);

  useEffect(() => {
    const oldScript = document.querySelector(
      `script[src="${userId ? LOGGED_OUT_WIDGET_URL : LOGGED_IN_WIDGET_URL}"]`
    );
    if (oldScript) { oldScript.remove(); }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      AMPLITUDE_IDS.forEach((id) => {
        amplitude.getInstance().init(id, null, { batchEvents: true });
        amplitude
          .getInstance('student-application')
          .init(id, null, { includeReferrer: true });
        amplitude.getInstance('student-application').setUserId(userId);
        amplitude.getInstance('student-application').logEvent('Init');
      });

      if (ENV !== 'dev') {
        hotjar.initialize(HOTJAR_ID, HOTJAR_SV);
        window.hj('identify', userId, {
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
      window.fwSettings = {
        widget_id: userId ? LOGGED_IN_WIDGET_ID : LOGGED_OUT_WIDGET_ID,
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

    if (!userId) { window.FreshworksWidget('show', 'launcher'); }
  }, [userId, status]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (userId) { window.FreshworksWidget('hide', 'launcher'); }
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  const updateDimensions = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const handleCheckUpdate = useCallback(() => {
    const {
      data: { updateProfile }
    } = user;
    if (updateProfile.length > 0) { setOpen(true); }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkUserSession();
      if (loggedIn) {
        if (userId !== '') { handleCheckUpdate(); }
      }

      window.addEventListener('resize', updateDimensions);
    };

    init();
    return () => window.removeEventListener('resize', updateDimensions);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userId !== '') { handleCheckUpdate(); }
  }, [handleCheckUpdate, userId]);

  useEffect(() => {
    if (userId !== '') {
      dispatch(getFlashcardsCampaign());
      dispatch(getChatLandingCampaign());
      dispatch(getLeaderboardAndSupportCenterVisibilityCampaign());
    }
  }, [dispatch, userId]);

  const handleChange = (name) => (event) => {
    setCurrentUser({
      ...currentUser,
      [name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: { updateProfile }
      } = user;
      const fields = [];
      for (const profileItem of updateProfile) {
        const item = { field: profileItem.field, updated_value: '' };

        switch (profileItem.field) {
          case 'first_name':
            item.updated_value = currentUser.firstName;
            break;
          case 'last_name':
            item.updated_value = currentUser.lastName;
            break;
          case 'grade':
            item.updated_value = currentUser.grade.toString();
            break;
          case 'email':
            item.updated_value = currentUser.email;
            break;
          default:
            item.updated_value = '';
            break;
        }
        fields.push(item);
      }
      await updateUserProfile({ userId, fields });
      await checkUserSession();

      setOpen(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const {
    data: { updateProfile, segment }
  } = user;

  if (userId === '' || campaign.landingPageCampaign === null) { return null; }

  const renderForm = () => (
    <>
      {updateProfile.map(({ field }) => {
        switch (field) {
          case 'first_name':
            return (
              <TextValidator
                key={field}
                label="First Name"
                margin="normal"
                variant="outlined"
                onChange={handleChange('firstName')}
                name="firstName"
                autoComplete="firstName"
                autoFocus
                fullWidth
                value={currentUser.firstName}
                disabled={loading}
                validators={['required']}
                errorMessages={['first name is required']}
              />
            );
          case 'last_name':
            return (
              <TextValidator
                key={field}
                label="Last Name"
                margin="normal"
                variant="outlined"
                onChange={handleChange('lastName')}
                name="lastName"
                autoComplete="lastName"
                autoFocus
                fullWidth
                value={currentUser.lastName}
                disabled={loading}
                validators={['required']}
                errorMessages={['last name is required']}
              />
            );
          case 'grade':
            return (
              <SelectValidator
                key={field}
                value={currentUser.grade}
                fullWidth
                name="grade"
                label="Year"
                onChange={handleChange('grade')}
                variant="outlined"
                margin="normal"
                disabled={loading}
                validators={['required']}
                errorMessages={['Year is required']}
              >
                <MenuItem value="" />
                {(grades[segment] || []).map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </SelectValidator>
            );
          case 'email':
            return (
              <TextValidator
                key={field}
                label="Email"
                margin="normal"
                variant="outlined"
                onChange={handleChange('email')}
                name="email"
                autoComplete="email"
                autoFocus
                fullWidth
                value={currentUser.email}
                disabled={loading}
                validators={['required', 'isEmail']}
                errorMessages={['email is required', 'email is not valid']}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );

  return (
    <ErrorBoundary>
      <Dialog
        open={open}
        disableEscapeKeyDown
        okTitle="Update"
        onOk={handleSubmit}
        showActions
        title="Update Profile"
      >
        <div className={classes.dialog}>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
          <ValidatorForm
            instantValidate
            onSubmit={handleSubmit}
            className={classes.form}
          >
            {renderForm}
          </ValidatorForm>
        </div>
      </Dialog>
      {windowWidth > 640 && (
        <OnboardingPopup
          open={onboardingPopupOpen}
          updateOnboarding={updateOnboarding}
          userId={userId}
        />
      )}
    </ErrorBoundary>
  );
};

const mapStateToProps = ({ user, campaign }: StoreState): {} => ({
  user,
  campaign
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      checkUserSession: signInActions.checkUserSession,
      updateOnboarding: userActions.updateOnboarding,
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(UserInitializer)));
