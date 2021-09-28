import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  details: {
    padding: 0
  },
  summary: {
    minHeight: theme.spacing(5),
    justifyContent: 'flex-start'
  },
  panel: {
    position: 'inherit',
    '& .MuiAccordionSummary-root': {
      borderBottom: `1px solid ${theme.circleIn.palette.borderColor}`,
      padding: 0,
      margin: theme.spacing(0, 3)
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
      flexGrow: 0
    }
  }
}));
