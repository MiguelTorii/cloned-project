import * as createTypography from '@material-ui/core/styles/createTypography';
import { TypographyOptions } from '@material-ui/core/styles/createTypography';

declare module '@material-ui/core/styles/createTypography' {
  interface TypographyOptions {
    color: string;
  }
}
