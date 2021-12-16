import { Action, Dispatch } from 'redux';
import { setCurrentStatement } from './hudStoryActions';

const STORY_SEQUENCE_DELAY_IN_MS = 5000;

export interface IStorySequenceOptions {
  statements: string[];
  isPersistent: boolean;
  highlightLeafAreaId?: string;
}

/**
 * Tracks all the details of "where we are" in a story sequence.
 * This bundling of state per each story makes it easy to cancel
 * one story and start another one without race conditions.
 */
export class StorySequence {
  /**
   * All the statements that together make up the story.
   */
  private statements: string[];

  /**
   * Function to call when the story completes.
   * Note that this function will not be called if the story is cancelled
   * and it ends early.
   */
  private completionCallback: () => void;

  /**
   * A bookmark marking where we are in the story.
   */
  private statementIndex = 0;

  /**
   * Actually a number but specified as NodeJS.Timeout in the .dts file,
   * so use `any` type to make typescript compiler happy.
   */
  private timeoutId: any = null;

  /**
   * A persistent story will continue to show the last message after the message
   * delay has elapsed.
   */
  private isPersistent: any = null;

  constructor({ statements, isPersistent }: IStorySequenceOptions, completionCallback: () => void) {
    this.statements = statements;
    this.completionCallback = completionCallback;
    this.isPersistent = isPersistent;
  }

  public isReading(): boolean {
    return !!this.timeoutId;
  }

  public startStory(dispatch: Dispatch<Action>): void {
    this.endStory(dispatch);
    this.readStory(dispatch);
  }

  private readStory(dispatch: Dispatch<Action>): void {
    const isAtEnd = !this.statements[this.statementIndex];
    if (isAtEnd) {
      this.endStory(dispatch);
      if (this.completionCallback) {
        this.completionCallback();
      }
    } else {
      this.readStatement(dispatch);
    }
  }

  private readStatement(dispatch: Dispatch<Action>): void {
    const nextStatement = this.statements[this.statementIndex];
    this.statementIndex += 1;

    dispatch(setCurrentStatement(nextStatement));

    this.timeoutId = setTimeout(() => {
      this.readStory(dispatch);
    }, STORY_SEQUENCE_DELAY_IN_MS);
  }

  public endStory(dispatch: Dispatch<Action>): void {
    this.statementIndex = 0;

    if (!this.isPersistent) {
      dispatch(setCurrentStatement(''));
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
