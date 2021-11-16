import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  controlPanelGrid: {
    display: 'grid',
    gridTemplateColumns: '60px 60px 60px 1fr 320px 60px',
    gridTemplateRows: '60px 60px',
    overflow: 'hidden'
  },
  chatNavigation: {
    gridColumn: 1,
    gridRow: '1 / -1',
    overflow: 'hidden'
  },
  storyAvatar: {
    gridColumn: '2 / 4',
    gridRow: '1 / -1',
    overflow: 'hidden',
    zIndex: 2
  },
  storyMessage: {
    gridColumn: 4,
    gridRow: 1,
    overflow: 'hidden',
    zIndex: 2,
    marginTop: theme.spacing(2)
  },
  storyMessageBackground: {
    gridColumn: '3 / 5',
    gridRow: 1,
    overflow: 'hidden',
    backgroundColor: theme.circleIn.palette.gray3,
    opacity: 0.7,
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    marginBottom: -theme.spacing(1)
  },
  experienceBar: {
    gridColumn: 4,
    gridRow: 2,
    overflow: 'hidden',
    marginTop: theme.spacing(2)
  },
  mainNavigation: {
    gridColumn: 5,
    gridRow: '1 / -1',
    overflow: 'hidden'
  },
  missionNavigation: {
    gridColumn: 6,
    gridRow: '1 / -1',
    overflow: 'hidden'
  }
}));
