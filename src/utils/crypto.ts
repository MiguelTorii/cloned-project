import queryString from 'query-string';

export const cypher = (text: string) => {
  try {
    return btoa(text);
  } catch (e) {
    return '';
  }
};

export const decypher = (text: string) => {
  try {
    return atob(text);
  } catch (e) {
    return '';
  }
};

export const decypherClass = () => {
  const { class: classCypher } = queryString.parse(window.location.search);
  const [classId, sectionId] = decypher(classCypher as string).split(':');
  return {
    classId: Number(classId),
    sectionId: Number(sectionId)
  };
};
