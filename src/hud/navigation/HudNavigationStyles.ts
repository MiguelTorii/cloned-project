import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  controlPanelMainSection: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: theme.circleIn.palette.white,
    borderLeft: '1px solid',
    borderRight: '1px solid'
  },
  controlPanelMainSectionGroup: {
    display: 'grid',
    borderColor: theme.circleIn.palette.white,
    borderLeft: '1px solid',
    borderRight: '1px solid'
  },
  toolGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: theme.spacing(),
    marginRight: theme.spacing()
  },
  controlPanelLabel: {
    marginLeft: theme.spacing()
  },
  navigationIcon: {
    width: '30px',
    height: '30px'
  }
}));
