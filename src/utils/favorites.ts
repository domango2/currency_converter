export const loadFavorites = (): string[] => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

export const saveFavorites = (favorites: string[]): void => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};
