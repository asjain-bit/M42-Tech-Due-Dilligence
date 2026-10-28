import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FilterMenu } from './FilterMenu'

const meta: Meta<typeof FilterMenu> = {
  title: 'Molecules/FilterMenu',
  component: FilterMenu,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof FilterMenu>

const fields = [
  { key: 'vendor', label: 'Vendor name', options: ['Presight AI', 'Directus Inc.'] },
  { key: 'status', label: 'Status', options: ['Activated', 'Deactivated'] },
  { key: 'country', label: 'Country', options: ['France', 'United Arab Emirates'] },
]

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [values, setValues] = useState<Record<string, string>>({})
      return (
        <div className="flex justify-end h-10">
          <FilterMenu fields={fields} values={values} onChange={setValues} />
        </div>
      )
    }
    return <Demo />
  },
}
