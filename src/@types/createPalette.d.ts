import * as createPalette from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    // eslint-disable-next-line no-undef
    danger: PaletteColor | string;
  }

  interface PaletteOptions {
    // eslint-disable-next-line no-undef
    danger?: PaletteColorOptions | string;
  }
}
