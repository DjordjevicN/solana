import React, { ButtonHTMLAttributes } from "react"
import "./Button.scss"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: "primary" | "secondary" | "disabled"
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  ...props
}) => {
  let buttonClass = "button"

  switch (variant) {
    case "primary":
      buttonClass += " button-primary"
      break
    case "secondary":
      buttonClass += " button-secondary"
      break
    case "disabled":
      buttonClass += " button-disabled"
      break
    default:
      break
  }

  return (
    <button className={buttonClass} {...props}>
      {label}
    </button>
  )
}

export default Button
