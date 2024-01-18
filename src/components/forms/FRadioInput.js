import React from 'react'
import PropTypes from 'prop-types'
import { CFormCheck, CFormFeedback } from '@coreui/react'

const FRadioInput = ({ id, value, name, onChange, options, invalid, errorMessage }) => {
  return (
    <>
      {options.map((option) => (
        <CFormCheck
          inline
          key={option.value}
          id={`${id}_${option.value}`}
          name={name}
          label={option.label}
          value={option.value}
          checked={value == option.value}
          onChange={onChange}
          invalid={invalid}
        />
      ))}
      <CFormFeedback invalid>{errorMessage}</CFormFeedback>
    </>
  )
}

FRadioInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    }),
  ),
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
}
FRadioInput.defaultProps = {
  invalid: false,
}

export default FRadioInput
