import starIcon from "@/assets/icons/star.svg";
import starFillIcon from "@/assets/icons/star-fill.svg";

export default function FavoriteButton({ isFavorite, onClick }) {
  return (
    <button
      className="btn p-0 ms-2"
      onClick={onClick}
      title="Добавить/убрать из избранного"
    >
      <img
        src={isFavorite ? starFillIcon : starIcon}
        alt="Favorite"
        width="16"
        height="16"
      />
    </button>
  );
}
