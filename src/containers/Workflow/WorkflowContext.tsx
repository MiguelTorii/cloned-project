import React from 'react';

// TODO set a proper default value for the context
// See also https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
const WorkflowContext = React.createContext(undefined);
export const WorkflowProvider = WorkflowContext.Provider;
export const WorkflowConsumer = WorkflowContext.Consumer;
export default WorkflowContext;
