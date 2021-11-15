import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  appWithHud: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: '270px 130px 1fr 320px 270px',
    gridTemplateRows: '1fr 50px 80px',
    overflow: 'hidden'
  },
  mainAction: {
    gridColumn: '2 / -2',
    gridRow: '1',
    overflow: 'hidden'
  },
  storyAvatar: {
    gridColumn: 2,
    gridRow: ' 2 / -1',
    zIndex: 2,
    overflow: 'hidden'
  },
  storyMessage: {
    gridColumn: '3 / 4',
    gridRow: 2,
    zIndex: 2,
    overflow: 'hidden'
  },
  experienceBar: {
    gridColumn: 3,
    gridRow: 3,
    zIndex: 2,
    overflow: 'hidden'
  },
  navigation: {
    gridColumn: 4,
    gridRow: '2 / -1',
    zIndex: 2,
    overflow: 'hidden'
  },
  missions: {
    gridColumn: 5,
    gridRow: '1 / -1',
    overflow: 'hidden'
  },
  chat: {
    gridColumn: 1,
    gridRow: '1 / -1',
    overflow: 'hidden'
  }
}));
