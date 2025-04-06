import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/",
    icon: "currency_exchange",
    label: "Конвертер валют",
  },
  {
    to: "/rates",
    icon: "trending_up",
    label: "Текущие курсы валют",
  },
];

export default function Navbar() {
  return (
    <nav className="bg-light shadow-sm mb-4">
      <div className="container">
        <ul className="nav nav-pills justify-content-center">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-bold" : "")
                }
              >
                <span className="material-symbols-outlined align-middle me-1">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
