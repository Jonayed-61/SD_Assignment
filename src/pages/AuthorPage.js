import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorProfile from '../components/AuthorProfile/AuthorProfile';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import Pagination from '../components/Pagination/Pagination';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import authorImage from '../assets/image.jpg';

const AuthorPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userReactions, setUserReactions] = useState({}); // Track user reactions
  
  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = 'user123';

  const author = {
    name: 'Jonayed Rifat',
    image: authorImage,
    bio: 'Technology writer and software developer with a passion for making complex topics accessible to everyone. Author of several books on web development and regular speaker at tech conferences worldwide.',
    stats: {
      articles: 42,
      followers: '1.2K',
      following: 56
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleReaction = (articleId, reactionType) => {
    setUserReactions(prev => {
      // If user already reacted to this article
      if (prev[articleId]) {
        // If clicking the same reaction, remove it (toggle)
        if (prev[articleId] === reactionType) {
          const newReactions = {...prev};
          delete newReactions[articleId];
          return newReactions;
        }
        // Otherwise, update to new reaction
        return {...prev, [articleId]: reactionType};
      }
      // Add new reaction
      return {...prev, [articleId]: reactionType};
    });
  };

  const generateDummyArticles = () => {
    const articles = [];
    const titles = [
      'Understanding React Hooks: A Comprehensive Guide',
      'The Future of Web Development in 2023',
      'CSS Grid vs Flexbox: When to Use Each',
      'TypeScript Best Practices for Large Applications',
      'Building Accessible Web Applications: A11y Fundamentals',
      'State Management Solutions Compared',
      'The Art of Code Review: Best Practices',
      'Microservices Architecture: Pros and Cons',
      'JavaScript Performance Optimization Techniques',
      'Responsive Design Patterns for Modern Web'
    ];

    const reactions = ['like', 'love', 'laugh', 'surprise', 'sad', 'angry'];

    for (let i = 0; i < 5; i++) {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
      
      const articleReactions = {};
      reactions.forEach(reaction => {
        articleReactions[reaction] = Math.floor(Math.random() * 50);
      });

      articles.push({
        id: i + (currentPage - 1) * 5,
        title: `${randomTitle}`,
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.',
        date: randomDate,
        reactions: articleReactions
      });
    }

    return articles;
  };

  const articles = generateDummyArticles();
  const totalArticles = 23;
  const totalPages = Math.ceil(totalArticles / 5);

  return (
    <div className="author-page">
      <header className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-title"
        >
          Author Profile
        </motion.h1>
        <ThemeToggle />
      </header>

      {!isLoading ? (
        <>
          <AuthorProfile
            name={author.name}
            image={author.image}
            bio={author.bio}
            stats={author.stats}
          />
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-title"
          >
            Recent Articles
          </motion.h2>
          
          <motion.div
            className="articles-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                reactions={article.reactions}
                userReaction={userReactions[article.id]} // Pass the user's current reaction
                onReaction={(reactionType) => handleReaction(article.id, reactionType)}
              />
            ))}
          </motion.div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setIsLoading(true);
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        <div className="loading-skeletons" />
      )}
    </div>
  );
};

export default AuthorPage;