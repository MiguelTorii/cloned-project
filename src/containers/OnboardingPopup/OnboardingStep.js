// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import Typography from '@material-ui/core/Typography';
import { StudyRoomOnboardingStepData } from '../../types/models';
import withRoot from '../../withRoot';
import ActionButton from './ActionButton';
// import LoadImg from '../../components/LoadImg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    display: 'flex',
    flexDirection: 'column'
  },
  closeIcon: {
    color: 'black',
    position: 'absolute',
    right: 25,
    top: 20,
    cursor: 'pointer'
  },
  imageContainer: {
    height: 365,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(-1),
    padding: theme.spacing(4, 4, 0, 4),
    '& > img': {
      zIndex: 10,
      maxWidth: '100%',
      maxHeight: '100%'
    }
  },
  mainContainer: {
    backgroundColor: 'white',
    padding: theme.spacing(6, 5, 3, 5),
    [theme.breakpoints.down('sm')]: {
      height: 353,
      paddingTop: theme.spacing(4)
    },
    [theme.breakpoints.up('md')]: {
      height: 268,
    }
  },
  textContainer: {
    display: 'grid',
    [theme.breakpoints.down('sm')]: {
      gridTemplateRows: '60px auto',
      height: 230
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '280px auto',
      height: 140
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    '& > h3': { // Title
      margin: 0,
      color: 'black',
      fontSize: 40,
      fontWeight: 700,
      lineHeight: '50px'
    },
    '& > h4': { // Alarm text
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      background: '-webkit-linear-gradient(-90deg, #94DAF9 0%, #1E88E5 100%)',
      '-webkit-background-clip': 'text',
      textFillColor: 'transparent'
    },
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      '& > h3': {
        fontSize: 30
      },
      '& > h4': {
        fontSize: 16
      }
    }
  },
  text: {
    '& > p': {
      margin: 0,
      color: 'black',
      fontSize: 16,
      lineHeight: '28px'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3)
    },
    [theme.breakpoints.up('md')]: {
      flexGrow: 1,
      marginLeft: 0
    }
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2)
    }
  },
  ellipseContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  }
}));

type Props = {
  data: StudyRoomOnboardingStepData,
  step: number,
  totalSteps: number,
  onAction: Function,
  onClose: Function
};

const OnboardingStep = ({ data, step, totalSteps, onAction, onClose }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CloseIcon
        className={classes.closeIcon}
        onClick={onClose}
      />
      <div className={classes.imageContainer}>
        <img src={data.imageUrl} alt="Study Room Onboarding" />
      </div>
      <div className={classes.mainContainer}>
        <div className={classes.textContainer}>
          <div className={classes.title}>
            <Typography component="h4">
              NEW!
            </Typography>
            <Typography component="h3">
              { data.title }
            </Typography>
          </div>
          <div className={classes.text}>
            <Typography component="p">
              { data.text }
            </Typography>
          </div>
        </div>
        <div className={classes.actionContainer}>
          <ActionButton onClick={() => onAction()}>
            { data.actionText }
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default withRoot(OnboardingStep);
