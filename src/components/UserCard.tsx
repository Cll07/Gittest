import React from 'react';

interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

const UserCard: React.FC<UserCardProps> = ({ name, email, avatar, role }) => {
  return (
    <div className="user-card">
      {avatar && <img src={avatar} alt={name} className="user-avatar" />}
      <div className="user-info">
        <h3 className="user-name">{name}</h3>
        <p className="user-email">{email}</p>
        <span className={`user-role role-${role}`}>{role}</span>
      </div>
    </div>
  );
};

export default UserCard;
