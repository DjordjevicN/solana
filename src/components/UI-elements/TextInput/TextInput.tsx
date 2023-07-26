import React, { InputHTMLAttributes } from "react"
import "./TextInput.scss"

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  errorMessage?: string
  error: boolean
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  errorMessage,
  error,
  ...props
}) => {
  return (
    <div className="textInput">
      {label && <label className="textInput-label">{label}</label>}
      <input
        className={`textInput-input ${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <div className="error-message">{errorMessage}</div>}
    </div>
  )
}

export default TextInput
