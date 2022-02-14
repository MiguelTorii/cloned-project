import React from 'react';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import MasqueradeFrame from 'containers/MasqueradeFrame/MasqueradeFrame';
import UserInitializer from 'containers/UserInitializer/UserInitializer';

import { theme } from './withRoot';
import ProviderGroup from './providers';
import HudRoutes from './HudRoutes';

const App = () => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <SnackbarProvider maxSnack={3}>
        <ProviderGroup>
          <CssBaseline />
          <UserInitializer />
          <MasqueradeFrame />
          <HudRoutes />
        </ProviderGroup>
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

export default App;
