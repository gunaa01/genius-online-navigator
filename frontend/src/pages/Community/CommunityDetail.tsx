import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch';

interface CommunityPost {
  title: string;
  author: string;
  body: string;
  event_date?: string;
  image?: string;
  slug: string;
}

const CommunityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/content/community/${slug}.json`)
      .then(async res => {
        if (!res.ok) {
          setError('Post not found');
          return;
        }
        setPost(await res.json());
      });
  }, [slug]);

  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p><b>By:</b> {post.author}</p>
      {post.event_date && <p><b>Event Date:</b> {post.event_date}</p>}
      {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: 400 }} />}
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </div>
  );
};

export default CommunityDetail;
