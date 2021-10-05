import React, { createContext, useState } from 'react';

export const FlashcardListContext = createContext(null);
export const FlashcardListContextProvider = ({ children }) => {
  const [activeFlashcard, setActiveFlashcard] = useState({
    index: null,
    card: null
  });
  return (
    <FlashcardListContext.Provider
      value={{
        activeFlashcard,
        setActiveFlashcard
      }}
    >
      {children}
    </FlashcardListContext.Provider>
  );
};
