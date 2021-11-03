import React, { useRef, useState } from 'react';
import { Box, Grid, Hidden } from '@material-ui/core';
import HudNavbar from '../navbar/HudNavbar';
import { decypherClass } from '../../utils/crypto';
import Classes from '../../containers/ClassesGrid/Classes';
import FeedResources from '../../containers/FeedResources/FeedResources';
import Feed from '../../containers/Feed/Feed';
import withRoot from '../../withRoot';
import Recommendations from '../../containers/Recommendations/Recommendations';
import { HudNavbarItem } from '../navbar/HudNavbarItem';

type Props = {
  classes: Record<string, any>;
};

const CLASSES_NAV_ITEM_ID = 'classes';
const FEED_NAV_ITEM_ID = 'feeds';

const ClassesHudItem = ({ classes }: Props) => {
  const navbarItems: HudNavbarItem[] = [
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
      <HudNavbar
        onSelectItem={setCurrentNavbarItemId}
        navbarItems={navbarItems}
        classes={classes}
      />

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
          <Grid item xs={12} lg={3} className={classes.resources} ref={gridRef}>
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

export default withRoot(ClassesHudItem);
