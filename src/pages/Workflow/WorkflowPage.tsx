import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import Layout from 'containers/Layout/Layout';
import Workflow from 'containers/Workflow/Workflow';
import withRoot from 'withRoot';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

const backend = isMobile ? TouchBackend : HTML5Backend;

type Props = {
  classes: Record<string, any>;
};

// TODO determine if `backend` is actually the correct type or if it should be changed.
// I've turned off typechecking for it for the time being.
const WorkflowPage = ({ classes }: Props) => (
  <DndProvider backend={backend as any}>
    <main>
      <Layout>
        <CssBaseline />
        <Grid container justifyContent="center">
          <Grid item xs={12} md={11} className={classes.item}>
            <Workflow />
          </Grid>
        </Grid>
      </Layout>
    </main>
  </DndProvider>
);

export default withRoot(withStyles(styles as any)(WorkflowPage));
