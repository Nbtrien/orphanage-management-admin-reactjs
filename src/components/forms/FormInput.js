import React from 'react'
import FSelectInput from './FSelectInput'
import FFileInput from './FFileInput'
import PropTypes from 'prop-types'
import FInput from './FInput'
import { CCol, CFormLabel } from '@coreui/react'
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

const FormInput = ({ ...props }) => {
  const type = props.type
  const xsCol = props.xsCol

  const { id, label } = props
  const Component = inputComponents[type] || inputComponents.default
  return (
    <CCol xs={xsCol}>
      <CFormLabel className="d-block" htmlFor={id}>
        {label}
      </CFormLabel>
      <Component {...props} />
    </CCol>
  )
}
FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  xsCol: PropTypes.number,
  id: PropTypes.string,
  label: PropTypes.string,
}

FormInput.defaultProps = {
  xsCol: 12,
}

export default FormInput
