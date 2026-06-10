/**
 * @param {ObjectManager} manager
 */
export function expandGridIfNeeded(manager) {
  if (manager.objects.size === 0) return;

  const maxCol = [...manager.objects.keys()]
    .map(key => parseInt(key.split('-')[0], 10))
    .reduce((max, col) => Math.max(max, col), -Infinity);

  if (maxCol >= manager.grid.cols - 1) {
    manager.grid.extendCols(20);
  }
}
