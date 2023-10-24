export default function slicing<T>(v: Array<T>, l: number, r: number) {
  const n = v.length;

  if (r > n) r = n;

  // assert that the parameters are ok
  if (l < 0 || l > r) throw new Error("Invalid l and r");

  const retArray = [];
  for (const [ix, elt] of v.entries()) {
    if (ix >= l && ix < r) {
      retArray.push(elt);
    }
  }

  return retArray;
}
