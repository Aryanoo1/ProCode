import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaPencilAlt } from "react-icons/fa";
import "../css/register.css";
import Cookies from "js-cookie";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const particlesRef = useRef(null);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const loginwithgoogle = () => {
    window.open(`${apiUrl}/auth/google/callback`, "_self");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initParticles();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initParticles = () => {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#6c63ff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 40, size_min: 0.1, sync: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#6c63ff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false },
        },
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", fileInputRef.current.files[0]);

    try {
      const response = await fetch(`${apiUrl}/auth/normal-register`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        Cookies.set("sessionId", result.userId, {
          path: "/",
          secure: true,
          expires: 1,
        });

        navigate(`/userinfo?id=${result.userId}`);
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

  return (
    <div className="register-container">
      <div className="form-container">
        <h1>Register Now</h1>
        <form onSubmit={handleSubmit}>
          <div className="image-upload">
            <label htmlFor="image-upload">
              <div className="image-circle">
                {image ? (
                  <img src={image || "/placeholder.svg"} alt="User" />
                ) : (
                  <div className="placeholder">Upload Image</div>
                )}
                <FaPencilAlt className="edit-icon" />
              </div>
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              required
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>

        <div className="create-account">
          Already have an account? <Link to="/login">Login</Link>
        </div>

        <div className="or-divider">
          <span>OR</span>
        </div>
        <div className="google-login" onClick={loginwithgoogle}>
          <FaGoogle className="google-icon" />
          Sign up with Google
        </div>
      </div>

      <div id="particles-js" ref={particlesRef}></div>
    </div>
  );
};

export default Register;
