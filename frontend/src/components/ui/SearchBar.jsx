import { FaSearch } from "react-icons/fa";
import Button from "./Button";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  buttonLabel = "Search",
  showButton = true,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) onSubmit();
  };

  return (
    <div className="search-bar animate-in" role="search">
      <FaSearch className="search-bar__icon" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {showButton && (
        <Button type="button" onClick={onSubmit}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
