import { motion } from 'framer-motion';
import './ReactionButton.css';
import React from 'react';

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
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {},
        transition: { duration: 0.6 }
      },
      emojis[reaction]
    ),
    React.createElement(
      'span',
      { className: "count" },
      count
    )
  );
};

export default ReactionButton;