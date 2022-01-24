import { Palette } from '@material-ui/core/styles/createPalette';
import * as createTheme from '@material-ui/core/styles/createTheme';

type CustomTheme = {
  // eslint-disable-next-line no-undef
  [Key in keyof typeof theme]: typeof theme[Key];
};

declare module '@material-ui/core/styles/createTheme' {
  // eslint-disable-next-line no-undef, @typescript-eslint/no-empty-interface
  interface Theme extends CustomTheme {}

  // eslint-disable-next-line no-undef, @typescript-eslint/no-empty-interface
  interface ThemeOptions extends CustomTheme {}
}

declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: true;
    s: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}
