import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormSelect } from '@coreui/react'

const FSelectInput = ({
  id,
  label,
  name,
  value,
  onChange,
  options,
  invalid,
  errorMessage,
  readOnly,
}) => {
  return (
    <>
      <CFormSelect
        id={id}
        name={name}
        onChange={onChange}
        defaultValue={value}
        invalid={invalid}
        disabled={readOnly}
      >
        {!value && (
          <option disabled selected>
            {label}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} selected={option.value == value}>
            {option.label}
          </option>
        ))}
      </CFormSelect>
      <CFormFeedback invalid>{errorMessage}</CFormFeedback>
    </>
  )
}

FSelectInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
  readOnly: PropTypes.any,
}

FSelectInput.defaultProps = {
  invalid: false,
  readOnly: false,
}

export default FSelectInput
