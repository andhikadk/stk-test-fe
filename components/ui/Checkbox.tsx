import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  containerClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, containerClassName = '', className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || `checkbox-${generatedId}`;

    return (
      <div className={`flex items-center gap-2 ${containerClassName}`}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`
            w-4 h-4 text-primary-500 rounded
            border-gray-300
            focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${className}
          `}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
