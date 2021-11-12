export const styles = () => ({
  app: {
    position: 'absolute',
    inset: 0
  },
  appWithHud: {
    display: 'grid',
    gridTemplateColumns: '200px 150px 1fr 150px 200px',
    gridTemplateRows: '0px 100px 2fr 1fr 50px 40px 40px 0px'
  },
  mainAction: {
    gridColumn: '2 / -2',
    gridRow: '1 / -5',
    overflow: 'auto'
  },
  storyAvatar: {
    background: 'white',
    gridColumn: 4,
    gridRow: 2,
    margin: 'auto',
    borderRadius: '75px',
    border: 'black solid 1px',
    boxShadow: '3px 3px gray',
    padding: '7px',
    zIndex: 2
  },
  miniMap: {
    background: 'goldenRod',
    gridColumn: 5,
    gridRow: 2
  },
  questTasks: {
    background: 'forestGreen',
    gridColumn: 5,
    gridRow: 3,
    overflow: 'auto'
  },
  rewardUpdates: {
    background: 'hotPink',
    gridColumn: 5,
    gridRow: 4
  },
  navigation: {
    background: 'tan',
    gridColumn: 5,
    gridRow: '5 / -2'
  },
  storyCaption: {
    background: 'fireBrick',
    gridColumn: '2 / -2',
    gridRow: 5,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.7
  },
  experienceUpdates: {
    gridColumn: '2 / -2',
    gridRow: 6
  },
  experienceProgress: {
    gridColumn: '2 / -2',
    gridRow: 7
  },
  chat: {
    background: 'purple',
    gridColumn: 1,
    gridRow: '2 / -1'
  }
});