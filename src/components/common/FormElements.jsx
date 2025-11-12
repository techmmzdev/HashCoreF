import React, { forwardRef } from "react";
import { useInputStyles } from "@/hooks/useStyles";

/**
 * Componente Input reutilizable con soporte completo para iconos, errores y temas
 */
const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      value,
      onChange,
      onBlur,
      placeholder,
      required = false,
      disabled = false,
      error,
      icon: Icon,
      size = "md",
      variant = "default",
      maxLength,
      minLength,
      autoComplete,
      autoFocus = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const styles = useInputStyles({
      hasIcon: !!Icon,
      hasError: !!error,
      size,
      variant,
    });

    return (
      <div className={`${styles.container} ${className}`}>
        {label && (
          <label htmlFor={name} className={styles.label}>
            {label}
            {required && <span className={styles.labelRequired}> *</span>}
          </label>
        )}

        <div className={Icon ? styles.container : ""}>
          {Icon && (
            <div className={styles.icon}>
              <Icon className={styles.iconElement} />
            </div>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className={styles.input}
            {...props}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * Componente Select reutilizable
 */
const Select = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      error,
      options = [],
      placeholder = "Seleccionar...",
      size = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const styles = useInputStyles({
      hasError: !!error,
      size,
    });

    return (
      <div className={className}>
        {label && (
          <label htmlFor={name} className={styles.label}>
            {label}
            {required && <span className={styles.labelRequired}> *</span>}
          </label>
        )}

        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={styles.select}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

          {children}
        </select>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

/**
 * Componente Textarea reutilizable
 */
const Textarea = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      required = false,
      disabled = false,
      error,
      rows = 4,
      maxLength,
      showCharCount = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const styles = useInputStyles({
      hasError: !!error,
    });

    return (
      <div className={className}>
        {label && (
          <label htmlFor={name} className={styles.label}>
            {label}
            {required && <span className={styles.labelRequired}> *</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={styles.textarea}
          {...props}
        />

        {showCharCount && maxLength && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            {(value || "").length}/{maxLength}
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/**
 * Componente Checkbox reutilizable
 */
const Checkbox = forwardRef(
  (
    {
      label,
      name,
      checked,
      onChange,
      required = false,
      disabled = false,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    const styles = useInputStyles({
      hasError: !!error,
    });

    return (
      <div className={className}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={styles.checkbox}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
              {required && <span className={styles.labelRequired}> *</span>}
            </span>
          )}
        </label>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Input, Select, Textarea, Checkbox };
