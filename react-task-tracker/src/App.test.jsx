import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import App from './App';

describe('Task Tracker App', () => {
  beforeEach(() => {
    // Clear localStorage before each test run so state doesn't leak between tests
    localStorage.clear();
  });

  test('renders initial default tasks when localStorage is empty', () => {
    render(<App />);

    // Check header text
// Replace line 17 with this:
    expect(screen.getByRole('heading', { level: 1, name: 'Task Tracker' })).toBeInTheDocument();
    expect(screen.getByText(/1 of 2 completed/i)).toBeInTheDocument();

    // Check default task items are present
    expect(screen.getByText('Master React state and useEffect')).toBeInTheDocument();
    expect(screen.getByText('Push Task Tracker project to GitHub')).toBeInTheDocument();
  });

  test('allows user to add a new task', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/What needs to be done\?/i);
    const addButton = screen.getByRole('button', { name: /Add/i });

    // Type a new task and click submit
    fireEvent.change(input, { target: { value: 'Write Vitest Unit Tests' } });
    fireEvent.click(addButton);

    // Verify task was prepended to list and input field was cleared
    expect(screen.getByText('Write Vitest Unit Tests')).toBeInTheDocument();
    expect(input.value).toBe('');
    expect(screen.getByText(/1 of 3 completed/i)).toBeInTheDocument();
  });

  test('toggles task completion status when checkbox is clicked', () => {
    render(<App />);

    // Get the second task checkbox (initially uncompleted)
    const checkboxes = screen.getAllByRole('checkbox');
    const secondTaskCheckbox = checkboxes[1];

    expect(secondTaskCheckbox).not.toBeChecked();

    // Click checkbox to complete
    fireEvent.click(secondTaskCheckbox);

    expect(secondTaskCheckbox).toBeChecked();
    expect(screen.getByText(/2 of 2 completed/i)).toBeInTheDocument();
  });

  test('deletes a task when the delete button is clicked', () => {
    render(<App />);

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });

    // Delete the first task
    fireEvent.click(deleteButtons[0]);

    // Verify task is removed
    expect(screen.queryByText('Master React state and useEffect')).not.toBeInTheDocument();
    expect(screen.getByText(/0 of 1 completed/i)).toBeInTheDocument();
  });

  test('filters tasks correctly by status', () => {
    render(<App />);

    const activeFilterBtn = screen.getByRole('button', { name: /ACTIVE/i });
    const completedFilterBtn = screen.getByRole('button', { name: /COMPLETED/i });

    // Filter to active tasks only
    fireEvent.click(activeFilterBtn);
    expect(screen.getByText('Push Task Tracker project to GitHub')).toBeInTheDocument();
    expect(screen.queryByText('Master React state and useEffect')).not.toBeInTheDocument();

    // Filter to completed tasks only
    fireEvent.click(completedFilterBtn);
    expect(screen.getByText('Master React state and useEffect')).toBeInTheDocument();
    expect(screen.queryByText('Push Task Tracker project to GitHub')).not.toBeInTheDocument();
  });

  test('loads initial state from localStorage if available', () => {
    const customTasks = [
      { id: 99, text: 'Custom LocalStorage Task', completed: false, category: 'Personal' },
    ];
    localStorage.setItem('app_tasks', JSON.stringify(customTasks));

    render(<App />);

    expect(screen.getByText('Custom LocalStorage Task')).toBeInTheDocument();
    expect(screen.queryByText('Master React state and useEffect')).not.toBeInTheDocument();
  });
});