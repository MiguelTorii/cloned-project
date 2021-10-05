import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { styles } from '../_styles/Markdown';

type Props = {
  classes?: any;
};

const options = {
  overrides: {
    h1: {
      component: (props) => <Typography gutterBottom variant="h1" {...props} />
    },
    h2: {
      component: (props) => <Typography gutterBottom variant="h2" {...props} />
    },
    h3: {
      component: (props) => <Typography gutterBottom variant="h3" {...props} />
    },
    h4: {
      component: (props) => <Typography gutterBottom variant="h4" paragraph {...props} />
    },
    p: {
      component: (props) => <Typography component="div" variant="h6" paragraph {...props} />
    },
    li: {
      component: withStyles(styles as any)(({ classes, ...props }: Props) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      ))
    },
    a: {
      component: (props) => <Link target="_blank" {...props} />
    }
  }
};

function Markdown(props: Props) {
  return <ReactMarkdown options={options} {...props} />;
}

export default Markdown;
