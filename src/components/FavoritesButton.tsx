interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

export default function FavoriteButton({
  isFavorite,
  onClick,
}: FavoriteButtonProps) {
  return (
    <button
      className="btn p-0 ms-2"
      onClick={onClick}
      title="Добавить/убрать из избранного"
    >
      <img
        src={isFavorite ? "/star-fill.svg" : "/star.svg"}
        alt="Favorite"
        width="16"
        height="16"
      />
    </button>
  );
}
