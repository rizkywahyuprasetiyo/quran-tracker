import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ActualPositionInput from './ActualPositionInput';

describe('ActualPositionInput', () => {
  it('renders edit form by default without current values', () => {
    render(
      <ActualPositionInput
        onSave={vi.fn()}
        onClear={vi.fn()}
      />
    );

    expect(screen.getByText('Input Posisi Bacaan Aktual')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simpan Posisi' })).toBeInTheDocument();
  });

  it('submits selected page and line', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <ActualPositionInput
        onSave={onSave}
        onClear={vi.fn()}
      />
    );

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], '21');
    await user.selectOptions(selects[1], '9');
    await user.click(screen.getByRole('button', { name: 'Simpan Posisi' }));

    expect(onSave).toHaveBeenCalledWith(21, 9);
  });

  it('renders view mode and allows clear', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <ActualPositionInput
        onSave={vi.fn()}
        onClear={onClear}
        currentPage={40}
        currentLine={6}
      />
    );

    expect(screen.getByText('Posisi Bacaan Aktual')).toBeInTheDocument();
    expect(screen.getByText('Hal. 40')).toBeInTheDocument();
    expect(screen.getByText('Baris 6')).toBeInTheDocument();

    await user.click(screen.getByTitle('Hapus posisi'));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Input Posisi Bacaan Aktual')).toBeInTheDocument();
  });
});
