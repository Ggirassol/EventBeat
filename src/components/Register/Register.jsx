import { auth, db } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { ref, set } from "firebase/database"; 
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { UserContext } from "../../../UserContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitRegistration = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        sendEmailVerification(userCredentials.user);
        alert("Please check your email inbox to verify your account and login!");
        navigate('/login', { replace: true });
        setUser(userCredentials)
        const userId = auth.currentUser.uid;
        set(ref(db, 'users/' + userId), {
          "email": email,
          "isStaff": false
        })
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert("Password should be at least 6 characters")
        }
        if (error.code === "auth/email-already-in-use") {
          if (auth.currentUser.emailVerified === true) {
            alert("This email is already associated to an account")
          } else {
            alert("Please check your email inbox to verify your account and login!");
            navigate("/login", { replace: true });
          }
        }
      });
  };

  return (
    <>
      <div className="register-form">
        <form className="form" onSubmit={onSubmitRegistration}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            value={email}
            onChange={handleEmail}
            id="email"
          ></input>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePassword}
            id="password"
            autoComplete="off"
          ></input>
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
