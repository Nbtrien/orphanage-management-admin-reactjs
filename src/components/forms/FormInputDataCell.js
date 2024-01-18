import React from 'react'
import FSelectInput from './FSelectInput'
import FFileInput from './FFileInput'
import PropTypes from 'prop-types'
import FInput from './FInput'
import { CCol, CFormLabel, CTableDataCell, CTableRow } from '@coreui/react'
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

const FormInputDataCell = ({ ...props }) => {
  const type = props.type
  const xsCol = props.xsCol

  const { id, label } = props
  const Component = inputComponents[type] || inputComponents.default
  return (
    <CTableRow>
      <CTableDataCell className="form-table-label">{label}</CTableDataCell>
      <CTableDataCell>
        <Component {...props} />
      </CTableDataCell>
    </CTableRow>
  )
}
FormInputDataCell.propTypes = {
  type: PropTypes.any,
  xsCol: PropTypes.number,
  id: PropTypes.string,
  label: PropTypes.any,
}

FormInputDataCell.defaultProps = {
  xsCol: 12,
}

export default FormInputDataCell
