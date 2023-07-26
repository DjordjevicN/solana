import React, { InputHTMLAttributes } from "react"
import "./NumberInput.scss"

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  errorMessage?: string
  error: boolean
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  errorMessage,
  error,
  ...props
}) => {
  return (
    <div className="numberInput">
      {label && <label className="numberInput-label">{label}</label>}
      <input
        type="number"
        className={`numberInput-input ${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <div className="error-message">{errorMessage}</div>}
    </div>
  )
}

export default NumberInput
