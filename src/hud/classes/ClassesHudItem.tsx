import React, { useRef, useState } from 'react';
import { Box, Grid, Hidden, withWidth } from '@material-ui/core';
import MainActionNavbar from '../navbar/HudNavbar';
import { decypherClass } from '../../utils/crypto';
import Classes from '../../containers/ClassesGrid/Classes';
import FeedResources from '../../containers/FeedResources/FeedResources';
import Feed from '../../containers/Feed/Feed';
import withRoot from '../../withRoot';
import Recommendations from '../../containers/Recommendations/Recommendations';

type Props = {
  classes: Record<string, any>;
};

enum CLASSES_SECTIONS {
  'Classes',
  'Feeds'
}

const ClassesHudItem = ({ classes }: Props) => {
  const [currentGoalPage, setCurrentGoalPage] = useState<CLASSES_SECTIONS>(
    CLASSES_SECTIONS.Classes
  );

  const navbarItems = [
    {
      id: 'classes',
      displayName: 'Classes',
      onSelection: () => setCurrentGoalPage(CLASSES_SECTIONS.Classes)
    },
    {
      id: 'feeds',
      displayName: 'Feeds',
      onSelection: () => setCurrentGoalPage(CLASSES_SECTIONS.Feeds)
    }
  ];

  const gridRef = useRef(null);
  const feedId = 0;
  const from = '';
  const { classId, sectionId } = decypherClass();

  return (
    <div className={classes.container}>
      <MainActionNavbar navbarItems={navbarItems} classes={classes} />

      {currentGoalPage === CLASSES_SECTIONS.Classes && <Classes />}

      {currentGoalPage === CLASSES_SECTIONS.Feeds && (
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

export default withRoot(withWidth()(ClassesHudItem));
