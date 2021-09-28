import { dialogStyle } from '../Dialog';

export const styles = (theme) => ({
  highlight: {
    color: '#fec04f',
    fontSize: 14
  },
  label: {
    whiteSpace: 'pre-wrap',
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing(3)
  },
  subtitle: {
    fontSize: 16
  },
  footnote: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 12
  },
  dialogFootnote: {
    ...styles.footnote,
    whiteSpace: 'pre-wrap',
    textAlign: 'center'
  },
  hr: {
    background: theme.circleIn.palette.appBar,
    border: 'none',
    color: theme.circleIn.palette.appBar,
    height: 1,
    margin: 10
  },
  mvpActions: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 30
  },
  mvpAction: {
    textAlign: 'center',
    width: 160
  },
  dialogTable: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  dialog: {
    ...dialogStyle,
    height: 680
  }
});
