import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/apiFetch';

interface CommunityPost {
  title: string;
  author: string;
  body: string;
  event_date?: string;
  image?: string;
  slug: string;
}

const CommunityList: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/content/community/index.json') // Assumes posts exported as JSON
      .then(async res => {
        if (!res.ok) {
          setError('Failed to load community posts');
          return;
        }
        setPosts(await res.json());
      });
  }, []);

  return (
    <div>
      <h2>Community</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <a href={`/community/${post.slug}`}>{post.title}</a> by {post.author}
            {post.event_date && <span> | Event: {post.event_date}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityList;
