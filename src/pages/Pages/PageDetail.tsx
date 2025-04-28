import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch';

interface PageContent {
  title: string;
  body: string;
  image?: string;
  slug: string;
}

const PageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/content/pages/${slug}.json`)
      .then(async res => {
        if (!res.ok) {
          setError('Page not found');
          return;
        }
        setPage(await res.json());
      });
  }, [slug]);

  if (error) return <div className="error">{error}</div>;
  if (!page) return <div>Loading...</div>;

  return (
    <div>
      <h2>{page.title}</h2>
      {page.image && <img src={page.image} alt={page.title} style={{ maxWidth: 400 }} />}
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </div>
  );
};

export default PageDetail;
