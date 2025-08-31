import React, { ReactNode } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  className = "",
  ...props
}: InputProps) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}
    ${iconLeft ? "pl-10" : ""}
    ${iconRight ? "pr-10" : ""}
    ${className}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {iconLeft}
          </span>
        )}
        <input className={inputClasses} {...props} />
        {iconRight && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}
