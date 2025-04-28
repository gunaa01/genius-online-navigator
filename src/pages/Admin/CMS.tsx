import React from 'react';

const CMS: React.FC = () => {
  return (
    <div>
      <h3>CMS Content Management</h3>
      <p>
        Manage static pages, guides, community posts, and more using Decap CMS.<br />
        <a href="/admin/cms/config">Edit CMS Config</a>
      </p>
      {/* Optionally embed Decap CMS admin UI here via iframe or link */}
      <iframe
        src="/admin/decap/"
        title="Decap CMS Admin"
        style={{ width: '100%', height: 600, border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default CMS;
