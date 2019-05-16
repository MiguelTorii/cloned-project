// @flow

import React from 'react';
import uuidv4 from 'uuid/v4';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType, Flashcard } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import FlashcardEditor from '../../components/FlashcardEditor';
import NewFlashcard from '../../components/FlashcardEditor/NewFlashcard';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { createFlashcards } from '../../api/posts';

const styles = () => ({
  flashcards: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function
};

type State = {
  loading: boolean,
  title: string,
  userClass: number | string,
  tags: Array<SelectType>,
  tagsError: boolean,
  flashcards: Array<Flashcard & { id: string }>,
  flashcardsError: boolean,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string
};

class CreateFlashcards extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    userClass: '',
    tags: [],
    tagsError: false,
    flashcards: [],
    flashcardsError: false,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
  };

  handleSubmit = async () => {
    const { tags, flashcards } = this.state;
    if (tags.length === 0) {
      this.setState({ tagsError: true });
      return;
    }
    if (flashcards.length === 0) {
      this.setState({ flashcardsError: true });
      return;
    }
    this.setState({ tagsError: false, flashcardsError: false });
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '', grade }
        },
        pushTo
      } = this.props;
      const { title, userClass } = this.state;

      const tagValues = tags.map(item => Number(item.value));
      await createFlashcards({
        userId,
        title,
        deck: flashcards.map(item => ({
          question: item.question,
          answer: item.answer
        })),
        grade,
        classId: Number(userClass),
        tags: tagValues
      });
      pushTo('/feed');
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClassChange = event => {
    this.setState({ userClass: event.target.value });
  };

  handleTagsChange = values => {
    this.setState({ tags: values });
    if (values.length === 0) this.setState({ tagsError: true });
    else this.setState({ tagsError: false });
  };

  handleAddNew = () => {
    this.setState(({ flashcards }) => ({
      flashcards: [...flashcards, { id: uuidv4(), question: '', answer: '' }]
    }));
  };

  handleDelete = id => {
    const newState = update(this.state, {
      flashcards: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, { $splice: [[index, 1]] });
          }
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleUpdate = ({ id, question, answer }) => {
    const newState = update(this.state, {
      flashcards: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, {
              [index]: {
                question: { $set: question },
                answer: { $set: answer }
              }
            });
          }
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      title,
      userClass,
      tags,
      tagsError,
      flashcards,
      flashcardsError,
      errorDialog,
      errorTitle,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <CreatePostForm
          title="Create Flashcards"
          loading={loading}
          handleSubmit={this.handleSubmit}
        >
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="subtitle1">Title</Typography>
            </Grid>
            <Grid item xs={10}>
              <OutlinedTextValidator
                label="Title"
                onChange={this.handleTextChange}
                name="title"
                value={title}
                validators={['required']}
                errorMessages={['Title is required']}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Class</Typography>
            </Grid>
            <Grid item xs={10}>
              <ClassesSelector
                value={userClass}
                onChange={this.handleClassChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Tags</Typography>
            </Grid>
            <Grid item xs={10}>
              <TagsAutoComplete
                tags={tags}
                error={tagsError}
                onChange={this.handleTagsChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Flashcards</Typography>
            </Grid>
            <Grid item xs={10} className={classes.flashcards}>
              {flashcards.map((flashcard, index) => (
                <FlashcardEditor
                  key={flashcard.id}
                  id={flashcard.id}
                  index={index + 1}
                  loading={loading}
                  question={flashcard.question}
                  answer={flashcard.answer}
                  onDelete={this.handleDelete}
                  onSubmit={this.handleUpdate}
                />
              ))}
              <NewFlashcard
                error={flashcardsError && flashcards.length === 0}
                loading={loading}
                onClick={this.handleAddNew}
              />
            </Grid>
          </Grid>
        </CreatePostForm>
        <SimpleErrorDialog
          open={errorDialog}
          title={errorTitle}
          body={errorBody}
          handleClose={this.handleErrorDialogClose}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateFlashcards));
