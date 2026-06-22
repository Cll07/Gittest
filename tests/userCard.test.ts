import { render, screen } from '@testing-library/react';
import UserCard from '../src/components/UserCard';

describe('UserCard', () => {
  const defaultProps = {
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'user' as const,
  };

  it('should render user name and email', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
  });

  it('should display correct role badge', () => {
    render(<UserCard {...defaultProps} role="admin" />);
    expect(screen.getByText('admin')).toHaveClass('role-admin');
  });

  it('should not render avatar when not provided', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.queryByRole('img')).toBeNull();
  });
});
