// @flow

import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { withStyles } from '@material-ui/core/styles';
import type { SelectType } from '../../types/models';
import AutoComplete from '../../components/AutoComplete';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX
} from '../../constants/app';

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = searchClient.initIndex(ALGOLIA_INDEX);

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {
  values: Array<SelectType>,
  inputValue: string
};

class TagsAutoComplete extends React.PureComponent<Props, State> {
  state = {
    values: [],
    inputValue: ''
  };

  handleChange = values => {
    this.setState({ values });
  };

  handleLoadOptions = async (search, loadedOptions, { page }) => {
    const content = await index.search({ query: search, page });
    const { hits, nbPages } = content;
    const options = hits.map(suggestion => ({
      value: suggestion.id,
      label: suggestion.tag,
      description: suggestion.description
    }));
    return {
      options,
      hasMore: page + 1 < nbPages,
      additional: {
        page: content.page + 1
      }
    };
  };

  render() {
    const { classes } = this.props;
    const { values, inputValue } = this.state;
    return (
      <div className={classes.root}>
        <AutoComplete
          values={values}
          inputValue={inputValue}
          onChange={this.handleChange}
          onLoadOptions={this.handleLoadOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TagsAutoComplete);
