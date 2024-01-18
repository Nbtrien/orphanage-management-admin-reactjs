import React from 'react'
import FSelectInput from './FSelectInput'
import FFileInput from './FFileInput'
import PropTypes from 'prop-types'
import FInput from './FInput'
import { CCol, CFormLabel, CRow } from '@coreui/react'
import FMultiSelectInput from './FMiltiSelectInput'
import FRadioInput from './FRadioInput'
import FTextareaInput from './FTextareaInput'

const inputComponents = {
  select: FSelectInput,
  multiselect: FMultiSelectInput,
  file: FFileInput,
  radio: FRadioInput,
  textarea: FTextareaInput,
  default: FInput,
}

const HorizontalFormInput = ({ ...props }) => {
  const type = props.type
  const xsCol = props.xsCol

  const { id, label } = props
  const Component = inputComponents[type] || inputComponents.default
  return (
    <CCol xs={xsCol}>
      <CRow className="mb-3">
        <CFormLabel htmlFor={id} className="col-sm-2 col-form-label">
          {label}
        </CFormLabel>
        <CCol sm={10}>
          <Component {...props} />
        </CCol>
      </CRow>
    </CCol>
  )
}
HorizontalFormInput.propTypes = {
  type: PropTypes.string.isRequired,
  xsCol: PropTypes.number,
  id: PropTypes.string,
  label: PropTypes.string,
}

HorizontalFormInput.defaultProps = {
  xsCol: 12,
}

export default HorizontalFormInput
