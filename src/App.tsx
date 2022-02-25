import React from 'react';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import MasqueradeFrame from 'containers/MasqueradeFrame/MasqueradeFrame';
import UserInitializer from 'containers/UserInitializer/UserInitializer';

import { theme } from './withRoot';
import HudRoutes from './HudRoutes';
import ProviderGroup from './providers';
import { queryClient } from 'lib/query';

const App = () => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <SnackbarProvider maxSnack={3}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ProviderGroup>
            <CssBaseline />
            <UserInitializer />
            <MasqueradeFrame />
            <HudRoutes />
          </ProviderGroup>
        </QueryClientProvider>
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

export default App;
