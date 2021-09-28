/* eslint-disable jsx-a11y/accessible-emoji */
import React, { memo, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import LoadImg from 'components/LoadImg/LoadImg';
import learnGif from 'assets/gif/reading-education-career.gif';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';

const WalkThrough = ({ setScreen, school }) => {
  const centered = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      ...centered,
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'white',
      flexDirection: 'column',
      position: 'relative',
      color: 'black'
    },
    arrowBack: {
      position: 'absolute',
      top: 30,
      left: 40
    },
    iconColor: {
      color: 'black'
    },
    container: {
      maxWidth: 700
    },
    mobileContainer: {
      maxWidth: 270
    },
    flexView: {
      ...centered,
      width: '100%'
    },
    walkthroughText: {
      fontWeight: 700
    },
    my3: {
      margin: theme.spacing(3, 0)
    },
    nextStep: {
      backgroundImage: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)',
      color: 'white',
      borderRadius: 100,
      margin: theme.spacing(3, 0)
    },
    buttonLabel: {
      fontWeight: 700,
      textTransform: 'none'
    },
    learnGif: {
      width: 200
    },
    mobileLearnGif: {
      width: 150
    }
  }));

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const classes = useStyles();

  useEffect(() => {
    const handleWindowResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const goBack = useCallback(() => {
    setScreen('school');
  }, [setScreen]);

  const goNext = useCallback(() => {
    const responseType = 'code';
    const origin = `${window.location.origin}/oauth`;
    const obj = {
      uri: school.uri,
      lms_type_id: school.lmsTypeId,
      response_type: responseType,
      client_id: school.clientId,
      redirect_uri: origin
    };

    const buff = Buffer.from(JSON.stringify(obj)).toString('hex');

    let uri = `${school.authUri}?client_id=${school.clientId}&response_type=${responseType}&redirect_uri=${origin}&state=${buff}`;

    if (school.scope) {
      uri = `${uri}&scope=${school.scope}`;
    }

    window.location.replace(uri);
  }, [school]);

  const renderWebView = () => (
    <div className={classes.container}>
      <div className={classes.flexView}>
        <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
      </div>
      <Typography variant="body1" className={classes.walkthroughText}>
        Hi friend! 👋🏽 We can’t wait for you to login to CircleIn - the all-in-one studying app!{' '}
        <br />
        Sit tight, we’re taking you to your school’s learning managment system
      </Typography>

      <ol className={classes.walkthroughText}>
        <li>
          <Typography variant="body1" className={classes.walkthroughText}>
            Login there first
          </Typography>
        </li>
        <li>
          <Typography variant="body1" className={classes.walkthroughText}>
            Click on your class
          </Typography>
        </li>
        <li>
          <Typography variant="body1" className={classes.walkthroughText}>
            Click the CircleIn link in your side panel and join us from there! 🚀
          </Typography>
        </li>
      </ol>

      <Typography variant="body1" className={classes.walkthroughText}>
        We’re excited to see what amazing things you learn and give to your new studying community.
      </Typography>
      <div className={classes.flexView}>
        <Button
          variant="contained"
          className={classes.nextStep}
          classes={{ label: classes.buttonLabel }}
          onClick={goNext}
        >
          Let’s do this! 🔥
        </Button>
      </div>
      <div className={classes.flexView}>
        <LoadImg url={learnGif} className={classes.learnGif} />
      </div>
    </div>
  );

  const mobileView = () => (
    <div className={classes.mobileContainer}>
      <div className={classes.flexView}>
        <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
      </div>
      <Typography variant="body2">
        Hi friend! 👋🏽 We can’t wait for you to login to CircleIn - the all-in-one studying app!
      </Typography>

      <Typography variant="body2" className={classes.my3}>
        Here’s how to get started:
      </Typography>

      <ol className={classes.my3}>
        <li>
          <Typography variant="body2">Search for and select your school</Typography>
        </li>
        <li>
          <Typography variant="body2">
            A pop-up asking to sign-in using <b>auth0.com</b> will appear. Don’t worry! This is just
            a security message. Tap Continue.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            We’ll take you to your school’s learning management system
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Simply sign in, and then we’ll bring you back to CircleIn! 🚀
          </Typography>
        </li>
      </ol>

      <Typography variant="body2">
        All your classes will be loaded up and ready for you. We’re excited to see what amazing
        things you learn and give to your new studying community.
      </Typography>
      <div className={classes.flexView}>
        <Button
          variant="contained"
          className={classes.nextStep}
          classes={{ label: classes.buttonLabel }}
          onClick={goNext}
        >
          Let’s do this! 🔥
        </Button>
      </div>
      <div className={classes.flexView}>
        <LoadImg url={learnGif} className={classes.mobileLearnGif} />
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <IconButton aria-label="back" className={classes.arrowBack} onClick={goBack}>
        <ArrowBackIosRoundedIcon className={classes.iconColor} />
      </IconButton>
      {windowWidth > 768 ? renderWebView() : mobileView()}
    </div>
  );
};

export default memo(WalkThrough);
