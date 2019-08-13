// @flow

import React from 'react';
import type { ComponentType } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';

const circleInTheme = {
  action: '#49afd9',
  primaryBackground: '#1b2a32',
  modalBackground: '#22343c',
  primaryText1: '#e9ecef',
  primaryText2: '#adbbc4',
  normalButtonText1: '#090909',
  appBar: '#37474f', // validate
  navIcons: '#ffffff', // validate
  tabColor: '#ffffff', // validate
  dividerColor: '#ffffff', // validate
  inputBorderColor: '#959595',
  // v2
  success: '#60b515',
  snackbar: '#114255',
  disabled: '#6d7884'
};
const theme = createMuiTheme({
  circleIn: {
    palette: {
      action: circleInTheme.action,
      primaryBackground: circleInTheme.primaryBackground,
      modalBackground: circleInTheme.modalBackground,
      primaryText1: circleInTheme.primaryText1,
      primaryText2: circleInTheme.primaryText2,
      normalButtonText1: circleInTheme.normalButtonText1,
      borderColor: circleInTheme.inputBorderColor,
      appBar: circleInTheme.appBar,
      success: circleInTheme.success,
      snackbar: circleInTheme.snackbar,
      disabled: circleInTheme.disabled
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
    primary: {
      main: circleInTheme.action
    },
    background: {
      paper: circleInTheme.modalBackground,
      default: circleInTheme.primaryBackground
    },
    text: {
      primary: circleInTheme.primaryText1
    }
  },
  typography: {
    useNextVariants: true,
    fontSize: 14,
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif'
  },
  zIndex: {
    mobileStepper: 700,
    appBar: 800,
    drawer: 900
  },
  overrides: {
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
      label: {
        textTransform: 'capitalize'
      }
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
