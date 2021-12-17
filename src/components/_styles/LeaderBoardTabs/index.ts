export const styles = (theme) => ({
  fullWidth: {
    width: '100%'
  },
  container: {
    margin: '0 auto 40px auto',
    paddingBottom: 20,
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 16,
    fontFamily: 'Nunito'
  },
  header: {
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabs: {
    borderRadius: '16px 16px 0 0',
    padding: '17px 32px 11px 32px',
    fontSize: 18,
    cursor: 'pointer',
    fontWeight: 700
  },
  days: {
    fontSize: 20,
    paddingBottom: theme.spacing(),
    color: theme.circleIn.palette.primaryText1
  },
  count: {
    fontSize: 20,
    color: theme.circleIn.palette.success,
    textAlign: 'center',
    padding: 8,
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 8
  },
  divider: {
    borderLeft: `1px ${theme.circleIn.palette.modalBackground} solid`,
    height: 32
  },
  rewardContainer: {
    display: 'flex',
    padding: '29px 32px'
  },
  img: {
    gridRow: '1/3'
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginLeft: 10,
    marginBottom: 10,
    color: theme.circleIn.palette.primaryText1
  },
  filled: {
    backgroundColor: theme.circleIn.palette.appBar
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px'
  },
  button: {
    width: 150,
    marginLeft: 10
  },
  highlightedButton: {
    boxShadow: `0 0 0 ${theme.spacing(1)}px ${theme.circleIn.palette.success}`
  },
  imgDialogContainer: {
    textAlign: 'center',
    width: '100%'
  },
  grayText: {
    color: theme.circleIn.palette.primaryText2
  },
  scoreContainer: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing()
  },
  infoButton: {
    borderRadius: 8,
    color: theme.circleIn.palette.brand,
    borderColor: theme.circleIn.palette.brand,
    width: 75
  },
  highlight: {
    color: '#fec04f',
    fontSize: 14
  },
  label: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.1
  },
  labelSmall: {
    whiteSpace: 'pre-wrap',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 1.4
  },
  footnote: {
    whiteSpace: 'pre-wrap',
    color: theme.circleIn.palette.primaryText2,
    fontSize: 12
  }
});
