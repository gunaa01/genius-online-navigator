import React from 'react';

interface UserProfileCardProps {
  name: string;
  bio?: string;
  skills?: string[];
  type: 'freelancer' | 'recruiter' | 'applicant';
  extra?: React.ReactNode;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ name, bio, skills, type, extra }) => {
  return (
    <div className="user-profile-card">
      <h3>{name} <span style={{ fontSize: 12, color: '#888' }}>({type})</span></h3>
      {bio && <p>{bio}</p>}
      {skills && skills.length > 0 && <p><b>Skills:</b> {skills.join(', ')}</p>}
      {extra}
    </div>
  );
};

export default UserProfileCard;
