import React from 'react';

import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import MasqueradeFrame from 'containers/MasqueradeFrame/MasqueradeFrame';
import UserInitializer from 'containers/UserInitializer/UserInitializer';
import { ChatClientProvider } from 'features/chat';
import { queryClient } from 'lib/query';

import HudRoutes from './HudRoutes';
import ProviderGroup from './providers';
import { theme } from './withRoot';

const App = () => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <SnackbarProvider maxSnack={3}>
        <ChatClientProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ProviderGroup>
              <CssBaseline />
              <UserInitializer />
              <MasqueradeFrame />
              <HudRoutes />
            </ProviderGroup>
          </QueryClientProvider>
        </ChatClientProvider>
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

export default App;
