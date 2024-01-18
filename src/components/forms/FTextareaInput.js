import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormTextarea } from '@coreui/react'

const FTextareaInput = ({ label, id, value, name, onChange, rows, invalid, errorMessage }) => {
  return (
    <>
      <CFormTextarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        invalid={invalid}
        placeholder={label}
      />
      <CFormFeedback invalid>{errorMessage}</CFormFeedback>
    </>
  )
}

FTextareaInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
}

FTextareaInput.defaultProps = {
  rows: 3,
  invalid: false,
}

export default FTextareaInput
