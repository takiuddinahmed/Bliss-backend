/**
 * update for subDocument Array
 * if newItems is a dynamic type then it would occure some problem
 * @param {schema} currentDocs - The current document that needs to update.
 * @param {schema} newItems - New data transfer object that needs to merge with current document.
 * @returns {schema} the updated document.
 */
export function subDocUpdateWithArray(currentDocs, newItems) {
  const replacedDocs = [];
  let isReplaced = false;
  newItems.map((item) => {
    if (typeof item === 'object') {
      if (item.hasOwnProperty('_id')) {
        if (item.hasOwnProperty('isDeleted') && item.isDeleted) {
          currentDocs = currentDocs.filter((doc) => doc._id != item['_id']);
        } else {
          currentDocs = currentDocs.map((doc) =>
            item['_id'] == doc._id ? item : doc,
          );
        }
      } else {
        currentDocs.push(item);
      }
    } else if (typeof item == 'string' || typeof item == 'number') {
      replacedDocs.push(item);
      isReplaced = true;
    } else {
      currentDocs.push(item);
    }
  });

  return isReplaced ? replacedDocs : currentDocs;
}

/**
 * update for subDocument object
 * @param {schema} currentDoc - The current document that needs to update.
 * @param {schema} newItem - New data transfer object that needs to merge with current document.
 * @returns {schema} the updated document.
 */
export function subDocUpdateWithObj(currentDoc, newItem) {
  if (newItem && newItem.hasOwnProperty('isDeleted') && newItem.isDeleted) {
    currentDoc = {};
  } else {
    const keys = Object.keys(newItem);
    keys.map((key) => {
      if (
        !(newItem[key] == null || newItem[key] == undefined) &&
        typeof newItem[key] === 'object' &&
        !Array.isArray(newItem[key])
      ) {
        const currentSubDoc =
          (currentDoc[key] && currentDoc[key]._doc) || currentDoc[key] || {};
        newItem[key] = subDocUpdateWithObj(currentSubDoc, newItem[key]);
        currentDoc[key] = newItem[key];
      } else if (Array.isArray(newItem[key]) && newItem[key].length > 0) {
        currentDoc[key] = subDocUpdateWithArray(currentDoc[key], newItem[key]);
      } else {
        currentDoc[key] = newItem[key];
      }
    });
  }
  return currentDoc;
}
