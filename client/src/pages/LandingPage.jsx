import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/landingpage.module.css";

const LandingPage = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const navigate = useNavigate();
  const texts = ["Let's", "get", "started"];

  useEffect(() => {
    if (!isRevealed) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRevealed]);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {!isRevealed ? (
          <motion.div
            style={{ width: "fit-content" }}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTextIndex}
                className={styles.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                {texts[currentTextIndex]}
              </motion.h1>
            </AnimatePresence>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.button
                className={styles.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReveal}
              >
                Reveal
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className={`absolute inset-0 flex justify-center items-center ${styles.revealed}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className={styles.revealed_title}>Welcome to Your Journey on ProCode</h2>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <motion.button
                  className={styles.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                >
                  Begin
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BackgroundAnimation isRevealed={isRevealed} />
    </div>
  );
};

const BackgroundAnimation = ({ isRevealed }) => {
  return (
    <div className="absolute inset-0">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.circle}
          style={{
            width: `${(i + 1) * 30}vw`,
            height: `${(i + 1) * 30}vw`,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={
            isRevealed
              ? { scale: 0, opacity: 0 }
              : {
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }
          }
          transition={
            isRevealed
              ? { duration: 0.5 }
              : {
                  rotate: {
                    duration: 20 + i * 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                  scale: {
                    duration: 5 + i * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }
          }
        />
      ))}
    </div>
  );
};

export default LandingPage;
