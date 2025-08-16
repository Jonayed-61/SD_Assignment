import { motion } from 'framer-motion';
import './Pagination.css';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return React.createElement(
    motion.div,
    {
      className: "pagination",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.2 }
    },
    React.createElement(
      motion.button,
      {
        onClick: () => onPageChange(currentPage - 1),
        disabled: currentPage === 1,
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      },
      '« Prev'
    ),
    startPage > 1 && [
      React.createElement(
        motion.button,
        {
          key: 'first',
          onClick: () => onPageChange(1),
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        },
        '1'
      ),
      startPage > 2 && React.createElement(
        'span',
        { key: 'ellipsis1', className: "ellipsis" },
        '...'
      )
    ],
    pages.map((page) => React.createElement(
      motion.button,
      {
        key: page,
        onClick: () => onPageChange(page),
        className: currentPage === page ? 'active' : '',
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      },
      page
    )),
    endPage < totalPages && [
      endPage < totalPages - 1 && React.createElement(
        'span',
        { key: 'ellipsis2', className: "ellipsis" },
        '...'
      ),
      React.createElement(
        motion.button,
        {
          key: 'last',
          onClick: () => onPageChange(totalPages),
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        },
        totalPages
      )
    ],
    React.createElement(
      motion.button,
      {
        onClick: () => onPageChange(currentPage + 1),
        disabled: currentPage === totalPages,
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      },
      'Next »'
    )
  );
};

export default Pagination;