import { gutterStyle } from "./Gutter";
export const styles = theme => ({
  root: { ...gutterStyle(theme),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    height: '100%'
  },
  packetsWrapper: {
    width: '100%',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    position: 'relative',
    height: 170
  },
  packetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170
  },
  packet: {
    width: 180,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  packetBackground: {
    backgroundColor: '#f9f9f9',
    opacity: 0.8,
    width: 180,
    height: 120,
    borderRadius: 8,
    marginLeft: 10,
    marginTop: 10
  },
  packetText: {
    color: theme.circleIn.palette.normalButtonText1
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: theme.palette.primary.main
  }
});