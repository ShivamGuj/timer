import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // Default primary variant
  });
  
  it('renders with specified variant', () => {
    render(<Button variant="danger">Delete</Button>);
    
    const button = screen.getByRole('button', { name: 'Delete' });
    
    expect(button).toHaveClass('bg-red-50');
    expect(button).toHaveClass('text-red-600');
  });
  
  it('renders with specified size', () => {
    render(<Button size="large">Large Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Large Button' });
    
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
  });
  
  it('renders with icon', () => {
    const mockIcon = <div data-testid="test-icon">Icon</div>;
    
    render(<Button icon={mockIcon}>With Icon</Button>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });
  
  it('renders icon-only button', () => {
    const mockIcon = <div data-testid="test-icon">Icon</div>;
    
    render(<Button icon={mockIcon} size="icon" />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('rounded-full');
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn(); // Use vi.fn() instead of jest.fn()
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('respects disabled state', () => {
    const handleClick = vi.fn();
    
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: 'Disabled' });
    
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-60'); // Updated to match actual class
    
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('applies additional className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass('custom-class');
  });
});
