import React from "react"
import "./Dropdown.scss"

interface Option {
  uiAmount: string
  mint: string
}

interface DropdownProps {
  label?: string
  options: Option[]
  onChange: (selectedToken: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onChange }) => {
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChange(event.target.value)
  }

  return (
    <div className="dropdown">
      {label && <label className="dropdown-label">{label}</label>}
      <select className="dropdown-select" onChange={handleDropdownChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.mint} value={option.mint}>
            {`${option.mint} - ${option.uiAmount} `}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
