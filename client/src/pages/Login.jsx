import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import side_image from "../assets/image.png";
import logo from "../assets/Code-Editor-Logo.png";
import styles from "../css/login.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    try {
      const response = await axios.post(`${apiUrl}/auth/normal-login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status) {
        Cookies.set("sessionData", JSON.stringify(response.data.user), {
          path: "/",
          secure: true,
          expires: 1,
        });
        Cookies.set("sessionId", response.data.user._id, {
          path: "/",
          secure: true,
          expires: 1,
        });
        navigate(`/userinfo?id=${response.data.user._id}`);
      }
    } catch (error) {
      alert("Invalid Credentials");
      console.error(error);
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const loginwithgoogle = () => {
    window.open(`${apiUrl}/auth/google/callback`, "_self");
  };

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles["image-section"]}>
        <img
          src={side_image || "/placeholder.svg"}
          alt="Login illustration"
          className={styles["login-image"]}
        />
      </div>
      <div className={styles["form-section"]}>
        <div className={styles["logo-container"]}>
          <img src={logo || "/placeholder.svg"} className={styles.logo} />
          <h1>ProCode</h1>
        </div>
        <h2>Welcome to ProCode</h2>
        <h4>Please sign in to your account and start coding</h4>

        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.btn}>
            Login
          </button>
          <div className={styles["create-account"]}>
            Don't have an account?{" "}
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Create one
            </a>
          </div>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <div className={styles["google-login"]} onClick={loginwithgoogle}>
            <div className={styles["icon-box"]}>
              <svg className={styles["icon"]} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              <h5>Login with Google</h5>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
