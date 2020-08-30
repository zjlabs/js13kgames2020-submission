// TODO: Add nested obj support.
export function getDiff(base, compare) {
  const diff = {};

  Object.keys(base).forEach((key) => {
    if (compare[key] == null) {
      diff[key] = base[key];
    }

    if (compare[key] !== base[key]) {
      diff[key] = compare[key];
    }
  });

  Object.keys(compare).forEach((key) => {
    if (base[key] == null) {
      diff[key] = compare[key];
    }
  });

  if (Object.keys(diff).length === 0) {
    return null;
  }

  return diff;
}
