export interface FilterMenuField {
  key: string
  label: string
  options: string[]
}

export interface FilterMenuProps {
  fields: FilterMenuField[]
  /** Selected option per field key; an empty string means no filter for that field */
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
  className?: string
}
