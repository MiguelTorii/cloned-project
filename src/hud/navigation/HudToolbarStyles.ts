import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  toolButton: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    },
    borderRadius: 0
  },
  toolButtonCompact: {
    width: '56px',
    height: '56px',
    minWidth: '56px',
    minHeight: '56px',
    padding: 0,
    borderRadius: '50%'
  },
  textIconButton: {
    width: '44px',
    height: '44px',
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  verticalToolbar: {
    display: 'flex',
    flexDirection: 'column'
  },
  horizontalToolbar: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  selectedButton: {
    backgroundColor: theme.circleIn.palette.gray2
  },
  highlightedButton: {
    animation: '$storyCirclePulse 2s infinite',
    zIndex: 2,
    '&:hover': {
      background: theme.circleIn.palette.navigationHighlightOpaque
    }
  },
  '@keyframes storyCirclePulse': {
    '0%': {
      transform: `scale(0.95)`,
      boxShadow: `0 0 0 0 ${theme.circleIn.palette.navigationHighlightTranslucent}`
    },
    '70%': {
      transform: `scale(1)`,
      boxShadow: `0 0 0 10px ${theme.circleIn.palette.navigationHighlightOpaque}`
    },
    '100%': {
      transform: `scale(.95)`,
      boxShadow: `0 0 0 0 ${theme.circleIn.palette.navigationHighlightTranslucent}`
    }
  },
  tooltip: {
    fontSize: 12
  }
}));
