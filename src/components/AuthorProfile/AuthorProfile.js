import { motion } from 'framer-motion';
import './AuthorProfile.css';
import React from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const AuthorProfile = ({ name, image, bio, stats }) => {
  return (
    <motion.div
      className="author-profile"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="author-header" variants={itemVariants}>
        <motion.img
          src={image}
          alt={name}
          className="author-image"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
        <div className="author-info">
          <motion.h1 variants={itemVariants}>{name}</motion.h1>
          <motion.p className="bio" variants={itemVariants}>
            {bio}
          </motion.p>
        </div>
      </motion.div>

      <motion.div className="author-stats" variants={itemVariants}>
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            className="stat"
            whileHover={{ y: -3 }}
          >
            <span className="stat-number">{value}</span>
            <span className="stat-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AuthorProfile;