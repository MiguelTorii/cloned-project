// @flow

import React from 'react';
import type { ComponentType } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';

const circleInTheme = {
  brand: '#03A9F4',
  action: '#49afd9',
  rowSelection: '#324f61',
  primaryBackground: '#18191A',
  modalBackground: '#37393E',
  feedBackground: '#242526',
  borders: '#566c77',
  primaryText1: '#e9ecef',
  primaryText2: '#adbbc4',
  secondaryText: '#E4E6EA',
  normalButtonText1: '#090909',
  textOffwhite: '#f9f9f9',
  appBar: '#3A3B3B', // validate
  navIcons: '#ffffff', // validate
  tabColor: '#ffffff', // validate
  dividerColor: '#ffffff', // validate
  inputBorderColor: '#959595',
  buttonBackground: '#598498',
  darkActionBlue: '#3177E7',
  // v2
  success: '#60b515',
  snackbar: '#114255',
  disabled: '#6d7884',
  profilebgColor: '#bdbdbd',
  danger: '#F54F47',
  dangerBackground: '#A61515',
  videoThumbDefaultBackground: '#C4C4C4',
  flashcardBackground: '#324F61',
  deepSeaOcean: '#225D89',
  hoverMenu: '#3A3B3B',
  primaryii222: '#1e88e5',
  textSubtitleBody: '#ADBBC4',
  sendMessageButton: '#1E88E5',
  textNormalButton: '#090909',
  greenInvite: '#256F28',
  white: '#FFFFFF',
  black: '#000000'
};

const theme = createMuiTheme({
  circleIn: {
    palette: {
      white: circleInTheme.white,
      black: circleInTheme.black,
      greenInvite: circleInTheme.greenInvite,
      textNormalButton: circleInTheme.textNormalButton,
      sendMessageButton: circleInTheme.sendMessageButton,
      textSubtitleBody: circleInTheme.textSubtitleBody,
      hoverMenu: circleInTheme.hoverMenu,
      primaryii222: circleInTheme.primaryii222,
      deepSeaOcean: circleInTheme.deepSeaOcean,
      flashcardBackground: circleInTheme.flashcardBackground,
      danger: circleInTheme.danger,
      borders: circleInTheme.borders,
      brand: circleInTheme.brand,
      feedBackground: circleInTheme.feedBackground,
      darkActionBlue: circleInTheme.darkActionBlue,
      rowSelection: circleInTheme.rowSelection,
      buttonBackground: circleInTheme.buttonBackground,
      action: circleInTheme.action,
      primaryBackground: circleInTheme.primaryBackground,
      modalBackground: circleInTheme.modalBackground,
      primaryText1: circleInTheme.primaryText1,
      primaryText2: circleInTheme.primaryText2,
      secondaryText: circleInTheme.secondaryText,
      dangerBackground: circleInTheme.dangerBackground,
      videoThumbDefaultBackground: circleInTheme.videoThumbDefaultBackground,
      textOffwhite: circleInTheme.textOffwhite,
      normalButtonText1: circleInTheme.normalButtonText1,
      borderColor: circleInTheme.inputBorderColor,
      appBar: circleInTheme.appBar,
      success: circleInTheme.success,
      snackbar: circleInTheme.snackbar,
      disabled: circleInTheme.disabled,
      profilebgColor: circleInTheme.profilebgColor
    },
    customBackground: {
      iconButton: 'rgba(173,187,196, 0.5)'
    }
  },
  snackbar: {
    info: {
      backgroundColor: '#114255',
      color: '#E9ECEF'
    }
  },
  palette: {
    secondary: {
      main: circleInTheme.primaryText1,
    },
    primary: {
      main: circleInTheme.action
    },
    background: {
      paper: circleInTheme.modalBackground,
      default: circleInTheme.primaryBackground
    },
    text: {
      primary: circleInTheme.primaryText1,
    },
    danger: {
      main: circleInTheme.danger
    }
  },
  typography: {
    useNextVariants: true,
    color: circleInTheme.primaryText1,
    fontSize: 14,
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif'
  },
  zIndex: {
    mobileStepper: 700,
    appBar: 800,
    drawer: 900
  },
  overrides: {
    MuiTypography: {
      caption: {
        paddingLeft: 8
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 30
      }
    },
    MuiListItemText: {
      inset: {
        paddingLeft: 0
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: circleInTheme.appBar
      }
    },
    MuiSvgIcon: {
      root: {
        color: circleInTheme.navIcons
      }
    },
    MuiTabs: {
      indicator: {
        height: 0
      }
    },
    MuiTab: {
      textColorPrimary: {
        color: circleInTheme.tabColor
      },
    },
    MuiFab: {
      label: {
        textTransform: 'capitalize'
      }
    },
    MuiButton: {
      label: {
        textTransform: 'capitalize'
      }
    },
    MuiDivider: {
      light: {
        backgroundColor: circleInTheme.dividerColor,
        opacity: 0.5
      }
    },
    MuiInputBase: {
      input: {
        height: 'fit-content',
        '&:-webkit-autofill': {
          transitionDelay: '9999s',
          transitionProperty: 'background-color, color',
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: circleInTheme.primaryText2
      }
    },
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          borderColor: circleInTheme.inputBorderColor
        }
      }
    },
    MuiDialog: {
      paperWidthSm: {
        minWidth: 200
      }
    },
    MuiSelect: {
      icon: {
        color: circleInTheme.inputBorderColor
      }
    },
    MuiBottomNavigationAction: {
      label: {
        color: circleInTheme.primaryText2
      }
    },
    MuiFormLabel: {
      root: {
        color: circleInTheme.primaryText1
      }
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: 'none'
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: 10,
      }
    },
    MuiBadge: {
      colorSecondary: {
        backgroundColor: circleInTheme.danger,
        color: circleInTheme.primaryText1
      }
    },
    MuiTooltip: {
      popper: {
        zIndex: 1250
      }
    }
  }
});

function withRoot(Component: ComponentType<*>) {
  function WithRoot(props: Object) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider maxSnack={3}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...props} />
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
