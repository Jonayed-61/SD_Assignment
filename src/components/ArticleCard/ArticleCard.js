import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ReactionButton from '../ReactionButton/ReactionButton';
import './ArticleCard.css';

const ArticleCard = ({ title, excerpt, date, reactions }) => {
  const [activeReaction, setActiveReaction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReactionClick = (reaction) => {
    setActiveReaction(activeReaction === reaction ? null : reaction);
  };

  return React.createElement(
    motion.div,
    {
      className: "article-card",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: { y: -5 },
      transition: { type: "spring", stiffness: 300 }
    },
    React.createElement(
      'div',
      { className: "article-content" },
      React.createElement('h3', null, title),
      React.createElement(
        'p',
        { className: `excerpt ${isExpanded ? 'expanded' : ''}` },
        excerpt,
        excerpt.length > 150 && React.createElement(
          'button',
          {
            className: "read-more",
            onClick: () => setIsExpanded(!isExpanded)
          },
          isExpanded ? 'Show less' : 'Read more'
        )
      ),
      React.createElement(
        'div',
        { className: "meta" },
        React.createElement(
          'span',
          { className: "date" },
          new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        )
      )
    ),
    React.createElement(
      motion.div,
      {
        className: "reactions",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 }
      },
      Object.entries(reactions).map(([reaction, count]) => React.createElement(
        ReactionButton,
        {
          key: reaction,
          reaction: reaction,
          count: count,
          active: activeReaction === reaction,
          onClick: handleReactionClick
        }
      ))
    )
  );
};

export default ArticleCard;