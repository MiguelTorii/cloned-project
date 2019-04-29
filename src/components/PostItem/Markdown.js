import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  listItem: {
    marginTop: theme.spacing.unit,
    color: theme.palette.text.primary
  }
});

const options = {
  overrides: {
    h1: {
      component: props => <Typography gutterBottom variant="h4" {...props} />
    },
    h2: {
      component: props => <Typography gutterBottom variant="h6" {...props} />
    },
    h3: {
      component: props => (
        <Typography gutterBottom variant="subtitle1" {...props} />
      )
    },
    h4: {
      component: props => (
        <Typography gutterBottom variant="caption" paragraph {...props} />
      )
    },
    p: { component: props => <Typography paragraph {...props} /> },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      ))
    },
    a: { component: props => <Link target="_blank" {...props} /> }
  }
};

function Markdown(props) {
  return <ReactMarkdown options={options} {...props} />;
}

export default Markdown;
