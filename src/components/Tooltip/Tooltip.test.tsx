import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';

describe('Tooltip', () => {
  it('renders children (trigger) correctly', () => {
    render(
      <Tooltip content="More info">
        <button>Hover me</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button', { name: /hover me/i });
    expect(trigger).toBeInTheDocument();
  });

  it('shows tooltip content on hover', async () => {
    render(
      <Tooltip content="Tooltip message">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /hover me/i });

    // Content should not be visible initially
    expect(screen.queryByText('Tooltip message')).not.toBeInTheDocument();

    // Trigger the tooltip
    fireEvent.mouseOver(trigger);

    // Wait for the portal/content to be rendered
    await waitFor(() => {
      expect(screen.getByText('Tooltip message')).toBeInTheDocument();
    });
  });

  it('does not render tooltip functionality when disabled', async () => {
    render(
      <Tooltip content="Tooltip message" disabled>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /hover me/i });
    fireEvent.mouseOver(trigger);

    // Wait slightly to ensure it truly doesn't appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByText('Tooltip message')).not.toBeInTheDocument();
  });

  it('just renders children when content is empty', async () => {
    render(
      <Tooltip content={null}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /hover me/i });
    fireEvent.mouseOver(trigger);

    await new Promise((resolve) => setTimeout(resolve, 100));
    // No content to find, test simply verifies it doesn't crash and trigger is there
    expect(trigger).toBeInTheDocument();
  });

  it('renders correctly without an arrow', async () => {
    render(
      <Tooltip content="No arrow here" showArrow={false}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseOver(trigger);

    await waitFor(() => {
      expect(screen.getByText('No arrow here')).toBeInTheDocument();
    });
  });

  it('renders with different placements without crashing', async () => {
    const { unmount } = render(
      <Tooltip content="Top placement" placement="top-start">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    unmount();

    render(
      <Tooltip content="Bottom placement" placement="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
