export function rearrangeFavorites(
  prevFavorites: string[],
  draggedCurrency: string,
  targetCurrency: string
): string[] {
  const updatedFavorites = [...prevFavorites];
  const draggedIndex = updatedFavorites.indexOf(draggedCurrency);
  const targetIndex = updatedFavorites.indexOf(targetCurrency);
  updatedFavorites.splice(draggedIndex, 1);
  updatedFavorites.splice(targetIndex, 0, draggedCurrency);
  return updatedFavorites;
}
