import { useTheme } from '@material-ui/core/styles';
import muiUseMediaQuery from '@material-ui/core/useMediaQuery';

const useMediaQuery = () => {
  const theme = useTheme();
  const isMobileScreen = muiUseMediaQuery(theme.breakpoints.down('xs'));
  const isDesktopScreen = !isMobileScreen;

  return {
    isMobileScreen,
    isDesktopScreen
  };
};

export default useMediaQuery;
