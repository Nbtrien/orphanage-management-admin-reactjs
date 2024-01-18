import { CFormInput, CTableDataCell, CTableRow } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'
const DataCellRow = ({ label, value }) => {
  return (
    <CTableRow>
      <CTableDataCell className="form-table-label">{label}</CTableDataCell>
      <CTableDataCell>
        <CFormInput value={value} readOnly />
      </CTableDataCell>
    </CTableRow>
  )
}
DataCellRow.propTypes = {
  label: PropTypes.any,
  value: PropTypes.any,
}

export default DataCellRow
