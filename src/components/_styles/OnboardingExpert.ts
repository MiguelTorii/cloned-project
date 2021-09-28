import backgroundImg from '../../assets/img/onboarding-background.png';
import { dialogStyle } from './Dialog';

const centered = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center'
};
export const styles = (theme) => ({
  actionPanel: {
    flex: 2,
    flexDirection: 'column',
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(4),
    ...centered
  },
  button: {
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    borderRadius: 8,
    color: theme.circleIn.palette.primaryText1,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1 / 2, 2),
    width: 200
  },
  demoPanel: {
    borderRadius: 8,
    background: `url(${backgroundImg})`,
    flex: 3,
    ...centered
  },
  dialog: {
    ...dialogStyle,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    zIndex: 1300,
    height: 700
  },
  step: {
    display: 'flex',
    height: '100%'
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: 400,
    position: 'absolute',
    bottom: 20
  },
  stepDisabled: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.circleIn.palette.disabled
  },
  stepEnabled: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#c7d3da'
  },
  stepsContainer: {
    width: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between'
  }
});
