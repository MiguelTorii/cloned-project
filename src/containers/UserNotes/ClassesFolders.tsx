import React from "react";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import EmptyState from "components/FeedList/EmptyState";
import EmptyPastClass from "assets/img/empty-past-class.png";
import ClassNotes from "./ClassNotes";
const useStyles = makeStyles(theme => ({
  listItemContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: theme.circleIn.palette.gray1
    }
  },
  listItem: {
    borderBottom: `1px solid #5F61654D`,
    fontWeight: 800,
    fontSize: 24,
    color: theme.circleIn.palette.primaryText1,
    lineHeight: '33px',
    paddingLeft: 0,
    marginLeft: theme.spacing(1)
  },
  listRoot: {
    padding: 0
  },
  title: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1)
  },
  emptyStateContainer: {
    maxWidth: 514,
    lineHeight: '33px',
    textAlign: 'left'
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: theme.circleIn.palette.white,
    marginBottom: theme.spacing(3)
  },
  emptyBody: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.circleIn.palette.white
  }
}));

const ClassesFolders = ({
  classList,
  currentFilter
}) => {
  const classes = useStyles();
  return <List className={classes.listRoot}>
      {classList.map((cl, idx) => <ClassNotes key={cl.classId} arrayIndex={idx} classData={cl} />)}
      {classList.length === 0 && <EmptyState imageUrl={EmptyPastClass}>
          <div className={classes.emptyStateContainer}>
            <div className={classes.emptyTitle}>
              {`This tab shows notes from “${currentFilter} classes”.`}
            </div>
            <div className={classes.emptyBody}>
              {currentFilter === 'past' && <>
                  You don’t have any past classes yet, but your notes will be saved here and ready
                  for you once you finish your current classes.&nbsp;
                  <span role="img" aria-label="Wink emoji">
                    😉
                  </span>
                </>}
              {currentFilter === 'current' && <>
                  This tab shows notes from “current classes”. You haven’t been added to any classes
                  yet.If you’re currently enrolled in classes, please contact us at
                  support@circleinapp.com.
                </>}
            </div>
          </div>
        </EmptyState>}
    </List>;
};

export default ClassesFolders;