// @flow

import React from 'react';
import type { ComponentType } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { responsiveFontSizes } from '@material-ui/core';

const circleInTheme = {
  brand: '#03A9F4',
  action: '#49afd9',
  backup: '#5A5A5A',
  rowSelection: '#324f61',
  primaryBackground: '#18191A',
  modalBackground: '#37393E',
  feedBackground: '#242526',
  borders: '#566c77',
  primaryText1: '#e9ecef',
  primaryText2: '#adbbc4',
  gray3: '#5F6165',
  secondaryText: '#E4E6EA',
  whiteText: '#ffffff',
  helperText: '#979797',
  normalButtonText1: '#090909',
  textOffwhite: '#f9f9f9',
  formBackground: '#242526',
  appBar: '#3A3B3B', // validate
  navIcons: '#ffffff', // validate
  tabColor: '#ffffff', // validate
  dividerColor: '#ffffff', // validate
  inputBorderColor: '#959595',
  buttonBackground: '#598498',
  darkActionBlue: '#3177E7',
  inactiveColor: '#626365',
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
  disableButtonColor: '#626365',
  black: '#000000',
  menuDivider: '#C7D3DA',
  navbarBackgroundColor: '#1A1C1D',
  navbarBorderColor: '#FFFFFF1C',
  searchInputColor: '#484848',
  darkTextColor: '#BFBFC1',
  tooltipBackground: '#3C3D3F',
  chipBackground: '#5B5C5C',
  menuBackground: '#707070',
  onlineBadgetColor: '#2FB67E',
  circleCheckColor: '#87B261',
  hoverColor: '#303133',
  removeColor: '#F15744',
  floatChatBackground: '#1E1F22',
  floatChatTextAreaBackground: '#3E4143',
  floatChatHeader: '#A2A4A8'
};

let theme = createMuiTheme({
  circleIn: {
    palette: {
      white: circleInTheme.white,
      black: circleInTheme.black,
      backup: circleInTheme.backup,
      gray1: circleInTheme.feedBackground,
      gray2: circleInTheme.hoverMenu,
      gray3: circleInTheme.gray3,
      greenInvite: circleInTheme.greenInvite,
      textNormalButton: circleInTheme.textNormalButton,
      sendMessageButton: circleInTheme.sendMessageButton,
      textSubtitleBody: circleInTheme.textSubtitleBody,
      hoverMenu: circleInTheme.hoverMenu,
      hoverColor: circleInTheme.hoverColor,
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
      formBackground: circleInTheme.formBackground,
      primaryBackground: circleInTheme.primaryBackground,
      modalBackground: circleInTheme.modalBackground,
      primaryText1: circleInTheme.primaryText1,
      primaryText2: circleInTheme.primaryText2,
      whiteText: circleInTheme.whiteText,
      inactiveColor: circleInTheme.inactiveColor,
      secondaryText: circleInTheme.secondaryText,
      dangerBackground: circleInTheme.dangerBackground,
      videoThumbDefaultBackground: circleInTheme.videoThumbDefaultBackground,
      textOffwhite: circleInTheme.textOffwhite,
      normalButtonText1: circleInTheme.normalButtonText1,
      helperText: circleInTheme.helperText,
      borderColor: circleInTheme.inputBorderColor,
      appBar: circleInTheme.appBar,
      success: circleInTheme.success,
      snackbar: circleInTheme.snackbar,
      disabled: circleInTheme.disabled,
      profilebgColor: circleInTheme.profilebgColor,
      disableButtonColor: circleInTheme.disableButtonColor,
      menuDivider: circleInTheme.menuDivider,
      navbarBackgroundColor: circleInTheme.navbarBackgroundColor,
      navbarBorderColor: circleInTheme.navbarBorderColor,
      searchInputColor: circleInTheme.searchInputColor,
      darkTextColor: circleInTheme.darkTextColor,
      tooltipBackground: circleInTheme.tooltipBackground,
      chipBackground: circleInTheme.chipBackground,
      menuBackground: circleInTheme.menuBackground,
      onlineBadgetColor: circleInTheme.onlineBadgetColor,
      circleCheck: circleInTheme.circleCheckColor,
      removeColor: circleInTheme.removeColor,
      floatChatBackground: circleInTheme.floatChatBackground,
      floatChatTextAreaBackground: circleInTheme.floatChatTextAreaBackground,
      floatChatHeader: circleInTheme.floatChatHeader
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
      disabled: circleInTheme.gray3
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
      root: {
        borderRadius: 8
      },
      input: {
        height: 'fit-content',
        '&:-webkit-autofill': {
          transitionDelay: '9999s',
          transitionProperty: 'background-color, color',
        },
      }
    },
    MuiInputLabel: {
      root: {
        color: circleInTheme.secondaryText
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 8,
        '& $notchedOutline': {
          borderColor: circleInTheme.inputBorderColor
        },
        '&$disabled $notchedOutline': {
          borderColor: circleInTheme.gray3
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
      root: {
        backgroundColor: circleInTheme.feedBackground
      },
      rounded: {
        borderRadius: 10
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

theme = responsiveFontSizes(theme);

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
