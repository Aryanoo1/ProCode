import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaUserGraduate, FaBriefcase } from "react-icons/fa";
import styles from "../css/userinfo.module.css";
import logo from "../assets/Code-Editor-Logo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../components/Loading";

const UserInfo = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [institution, setInstitution] = useState("");
  const [company, setCompany] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const getUser = async () => {
    try {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id");

      // Check if userId exists in the URL
      let response = {};
      if (userId) {
        response = await axios.get(`${apiUrl}/api/users/user-details`, {
          params: {
            id: userId,
          },
        });
        if (response.status === 200) {
          if (
            response.data.user?.username &&
            response.data.user.username !== response.data.user.email
          ) {
            if (
              response.data.user.user_type === "student" ||
              response.data.user.user_type === "working_professional"
            ) {
              if (
                !response.data.user?.institution &&
                !response.data.user?.company
              ) {
                setUsername(response.data.user.username);
                setUserType(response.data.user.user_type);
                setStep(3);
                setIsLoading(false);
              } else {
                Cookies.set("sessionData", JSON.stringify(response.data.user), {
                  path: "/",
                  secure: true,
                  expires: 1,
                });

                navigate("/dashboard");
              }
            } else {
              setUsername(response.data.user.username);
              setStep(2);
              setIsLoading(false);
            }
          }
          Cookies.set("sessionId", response.data.user._id, {
            path: "/",
            secure: true,
            expires: 1,
          });
          setUsername(response.data.user.email);
          setUserId(response.data.user._id);
          setIsLoading(false);
        }
      }
    } catch (error) {
      const id = Cookies.get("sessionId");
      if (id) {
        setUsername("your email");
        setUserId(id);
        setIsLoading(false);
      } else {
        console.log("error", error);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userId,
      username,
      user_type: userType,
      institution,
      company,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/auth/register-user-info`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        Cookies.set("sessionData", JSON.stringify(response.data.user), {
          path: "/",
          secure: true,
          expires: 1,
        });

        navigate("/dashboard");
      } else {
        const error = await response.json();
        console.error("Error:", error);
        alert(error.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return <Loading isDarkMode={false} />;
  }

  return (
    <div className={styles["username-creation-container"]}>
      <div
        className={`${styles["username-creation-form-container"]} ${
          styles[`username-creation-step-${step}`]
        }`}
      >
        <img
          className={styles["username-creation-logo"]}
          src={logo || "/placeholder.svg"}
          alt="Logo"
        />

        {step === 1 && (
          <div className={styles["username-creation-form-content"]}>
            <h1 className={styles["username-creation-title"]}>
              Create Your Username
            </h1>
            <h2 className={styles["username-creation-subtitle"]}>
              Pick a unique username to represent yourself on ProCode
            </h2>
            <div className={styles["username-creation-info-box"]}>
              <FaInfoCircle className={styles["username-creation-icon"]} />
              <span>
                Your username should be 6-20 characters long, contain only
                letters, numbers, or underscores, and be unique.
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className={styles["username-creation-form-group"]}>
                <label
                  htmlFor="username"
                  className={styles["username-creation-label"]}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className={styles["username-creation-input"]}
                  placeholder={`Enter your username (default: ${username})`}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button type="submit" className={styles["username-creation-btn"]}>
                Confirm & Next
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className={styles["username-creation-form-content"]}>
            <h1 className={styles["username-creation-title"]}>
              Tell Us About Yourself
            </h1>
            <h2 className={styles["username-creation-subtitle"]}>
              Are you a student or a working professional?
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className={styles["username-creation-user-type-container"]}>
                <div
                  className={`${styles["username-creation-user-type-box"]} ${
                    userType === "student" ? styles["selected"] : ""
                  }`}
                  onClick={() => setUserType("student")}
                >
                  <FaUserGraduate
                    className={styles["username-creation-user-type-icon"]}
                  />
                  <span>Student</span>
                </div>
                <div
                  className={`${styles["username-creation-user-type-box"]} ${
                    userType === "working_professional"
                      ? styles["selected"]
                      : ""
                  }`}
                  onClick={() => setUserType("working_professional")}
                >
                  <FaBriefcase
                    className={styles["username-creation-user-type-icon"]}
                  />
                  <span>Working Professional</span>
                </div>
              </div>
              <div className={styles["username-creation-button-group"]}>
                <button
                  type="button"
                  className={`${styles["username-creation-btn"]} ${styles["username-creation-btn-secondary"]}`}
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className={styles["username-creation-btn"]}
                  disabled={!userType}
                >
                  Confirm & Next
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className={styles["username-creation-form-content"]}>
            <h1 className={styles["username-creation-title"]}>
              {userType === "student" ? "Your Institution" : "Your Company"}
            </h1>
            <h2 className={styles["username-creation-subtitle"]}>
              {userType === "student"
                ? "What institution are you studying at?"
                : "Where do you work?"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles["username-creation-form-group"]}>
                <label
                  htmlFor={userType === "student" ? "institution" : "company"}
                  className={styles["username-creation-label"]}
                >
                  {userType === "student" ? "Institution Name" : "Company Name"}
                </label>
                <input
                  type="text"
                  id={userType === "student" ? "institution" : "company"}
                  className={styles["username-creation-input"]}
                  placeholder={
                    userType === "student"
                      ? "Enter your institution name"
                      : "Enter your company name"
                  }
                  required
                  value={userType === "student" ? institution : company}
                  onChange={(e) =>
                    userType === "student"
                      ? setInstitution(e.target.value)
                      : setCompany(e.target.value)
                  }
                />
              </div>
              <div className={styles["username-creation-button-group"]}>
                <button
                  type="button"
                  className={`${styles["username-creation-btn"]} ${styles["username-creation-btn-secondary"]}`}
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className={styles["username-creation-btn"]}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className={styles["username-creation-footer"]}>
        <p>
          Need help?{" "}
          <a href="#" className={styles["username-creation-link"]}>
            Contact Us
          </a>{" "}
          |{" "}
          <a href="#" className={styles["username-creation-link"]}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
