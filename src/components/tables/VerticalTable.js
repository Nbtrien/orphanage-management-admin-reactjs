import React from 'react'
import get from 'lodash.get'
import { CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import PropTypes from 'prop-types'
const VerticalTable = ({ columns, data }) => {
  return (
    <div className="vertical-table">
      {columns.map((column, index) => {
        const value = get(data, column.key)
        return (
          <CTable bordered key={index}>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row" className="custom-header-cell">
                  {column.title}
                </CTableHeaderCell>
                <CTableDataCell>
                  {column.render ? column.render(column, data) : value}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )
      })}
      {/* <CTable bordered>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row" className="custom-header-cell">
              Heading 1
            </CTableHeaderCell>
            <CTableDataCell>Row 1</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <CTable bordered>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row" className="custom-header-cell">
              Heading 1
            </CTableHeaderCell>
            <CTableDataCell>Row 1</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <CTable bordered>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row" className="custom-header-cell">
              Heading 1
            </CTableHeaderCell>
            <CTableDataCell>Row 1</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable> */}
    </div>
  )
}

VerticalTable.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
}

export default VerticalTable
