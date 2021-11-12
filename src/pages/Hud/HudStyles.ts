export const styles = () => ({
  app: {
    position: 'absolute',
    inset: 0
  },
  appWithHud: {
    display: 'grid',
    gridTemplateColumns: '250px 100px 1fr 200px 250px',
    gridTemplateRows: '1fr 50px 80px'
  },
  mainAction: {
    gridColumn: '2 / -2',
    gridRow: '1',
    overflow: 'auto'
  },
  storyAvatar: {
    background: 'white',
    gridColumn: 2,
    gridRow: ' 2 / -1',
    margin: 'auto',
    borderRadius: '75px',
    border: 'black solid 1px',
    boxShadow: '3px 3px gray',
    padding: '7px',
    zIndex: 2
  },
  storyCaption: {
    gridColumn: '3 / 4',
    gridRow: 2,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.7
  },
  experienceProgress: {
    gridColumn: 3,
    gridRow: 3
  },
  navigation: {
    gridColumn: 4,
    gridRow: '2 / -1'
  },
  missions: {
    gridColumn: 5,
    gridRow: '1 / -1',
    overflow: 'auto'
  },
  chat: {
    gridColumn: 1,
    gridRow: '1 / -1'
  }
});
