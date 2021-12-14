export interface StorySection {
  /**
   * The event that will trigger this story section.
   */
  triggerEventName: string;

  /**
   * The location where the user must be for this story section to be
   * triggered.  If both leafAreaId and triggerEventName are specified,
   * then the user must be in the leaf area when the event is triggered
   * in order to trigger the story section.
   */
  leafAreaId?: string;

  /**
   * The route that the user should start on for this story.
   * Note: use this option sparingly because navigation "jumps", if
   * not designed thoughtfully, can disorient the user.
   */
  startingRoute?: string;

  /**
   * The statements that should be said during this story section.
   */
  statements: string[];

  /**
   * Whether the story's last word should stay up after the story is done.
   */
  isPersistent: boolean;

  /**
   * Whether this story section can be skipped, i.e. whether the current event could
   * trigger this story section or the next story section.
   * This is useful for cases where different story sections are designed for
   * different application states.  For example, a student might skip onboarding,
   * then set their rewards, then go through onboarding.  We would expect that the
   * onboarding would not ask the user to set the rewards they have already set, so
   * we can skip the "empty selections" part of the story and go directly to the
   * "selections completed" part of the story.
   */
  canSkip?: boolean;

  /**
   * The root area id whose navigation should be highlighted at the
   * start of this story section.
   */
  highlightRootAreaId?: string;

  /**
   * The leaf area id whose navigation should be highlighted at the
   * start of this story section.
   */
  highlightLeafAreaId?: string;

  /**
   * The event to trigger when this story section is done.
   */
  completionEvent?: string;
}
