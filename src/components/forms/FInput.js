import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormInput } from '@coreui/react'

const FInput = ({ type, id, label, onChange, value, invalid, errorMessage, name }) => {
  return (
    <>
      <CFormInput
        type={type}
        id={id}
        name={name}
        value={value}
        placeholder={label}
        onChange={onChange}
        autoComplete="new-password"
        invalid={invalid}
      />
      <CFormFeedback invalid>{errorMessage}</CFormFeedback>
    </>
  )
}
FInput.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.any,
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
}

FInput.defaultProps = {
  invalid: false,
}

export default FInput
