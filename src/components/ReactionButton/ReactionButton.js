import React from 'react';
import { motion } from 'framer-motion';
import './ReactionButton.css';

const ReactionButton = ({ reaction, count, active, onClick }) => {
  const emojis = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    surprise: '😮',
    sad: '😢',
    angry: '😠'
  };

  return React.createElement(
    motion.button,
    {
      className: `reaction-button ${active ? 'active' : ''}`,
      onClick: () => onClick(reaction),
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.9 },
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: "spring", stiffness: 500, damping: 20 },
      'aria-label': reaction
    },
    React.createElement(
      motion.span,
      {
        className: "emoji",
        animate: active ? {
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0]
        } : {},
        transition: { duration: 0.4 }
      },
      emojis[reaction]
    ),
    React.createElement(
      motion.span,
      {
        className: "count",
        key: count, // This helps animate count changes
        initial: { scale: 1.5, y: -5 },
        animate: { scale: 1, y: 0 },
        transition: { duration: 0.2 }
      },
      count
    )
  );
};

export default ReactionButton;