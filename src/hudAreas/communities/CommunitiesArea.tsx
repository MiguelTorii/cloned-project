import React, { useRef, useState } from 'react';
import { Box, Grid, Hidden } from '@material-ui/core';
import HudToolbar from '../../hud/navigation/HudToolbar';
import { decypherClass } from '../../utils/crypto';
import Classes from '../../containers/ClassesGrid/Classes';
import FeedResources from '../../containers/FeedResources/FeedResources';
import Feed from '../../containers/Feed/Feed';
import Recommendations from '../../containers/Recommendations/Recommendations';
import { HudTool } from '../../hud/navigation/HudTool';
import { useStyles } from './CommunitiesAreaStyles';

const CLASSES_NAV_ITEM_ID = 'classes';
const FEED_NAV_ITEM_ID = 'feeds';

const CommunitiesArea = () => {
  const classes: any = useStyles();

  const navbarItems: HudTool[] = [
    {
      id: CLASSES_NAV_ITEM_ID,
      displayName: 'Classes'
    },
    {
      id: FEED_NAV_ITEM_ID,
      displayName: 'Feeds'
    }
  ];

  const [currentNavbarItemId, setCurrentNavbarItemId] = useState<string>(navbarItems[0].id);

  const gridRef = useRef(null);
  const feedId = 0;
  const from = '';
  const { classId, sectionId } = decypherClass();

  return (
    <div className={classes.container}>
      <HudToolbar onSelectItem={setCurrentNavbarItemId} navbarItems={navbarItems} />

      {currentNavbarItemId === CLASSES_NAV_ITEM_ID && <Classes />}

      {currentNavbarItemId === FEED_NAV_ITEM_ID && (
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
