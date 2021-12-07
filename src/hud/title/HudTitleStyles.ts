import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  titleAndStoryContainer: {
    display: 'grid',
    gridTemplateColumns: '35px 35px 1fr 35px 35px',
    gridTemplateRows: '4px 31px 20px 15px 20px',
    overflow: 'hidden',
    flexGrow: 0,
    flexShrink: 0,
    padding: theme.spacing(1, 4, 0, 4),
    maxWidth: '800px',
    width: '100%'
  },
  storyAvatar: {
    gridColumn: '1 / 3',
    zIndex: 2,
    gridRow: '1 / -2',
    height: '100%',
    width: '100%',
    justifySelf: 'right'
  },
  currentStatement: {
    gridColumn: '2 / -1',
    gridRow: '2 / -3',
    overflow: 'auto'
  },
  smallTitle: {
    overflow: 'hidden',
    width: '100%',
    gridColumn: '3',
    gridRow: '4 / -1',
    fontWeight: 700,
    fontSize: 24,
    display: 'grid',
    justifyContent: 'center'
  },
  largeTitleContainer: {
    gridColumn: '1 / -1',
    gridRow: '1 / -1',
    paddingTop: theme.spacing(4),
    overflow: 'hidden',
    display: 'grid',
    justifyContent: 'center'
  },
  largeTitle: {
    fontWeight: 700,
    fontSize: 28
  }
}));
