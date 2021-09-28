import queryString from 'query-string';

export const cypher = (text) => {
  try {
    return btoa(String(text));
  } catch (e) {
    return '';
  }
};

export const decypher = (text) => {
  try {
    return atob(String(text));
  } catch (e) {
    return '';
  }
};

export const decypherClass = () => {
  const { class: classCypher } = queryString.parse(window.location.search);
  const [classId, sectionId] = decypher(classCypher).split(':');
  return {
    classId: Number(classId),
    sectionId: Number(sectionId)
  };
};
