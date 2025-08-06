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
  return React.createElement(
    motion.div,
    {
      className: "author-profile",
      variants: containerVariants,
      initial: "hidden",
      animate: "visible"
    },
    React.createElement(
      motion.div,
      {
        className: "author-header",
        variants: itemVariants
      },
      React.createElement(
        motion.img,
        {
          src: image,
          alt: name,
          className: "author-image",
          whileHover: { scale: 1.05 },
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }
      ),
      React.createElement(
        'div',
        { className: "author-info" },
        React.createElement(
          motion.h1,
          { variants: itemVariants },
          name
        ),
        React.createElement(
          motion.p,
          {
            className: "bio",
            variants: itemVariants
          },
          bio
        )
      )
    ),
    React.createElement(
      motion.div,
      {
        className: "author-stats",
        variants: itemVariants
      },
      Object.entries(stats).map(([key, value]) => React.createElement(
        motion.div,
        {
          key: key,
          className: "stat",
          whileHover: { y: -3 }
        },
        React.createElement(
          'span',
          { className: "stat-number" },
          value
        ),
        React.createElement(
          'span',
          { className: "stat-label" },
          key.charAt(0).toUpperCase() + key.slice(1)
        )
      ))
    )
  );
};

export default AuthorProfile;