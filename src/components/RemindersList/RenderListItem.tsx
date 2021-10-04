import React, { Fragment } from "react";
import cx from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import LabelIcon from "@material-ui/icons/Label";
import Badge from "@material-ui/core/Badge";
import type { ToDos } from "../../types/models";
import { styles } from "../_styles/RemindersList/RenderListItem";
type Props = {
  classes: Record<string, any>;
  title: string;
  items: ToDos;
  left: number;
  onUpdate: (...args: Array<any>) => any;
  onDelete: (...args: Array<any>) => any;
};
type State = {
  open: boolean;
};

class RemindersListItem extends React.PureComponent<Props, State> {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState(({
      open
    }) => ({
      open: !open
    }));
  };
  renderClass = label => {
    const {
      classes
    } = this.props;

    switch (label) {
      case 1:
        return classes.green;

      case 2:
        return classes.blue;

      case 3:
        return classes.grey;

      default:
        return classes.red;
    }
  };

  render() {
    const {
      classes,
      title,
      items,
      left,
      onUpdate,
      onDelete
    } = this.props;
    const {
      open
    } = this.state;
    return <Fragment>
        <ListItem button onClick={this.handleClick}>
          <ListItemText primary={title} />

          <Badge badgeContent={left} className={classes.margin} color="secondary">
            {open ? <ExpandLess /> : <ExpandMore />}
          </Badge>
        </ListItem>
        {items.length > 0 && <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {items.map(item => <ListItem button dense key={item.id} onClick={onUpdate({
            id: item.id,
            status: item.status === 2 ? 1 : 2
          })}>
                  <ListItemIcon>
                    <Checkbox checked={item.status === 2} tabIndex={-1} disableRipple />
                  </ListItemIcon>
                  <ListItemIcon>
                    <LabelIcon className={cx(this.renderClass(item.label))} />
                  </ListItemIcon>
                  <ListItemText inset primary={item.title} secondary={item.due} secondaryTypographyProps={{
              color: 'textPrimary'
            }} />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={onDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>)}
            </List>
          </Collapse>}
      </Fragment>;
  }

}

export default withStyles(styles)(RemindersListItem);