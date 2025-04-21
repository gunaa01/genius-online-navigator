import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch';

interface Guide {
  title: string;
  steps: string[];
  slug: string;
}

const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/content/guides/${slug}.json`)
      .then(async res => {
        if (!res.ok) {
          setError('Guide not found');
          return;
        }
        setGuide(await res.json());
      });
  }, [slug]);

  if (error) return <div className="error">{error}</div>;
  if (!guide) return <div>Loading...</div>;

  return (
    <div>
      <h2>{guide.title}</h2>
      <ol>
        {guide.steps.map((step, idx) => (
          <li key={idx}>
            <div dangerouslySetInnerHTML={{ __html: step }} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default GuideDetail;
