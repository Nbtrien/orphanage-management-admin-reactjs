import React from 'react'
import PropTypes from 'prop-types'
import { CFormFloating, CFormInput, CFormLabel } from '@coreui/react'

const FloatingInputRow = ({ label, value }) => {
  return (
    <CFormFloating className="mb-2">
      <CFormInput
        className="bg-light border-light form-control-readonly-custom"
        size="md"
        type="text"
        value={value}
        readOnly
      />
      <CFormLabel className="label-floating-custom">{label}</CFormLabel>
    </CFormFloating>
  )
}

FloatingInputRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default FloatingInputRow
