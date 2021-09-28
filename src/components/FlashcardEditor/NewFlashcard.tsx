import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { styles } from '../_styles/FlashcardEditor/NewFlashcard';

type Props = {
  classes: Record<string, any>;
  loading: boolean;
  error: boolean;
  onClick: (...args: Array<any>) => any;
};

class NewFlashcard extends React.PureComponent<Props> {
  render() {
    const { classes, loading, error, onClick } = this.props;
    return (
      <ButtonBase
        disabled={loading}
        className={cx(classes.root, error && classes.error)}
        onClick={onClick}
      >
        <AddIcon />
        <Typography variant="h6">
          {error ? 'You have to at least add 1 Flashcard' : 'Add New'}
        </Typography>
      </ButtonBase>
    );
  }
}

export default withStyles(styles as any)(NewFlashcard);
