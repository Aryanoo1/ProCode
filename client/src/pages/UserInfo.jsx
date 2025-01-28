import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaUserGraduate, FaBriefcase } from "react-icons/fa";
import styles from "../css/userinfo.module.css";
import logo from "../assets/Code-Editor-Logo.png";
import Cookies from "js-cookie";
import axios from "axios";
// import Loading from "../components/Loading";

const UserInfo = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [institution, setInstitution] = useState("");
  const [company, setCompany] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const getUser = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id");
  
      // Check if userId exists in the URL
      if (userId) {
        const response = await axios.get(`${apiUrl}/api/user/user-details`, {
          params: {
            id: userId,
          },
        });
  
        const user = response.data.user;
  
        if (user) {
          // If the user has a username and it is different from the email
          if (user?.username && user.username !== user.email) {
            if (user.user_type === "student" || user.user_type === "working_professional") {
              // If the user does not have an institution or company, set to step 3
              if (!user?.institution && !user?.company) {
                setUsername(user.username);
                setUserType(user.user_type);
                setStep(3); // Go to step 3
              } else {
                // Store session data in cookies and redirect to dashboard
                Cookies.set("sessionData", JSON.stringify(user), {
                  path: "/",
                  secure: true,
                  expires: 1,
                });
                navigate("/dashboard");
              }
            } else {
              // If the user type is not student or working professional, go to step 2
              setUsername(user.username);
              setStep(2); // Go to step 2
            }
          } else {
            // If the user has no username or username is the same as email
            // Store session data in cookies and proceed with step 1
            Cookies.set("sessionId", user._id, {
              path: "/",
              secure: true,
              expires: 1,
            });
            setUsername(user.email);
            setUserId(user._id);
            setStep(1); // Go to step 1
          }
        } else {
          console.log("Error: User data not found");
          navigate("/"); // Redirect to home page if no user data is found
        }
      } else {
        // If no userId in the URL, try using sessionId from cookies
        const id = Cookies.get("sessionId");
        if (id) {
          setUsername("your email");
          setUserId(id);
        } else {
          console.log("Error: User data not available");
          navigate("/"); // Redirect to home page if no sessionId is found
        }
      }
    } catch (error) {
      // Handle error if the API call fails or something else goes wrong
      console.log("Error parsing user data:", error);
      navigate("/"); // Redirect to home page on error
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

  // if (isLoading) {
  //   return <Loading isDarkMode={false} />;
  // }

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
                  required
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
