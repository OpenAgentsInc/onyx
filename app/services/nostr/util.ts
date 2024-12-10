export const objectId = (() => {
  // use this for debugging singleton issues, if any
  let currentId = 0;
  const map = new WeakMap();

  return (object: any) => {
    if (!map.has(object)) {
      map.set(object, ++currentId);
    }

    return map.get(object);
  };
})();
