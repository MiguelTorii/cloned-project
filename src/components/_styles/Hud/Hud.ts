export const styles = () => ({
  app: {
    position: 'absolute',
    inset: 0
  },
  appWithHud: {
    display: 'grid',
    gridTemplateColumns: '200px 100px 1fr 100px 200px',
    gridTemplateRows: '0px 100px 1fr 2fr 50px 40px 40px 0px'
  },
  mainAction: {
    background: 'cornflowerBlue',
    gridColumn: '2 / -2',
    gridRow: '1 / -1'
  },
  storyAvatar: {
    background: 'orchid',
    gridColumn: 4,
    gridRow: 2
  },
  miniMap: {
    background: 'goldenRod',
    gridColumn: 5,
    gridRow: 2
  },
  questTasks: {
    background: 'forestGreen',
    gridColumn: 5,
    gridRow: 3
  },
  rewardUpdates: {
    background: 'hotPink',
    gridColumn: 5,
    gridRow: 4
  },
  toolsAndSpells: {
    background: 'tan',
    gridColumn: 5,
    gridRow: '5 / -2'
  },
  storyCaption: {
    background: 'fireBrick',
    gridColumn: '2 / -2',
    gridRow: 5
  },
  experienceUpdates: {
    background: 'turquoise',
    gridColumn: '2 / -2',
    gridRow: 6
  },
  experienceProgress: {
    background: 'seaGreen',
    gridColumn: '2 / -2',
    gridRow: 7
  },
  playerModes: {
    background: 'royalBlue',
    gridColumn: 1,
    gridRow: 7
  },
  chatChannels: {
    background: 'aqua',
    gridColumn: 1,
    gridRow: '2 / span 2'
  },
  activeChat: {
    background: 'purple',
    gridColumn: 1,
    gridRow: '4 / span 3'
  }
});
