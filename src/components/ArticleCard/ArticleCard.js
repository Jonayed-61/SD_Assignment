import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactionButton from '../ReactionButton/ReactionButton';
import './ArticleCard.css';

const ArticleCard = ({ title, excerpt, date, reactions: initialReactions }) => {
  const [activeReaction, setActiveReaction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reactions, setReactions] = useState(initialReactions);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const handleReactionClick = (reaction) => {
    setReactions(prevReactions => {
      const newReactions = { ...prevReactions };
      if (activeReaction === reaction) {
        newReactions[reaction] -= 1;
        setActiveReaction(null);
      } else {
        if (activeReaction) {
          newReactions[activeReaction] -= 1;
        }
        newReactions[reaction] = (newReactions[reaction] || 0) + 1;
        setActiveReaction(reaction);
      }
      return newReactions;
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const comment = {
      id: Date.now(),
      text: newComment,
      date: new Date().toISOString(),
      author: 'You',
      replies: [],
      reactions: {
        like: 0,
        love: 0,
        laugh: 0
      }
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (replyContent.trim() === '') return;

    const reply = {
      id: Date.now(),
      text: replyContent,
      date: new Date().toISOString(),
      author: 'You',
      reactions: {
        like: 0,
        love: 0,
        laugh: 0
      }
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply]
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleCommentReaction = (commentId, reaction, isReply = false, parentCommentId = null) => {
    if (isReply) {
      setComments(comments.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const newReactions = { ...reply.reactions };
                newReactions[reaction] = (newReactions[reaction] || 0) + 1;
                return {
                  ...reply,
                  reactions: newReactions
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          const newReactions = { ...comment.reactions };
          newReactions[reaction] = (newReactions[reaction] || 0) + 1;
          return {
            ...comment,
            reactions: newReactions
          };
        }
        return comment;
      }));
    }
  };

  return (
    <motion.div
      className="article-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="article-content">
        <h3>{title}</h3>
        <p className={`excerpt ${isExpanded ? 'expanded' : ''}`}>
          {excerpt}
          {excerpt.length > 150 && (
            <button
              className="read-more"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
        <div className="meta">
          <span className="date">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <motion.div
        className="reactions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Object.entries(reactions).map(([reaction, count]) => (
          <ReactionButton
            key={reaction}
            reaction={reaction}
            count={count}
            active={activeReaction === reaction}
            onClick={handleReactionClick}
          />
        ))}
        <button
          className="comment-toggle"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide comments' : 'Show comments'}
          <span className="comment-count">
            ({comments.reduce((acc, comment) => acc + 1 + comment.replies.length, 0)})
          </span>
        </button>
      </motion.div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit">
              Post Comment
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-content">
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-meta">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">
                        {new Date(comment.date).toLocaleString()}
                      </span>
                    </div>

                    <div className="comment-reactions">
                      {Object.entries(comment.reactions)
                        .filter(([_, count]) => count > 0)
                        .map(([reaction, count]) => (
                          <button
                            key={reaction}
                            className="comment-reaction"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommentReaction(comment.id, reaction);
                            }}
                          >
                            {reaction === 'like' ? '👍' : reaction === 'love' ? '❤️' : '😂'} {count}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="comment-actions">
                    <button
                      className="reply-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                      }}
                    >
                      {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                    </button>
                    <button
                      className="react-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommentReaction(comment.id, 'like');
                      }}
                    >
                      👍 Like
                    </button>
                    <button
                      className="react-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommentReaction(comment.id, 'love');
                      }}
                    >
                      ❤️ Love
                    </button>
                    <button
                      className="react-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommentReaction(comment.id, 'laugh');
                      }}
                    >
                      😂 Laugh
                    </button>
                  </div>

                  {replyingTo === comment.id && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, comment.id)}
                      className="reply-form"
                    >
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="reply-input"
                      />
                      <div className="reply-actions">
                        <button
                          type="button"
                          className="cancel-reply"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="submit-reply">
                          Post Reply
                        </button>
                      </div>
                    </form>
                  )}

                  {comment.replies.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply">
                          <div className="reply-content">
                            <p className="reply-text">{reply.text}</p>
                            <div className="reply-meta">
                              <span className="reply-author">{reply.author}</span>
                              <span className="reply-date">
                                {new Date(reply.date).toLocaleString()}
                              </span>
                            </div>

                            <div className="reply-reactions">
                              {Object.entries(reply.reactions)
                                .filter(([_, count]) => count > 0)
                                .map(([reaction, count]) => (
                                  <button
                                    key={reaction}
                                    className="reply-reaction"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCommentReaction(reply.id, reaction, true, comment.id);
                                    }}
                                  >
                                    {reaction === 'like' ? '👍' : reaction === 'love' ? '❤️' : '😂'} {count}
                                  </button>
                                ))}
                            </div>
                          </div>

                          <div className="reply-actions">
                            <button
                              className="react-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommentReaction(reply.id, 'like', true, comment.id);
                              }}
                            >
                              👍 Like
                            </button>
                            <button
                              className="react-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommentReaction(reply.id, 'love', true, comment.id);
                              }}
                            >
                              ❤️ Love
                            </button>
                            <button
                              className="react-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommentReaction(reply.id, 'laugh', true, comment.id);
                              }}
                            >
                              😂 Laugh
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ArticleCard;