import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(() => ({
  card: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 1004,
    left: 0,
    top: 0,
    maxWidth: 31 * 8
  },
  list: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 1004,
    left: 50,
    top: 0,
    width: '50vw'
  }
}));