import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Hidden } from '@material-ui/core';
import { decypherClass } from '../../utils/crypto';
import Classes from '../../containers/ClassesGrid/Classes';
import FeedResources from '../../containers/FeedResources/FeedResources';
import Feed from '../../containers/Feed/Feed';
import Recommendations from '../../containers/Recommendations/Recommendations';
import { useStyles } from './CommunitiesAreaStyles';
import { CLASSES_AREA, FEEDS_AREA } from '../../hud/navigationState/hudNavigation';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';

const CommunitiesArea = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const gridRef = useRef(null);
  const feedId = 0;
  const from = '';
  const { classId, sectionId } = decypherClass();

  return (
    <div className={classes.container}>
      {selectedMainSubArea === CLASSES_AREA && <Classes />}

      {selectedMainSubArea === FEEDS_AREA && (
        <Grid container spacing={2}>
          <Hidden lgUp>
            <Grid item xs={12}>
              <Box padding={1}>
                <Recommendations />
              </Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} lg={9} className={classes.item}>
            <Feed
              feedId={Number(feedId)}
              classId={classId}
              sectionId={sectionId}
              from={String(from)}
            />
          </Grid>
          <Grid item xs={12} lg={3} ref={gridRef}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <FeedResources gridRef={gridRef} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default CommunitiesArea;
