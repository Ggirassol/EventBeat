import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useContext } from "react";
import { UserContext } from "../../../UserContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function logout() {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/", { replace: true });
      })
      .catch(() => {
        Alert("An error occured during Logout. Try again later");
      });
  }

  return (
    <button className="logout-btn" onClick={logout}>
      Logout
    </button>
  );
};

export default Logout;
