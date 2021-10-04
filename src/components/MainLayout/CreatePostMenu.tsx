import React, { memo, useMemo } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Tooltip from "../../containers/Tooltip/Tooltip";
import Notes from "../../assets/svg/notes.svg";
import Questions from "../../assets/svg/questions.svg";
import Links from "../../assets/svg/links.svg";
import Videos from "../../assets/svg/videos.svg";
import FlashCards from "../../assets/svg/flashcards.svg";
import { useStyles } from "../_styles/MainLayout/CreatePostMenu";

const CreatePostMenu = ({
  MyLink,
  createPostAnchorEl,
  isCreatePostMenuOpen,
  search,
  handleCreatePostMenuClose
}) => {
  const classes = useStyles();
  const MenuItemContent = useMemo(() => ({
    primaryText,
    secondaryText,
    icon
  }) => <div className={classes.menuItemContent}>
            <img src={icon} alt="icon" className={classes.icon} />
            <div>
              <div className={classes.primaryItem}>{primaryText}</div>
              <div className={classes.secondaryItem}>{secondaryText}</div>
            </div>
          </div>, [classes.icon, classes.menuItemContent, classes.primaryItem, classes.secondaryItem]);
  return <Menu id="simple-menu" className={classes.root} anchorEl={createPostAnchorEl} open={isCreatePostMenuOpen} onClose={handleCreatePostMenuClose}>
      <MenuItem button onClick={handleCreatePostMenuClose} component={MyLink} link={`/create/notes${search}`}>
        <MenuItemContent primaryText="Share Notes" secondaryText="Earn 10k points for every page" icon={Notes} />
      </MenuItem>
      <MenuItem button onClick={handleCreatePostMenuClose} component={MyLink} link={`/create/question${search}`}>
        <MenuItemContent primaryText="Ask a Question" secondaryText="Earn 2k points for answering a question and 40k if your answer is chosen as Best Answer" icon={Questions} />
      </MenuItem>
      <MenuItem button onClick={handleCreatePostMenuClose} component={MyLink} link={`/create/flashcards${search}`}>
        <Tooltip id={1194} delay={600} placement="top" text="Create a set of flashcards now, and continue to edit them weekly as part of your studying for each class">
          <MenuItemContent primaryText="Create Flashcards" secondaryText="Earn 1k points per card" icon={FlashCards} />
        </Tooltip>
      </MenuItem>
      <MenuItem button onClick={handleCreatePostMenuClose} component={MyLink} link={`/create/sharelink${search}`}>
        <MenuItemContent primaryText="Share a Resource" secondaryText="Earn 5k points for each resource shared" icon={Links} />
      </MenuItem>
      <hr className={classes.hr} />
      <MenuItem button onClick={handleCreatePostMenuClose} component={MyLink} link="/video-call">
        <MenuItemContent primaryText="Study Room" secondaryText="Earn 20k points for initiating a video session, then 50k points for staying on for at least 10 minutes" icon={Videos} />
      </MenuItem>
    </Menu>;
};

export default memo(CreatePostMenu);