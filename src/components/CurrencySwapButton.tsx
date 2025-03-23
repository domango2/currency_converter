import swapIcon from "../assets/icons/arrow-down-up.svg";

interface CurrencySwapButtonProps {
  onClick: () => void;
}

export default function CurrencySwapButton({
  onClick,
}: CurrencySwapButtonProps) {
  return (
    <div className="d-flex justify-content-center mb-3">
      <button
        onClick={onClick}
        className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
        title="Поменять валюты местами"
        style={{ width: "48px", height: "48px", padding: "0" }}
      >
        <img src={swapIcon} alt="Swap currencies" width="20" height="20" />
      </button>
    </div>
  );
}
