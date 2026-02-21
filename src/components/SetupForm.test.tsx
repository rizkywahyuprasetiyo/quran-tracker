import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import SetupForm from './SetupForm';

describe('SetupForm', () => {
  it('renders default target information', () => {
    render(<SetupForm />);

    expect(screen.getByText('Quran Tracker')).toBeInTheDocument();
    expect(screen.getByText(/Total Halaman: 604 halaman/)).toBeInTheDocument();
  });

  it('updates target info when hatam count changes', async () => {
    const user = userEvent.setup();
    render(<SetupForm />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '3');

    expect(screen.getByText(/Total Halaman: 1812 halaman/)).toBeInTheDocument();
  });
});
