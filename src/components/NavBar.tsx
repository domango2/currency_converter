import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-light shadow-sm mb-4">
      <div className="container">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item me-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-bold" : "")
              }
            >
              <span className="material-symbols-outlined align-middle me-1">
                currency_exchange
              </span>
              Конвертер валют
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/rates"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-bold" : "")
              }
            >
              <span className="material-symbols-outlined align-middle me-1">
                trending_up
              </span>
              Текущие курсы валют
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
