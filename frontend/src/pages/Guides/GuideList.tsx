import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/apiFetch';

interface Guide {
  title: string;
  steps: string[];
  slug: string;
}

const GuideList: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/content/guides/index.json') // Assumes guides are exported as JSON for frontend
      .then(async res => {
        if (!res.ok) {
          setError('Failed to load guides');
          return;
        }
        setGuides(await res.json());
      });
  }, []);

  return (
    <div>
      <h2>Offline-to-Online Guides</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {guides.map(guide => (
          <li key={guide.slug}>
            <a href={`/guides/${guide.slug}`}>{guide.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuideList;
