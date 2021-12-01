import { Action, Dispatch } from 'redux';
import { setCurrentStatement } from './hudStoryActions';

const STORY_SEQUENCE_DELAY_IN_MS = 7000;

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
   * A bookmark marking where we are in the story.
   */
  private statementIndex = 0;

  /**
   * Actually a number but specified as NodeJS.Timeout in the .dts file,
   * so use `any` type to make typescript compiler happy.
   */
  private timeoutId: any = null;

  constructor(statements: string[]) {
    this.statements = statements;
  }

  public startStory(dispatch: Dispatch<Action>): void {
    this.endStory(dispatch);
    this.readStory(dispatch);
  }

  private readStory(dispatch: Dispatch<Action>): void {
    const isAtEnd = !this.statements[this.statementIndex];
    if (isAtEnd) {
      this.endStory(dispatch);
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

    dispatch(setCurrentStatement(''));

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
