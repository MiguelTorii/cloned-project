export const styles = (theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 900
  },
  paper: {
    marginTop: theme.spacing(2),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonFirst: {
    borderTopLeftRadius: 4
  },
  buttonLast: {
    borderBottomLeftRadius: 4
  },
  button: {
    height: 60,
    width: 60
  },
  iconXS: {
    height: 20,
    width: 20
  },
  iconSM: {
    height: 30,
    width: 30
  },
  iconMD: {
    height: 40,
    width: 40
  },
  iconLG: {
    height: 50,
    width: 50
  },
  iconXL: {
    height: 60,
    width: 60
  },
  menu: {
    marginRight: theme.spacing()
  },
  menuList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorLabel: {
    height: 40,
    width: 40,
    borderRadius: '50%'
  }
});
