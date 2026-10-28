import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterMenu } from './FilterMenu'

const fields = [
  { key: 'status', label: 'Status', options: ['Activated', 'Deactivated'] },
  { key: 'country', label: 'Country', options: ['France', 'Germany'] },
]

describe('FilterMenu Molecule', () => {
  it('opens the filter popover when the button is clicked', async () => {
    render(<FilterMenu fields={fields} values={{}} onChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /filter/i }))
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
  })

  it('calls onChange with the selected option', async () => {
    const handleChange = vi.fn()
    render(<FilterMenu fields={fields} values={{}} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: /filter/i }))
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Deactivated')
    expect(handleChange).toHaveBeenCalledWith({ status: 'Deactivated' })
  })

  it('shows the active filter count and clears all filters', async () => {
    const handleChange = vi.fn()
    render(<FilterMenu fields={fields} values={{ country: 'France' }} onChange={handleChange} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /filter/i }))
    await userEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(handleChange).toHaveBeenCalledWith({})
  })
})
