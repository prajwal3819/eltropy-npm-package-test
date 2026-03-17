import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('should render tabs and their content', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeVisible();
    expect(screen.getByText('Tab 2')).toBeVisible();

    // Tab 1 is default, so its content should be visible
    expect(screen.getByText('Content 1')).toBeVisible();

    // Tab 2 content exists in DOM but is hidden, so we check visibility
    expect(screen.getByText('Content 2')).not.toBeVisible();
  });

  // 1. Make the test async
  it('should switch tabs on click', async () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs>
    );

    // 2. Click the actual tab role rather than just the text
    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    fireEvent.click(tab2);

    // 3. Wait for the state transition to finish applying to the DOM
    await waitFor(() => {
      expect(screen.getByText('Content 2')).toBeVisible();
      expect(screen.getByText('Content 1')).not.toBeVisible();
    });
  });

  it('should not switch to a disabled tab', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2" disabled>
            Tab 2
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs>
    );

    const disabledTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(disabledTab).toBeDisabled();

    fireEvent.click(disabledTab);

    // Verify it did not switch
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).not.toBeVisible();
  });

  it('should render a badge on a normal tab', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1" badge={5}>
            Tab 1
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );

    expect(screen.getByText('5')).toBeVisible();
  });

  it('should still render a badge when the tab is disabled', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2" disabled badge={12}>
            Tab 2
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );

    const disabledTab = screen.getByRole('tab', { name: /tab 2/i });
    expect(disabledTab).toBeDisabled();

    expect(screen.getByText('12')).toBeVisible();
  });
});
