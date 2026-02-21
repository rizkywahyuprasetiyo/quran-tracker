import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ResetModal from './ResetModal';

describe('ResetModal', () => {
  it('does not render when closed', () => {
    render(<ResetModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.queryByText('Reset Semua Data?')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ResetModal isOpen={true} onClose={onClose} onConfirm={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Batal' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm and onClose when confirmed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ResetModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: 'Ya, Reset Data' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
