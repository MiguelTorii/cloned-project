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
import ErrorBoundary from '../ErrorBoundary';

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = searchClient.initIndex(ALGOLIA_INDEX);

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  variant: ?string,
  error: boolean,
  tags: Array<SelectType>,
  onChange: Function
};

type State = {
  inputValue: string
};

class TagsAutoComplete extends React.PureComponent<Props, State> {
  state = {
    inputValue: ''
  };

  handleLoadOptions = async (search, loadedOptions, { page }) => {
    const content = await index.search({ query: search, page });
    const { hits, nbPages } = content;
    const options = hits.map((suggestion) => ({
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
    const {
      location: { pathname }
    } = window;
    const isEdit = pathname.includes('/edit');
    const { classes, error, tags, onChange, variant } = this.props;
    const { inputValue } = this.state;
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <AutoComplete
            values={tags}
            variant={variant || 'outlined'}
            isDisabled={isEdit}
            inputValue={inputValue}
            label="Tags (Optional)"
            placeholder=""
            error={error}
            errorText="You must add at least 1 tag"
            isMulti
            onChange={onChange}
            onLoadOptions={this.handleLoadOptions}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(TagsAutoComplete);
