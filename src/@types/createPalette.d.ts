import * as createPalette from '@material-ui/core/styles/createPalette';

import type { theme } from '../withRoot';

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

declare module '@material-ui/core' {
  export namespace PropTypes {
    type Color =
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'default'
      | keyof theme['circleIn']['palette'];
  }
}
