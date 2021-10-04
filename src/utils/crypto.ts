import queryString from "query-string";
export const cypher = text => {
  try {
    return btoa(String(text));
  } catch (e) {
    return '';
  }
};
export const decypher = text => {
  try {
    return atob(String(text));
  } catch (e) {
    return '';
  }
};
export const decypherClass = () => {
  try {
    const {
      class: classCypher
    } = queryString.parse(window.location.search);
    const [classId, sectionId] = decypher(classCypher).split(':');
    return {
      classId,
      sectionId
    };
  } catch (e) {
    return {};
  }
};