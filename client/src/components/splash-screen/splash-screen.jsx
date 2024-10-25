import { useAuth } from "../../contexts/auth/auth";
import "./splash-screen.css";

export const SplashScreen = () => {
  const { isLoggedIn } = useAuth();
  return (
    !isLoggedIn && (
      <div className="splash-screen">
        <div></div>
        <div className="item">
          <i className="fa-solid fa-toggle-on fa-4x"></i>
          <h3>Omnisense</h3>
          <i className="fa-solid fa-slash fa-spin"></i>
        </div>
        <div className="item">
          <h4>Developed by</h4>
          <p>Justine Paralejas</p>
        </div>
      </div>
    )
  );
};
