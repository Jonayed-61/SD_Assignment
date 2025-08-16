import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactionButton from '../ReactionButton/ReactionButton';
import './ArticleCard.css';

const REACTION_TYPES = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

const ArticleCard = ({ title, excerpt, date, reactions: initialReactions }) => {
  const [activeReaction, setActiveReaction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reactions, setReactions] = useState(initialReactions);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // Track user reactions to comments and replies
  const [userReactions, setUserReactions] = useState({
    comments: {},
    replies: {}
  });

  // Memoized reaction click handler
  const handleReactionClick = useCallback((reaction) => {
    setReactions(prev => {
      const newReactions = { ...prev };
      
      // Remove previous reaction if exists
      if (activeReaction) {
        newReactions[activeReaction] -= 1;
      }
      
      // Toggle reaction
      if (activeReaction !== reaction) {
        newReactions[reaction] = (newReactions[reaction] || 0) + 1;
        setActiveReaction(reaction);
      } else {
        setActiveReaction(null);
      }
      
      return newReactions;
    });
  }, [activeReaction]);

  // Memoized comment submission handler
  const handleCommentSubmit = useCallback((e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      date: new Date().toISOString(),
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?img=3',
      replies: [],
      reactions: Object.keys(REACTION_TYPES).reduce((acc, type) => {
        acc[type] = 0;
        return acc;
      }, {})
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  }, [newComment]);

  // Memoized reply submission handler
  const handleReplySubmit = useCallback((e, commentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now(),
      text: replyContent,
      date: new Date().toISOString(),
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?img=2',
      reactions: Object.keys(REACTION_TYPES).reduce((acc, type) => {
        acc[type] = 0;
        return acc;
      }, {})
    };

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] } 
        : comment
    ));

    setReplyContent('');
    setReplyingTo(null);
  }, [replyContent]);

  // Optimized reaction handler for comments and replies
  const handleCommentReaction = useCallback((commentId, reaction, isReply = false, parentCommentId = null) => {
    const reactionKey = isReply ? `reply_${commentId}` : `comment_${commentId}`;
    const reactionType = isReply ? 'replies' : 'comments';
    const currentReaction = userReactions[reactionType][reactionKey];

    setComments(prevComments => {
      return prevComments.map(comment => {
        // Handle replies
        if (isReply && comment.id === parentCommentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const newReactions = { ...reply.reactions };
                
                // Remove previous reaction if exists
                if (currentReaction) {
                  newReactions[currentReaction] -= 1;
                }
                
                // Add new reaction if different
                if (currentReaction !== reaction) {
                  newReactions[reaction] = (newReactions[reaction] || 0) + 1;
                }
                
                return { ...reply, reactions: newReactions };
              }
              return reply;
            })
          };
        }
        
        // Handle comments
        if (!isReply && comment.id === commentId) {
          const newReactions = { ...comment.reactions };
          
          // Remove previous reaction if exists
          if (currentReaction) {
            newReactions[currentReaction] -= 1;
          }
          
          // Add new reaction if different
          if (currentReaction !== reaction) {
            newReactions[reaction] = (newReactions[reaction] || 0) + 1;
          }
          
          return { ...comment, reactions: newReactions };
        }
        
        return comment;
      });
    });

    // Update user reactions state
    setUserReactions(prev => ({
      ...prev,
      [reactionType]: {
        ...prev[reactionType],
        [reactionKey]: currentReaction === reaction ? null : reaction
      }
    }));
  }, [userReactions]);

  // Memoized time formatter
  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  // Memoized reaction buttons renderer
  const renderReactionButtons = useCallback((commentId, isReply = false, parentCommentId = null) => {
    const reactionKey = isReply ? `reply_${commentId}` : `comment_${commentId}`;
    const currentReaction = userReactions[isReply ? 'replies' : 'comments'][reactionKey];

    return (
      <div className="reaction-buttons">
        {Object.entries(REACTION_TYPES).map(([type, emoji]) => (
          <button
            key={type}
            className={`reaction-btn ${currentReaction === type ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCommentReaction(commentId, type, isReply, parentCommentId);
            }}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }, [userReactions, handleCommentReaction]);

  // Memoized reaction counts renderer
  const renderReactionCounts = useCallback((reactionsObj) => {
    return Object.entries(reactionsObj)
      .filter(([_, count]) => count > 0)
      .map(([reaction, count]) => (
        <span key={reaction} className="reaction-count">
          {REACTION_TYPES[reaction]} {count}
        </span>
      ));
  }, []);

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
        <div className="comments-section facebook-style">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="comment-input-container">
              <img 
                src="https://i.pravatar.cc/150?img=3" 
                alt="Your avatar" 
                className="comment-avatar" 
              />
              <div className="comment-input-wrapper">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="comment-input"
                />
                <button 
                  type="submit" 
                  className="comment-submit" 
                  disabled={!newComment.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-thread">
                  <div className="comment">
                    <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatTime(comment.date)}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      
                      <div className="comment-actions">
                        {renderReactionButtons(comment.id)}
                        <button
                          className="comment-action reply-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyingTo(replyingTo === comment.id ? null : comment.id);
                          }}
                        >
                          Reply
                        </button>
                        <div className="comment-reactions">
                          {renderReactionCounts(comment.reactions)}
                        </div>
                      </div>

                      {replyingTo === comment.id && (
                        <form
                          onSubmit={(e) => handleReplySubmit(e, comment.id)}
                          className="reply-form"
                        >
                          <div className="comment-input-container">
                            <img 
                              src="https://i.pravatar.cc/150?img=2" 
                              alt="Your avatar" 
                              className="comment-avatar" 
                            />
                            <div className="comment-input-wrapper">
                              <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="reply-input"
                              />
                              <button 
                                type="submit" 
                                className="comment-submit" 
                                disabled={!replyContent.trim()}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                  <path fill="currentColor" d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {comment.replies.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="comment reply">
                          <img src={reply.avatar} alt={reply.author} className="comment-avatar" />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">{reply.author}</span>
                              <span className="comment-date">{formatTime(reply.date)}</span>
                            </div>
                            <p className="comment-text">{reply.text}</p>
                            
                            <div className="comment-actions">
                              {renderReactionButtons(reply.id, true, comment.id)}
                              <div className="comment-reactions">
                                {renderReactionCounts(reply.reactions)}
                              </div>
                            </div>
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