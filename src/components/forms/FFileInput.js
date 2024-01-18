import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormInput } from '@coreui/react'

const FFileInput = ({ id, label, name, onChange, invalid, errorMessage, ...props }) => {
  return (
    <>
      <CFormInput
        type="file"
        name={name}
        id={id}
        onChange={onChange}
        invalid={invalid}
        {...props}
      />
      <CFormFeedback invalid>{errorMessage}</CFormFeedback>
    </>
  )
}
FFileInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
}

FFileInput.defaultProps = {
  invalid: false,
}

export default FFileInput
