import makeStyles from '@material-ui/core/styles/makeStyles';
import ImageBackground from 'assets/svg/homepage-background.svg';
import ImageBackgroundWide from 'assets/svg/homepage-background-wide.svg';

export default makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      backgroundImage: `url('${ImageBackground}')`,
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'right'
    },
    [theme.breakpoints.up('xl')]: {
      backgroundImage: `url('${ImageBackgroundWide}')`,
    }
  }
}));
