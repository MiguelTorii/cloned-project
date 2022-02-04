import { makeStyles } from '@material-ui/core/styles';

export const DEFAULT_AVATAR_SIZE = {
  desktop: 40,
  mobile: 40
};

/**
 * Added this as a sliver of background color was coming through for users with solid pictures,
 * but for PNGs no background comes through and it looks awkward
 */
const downsize = (avatarSize: number) => avatarSize - 2;

export const useStyles = makeStyles((theme: any) => ({
  profileBackground: {
    backgroundColor: theme.circleIn.palette.profilebgColor,
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      width: (props: any) => downsize(props.mobileSize) || downsize(DEFAULT_AVATAR_SIZE.mobile),
      height: (props: any) => downsize(props.mobileSize) || downsize(DEFAULT_AVATAR_SIZE.mobile)
    },
    [theme.breakpoints.up('md')]: {
      width: (props: any) => downsize(props.desktopSize) || downsize(DEFAULT_AVATAR_SIZE.desktop),
      height: (props: any) => downsize(props.desktopSize) || downsize(DEFAULT_AVATAR_SIZE.desktop)
    },
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  avatarContainer: {
    margin: 'auto',
    color: theme.circleIn.palette.black,
    // Halving the size of the initials font from the profile background
    [theme.breakpoints.down('sm')]: {
      fontSize: (props: any) => props.mobileSize / 2 || DEFAULT_AVATAR_SIZE.mobile / 2
    },
    [theme.breakpoints.up('md')]: {
      fontSize: (props: any) => props.desktopSize / 2 || DEFAULT_AVATAR_SIZE.desktop / 2
    }
  },
  profileImage: {
    [theme.breakpoints.down('sm')]: {
      width: (props: any) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile,
      height: (props: any) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile
    },
    [theme.breakpoints.up('md')]: {
      width: (props: any) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop,
      height: (props: any) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop
    }
  }
}));
