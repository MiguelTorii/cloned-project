import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  displayGrid: {
    display: 'grid',
    gridTemplateColumns: '60px 60px 1fr',
    gridTemplateRows: '60px 60px',
    maxWidth: '600px',
    margin: 'auto',
    overflow: 'hidden'
  },
  storyAvatar: {
    gridColumn: '1 / 3',
    gridRow: '1 / -1',
    overflow: 'hidden',
    zIndex: 2
  },
  storyMessage: {
    gridColumn: '2 / 4',
    gridRow: '1 / -1',
    overflow: 'hidden'
  },
  experienceBar: {
    gridColumn: 3,
    gridRow: 2,
    overflow: 'hidden',
    marginTop: theme.spacing(2)
  }
}));
