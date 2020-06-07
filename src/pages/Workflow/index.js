// @flow

import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Workflow from 'containers/Workflow'
import withRoot from 'withRoot'
import Layout from 'containers/Layout'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { isMobile } from "react-device-detect"

const styles = () => ({
  item: {
    display: 'flex'
  }
})


const WorkflowPage = ({classes }: Props) => {
  const backend = isMobile ? TouchBackend : HTML5Backend
  return (
    <DndProvider backend={backend}>
      <main>
        <Layout>
          <CssBaseline />
          <Grid container justify="center">
            <Grid item xs={12} md={10} className={classes.item}>
              <Workflow />
            </Grid>
          </Grid>
        </Layout>
      </main>
    </DndProvider>
  )
}

export default withRoot(withStyles(styles)(WorkflowPage))
