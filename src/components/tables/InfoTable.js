import React from 'react'
import {
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import get from 'lodash.get'

const InfoTable = (props) => {
  const { data, columns } = props

  return (
    <>
      <CTable striped borderColor="grey" align="middle" className="mb-3 border" hover responsive>
        <CTableHead>
          <CTableRow>
            {columns.map((column, columnIndex) => (
              <CTableHeaderCell
                key={columnIndex}
                scope="col"
                className={props.nowrapHeaderCells ? 'text-nowrap' : ''}
              >
                <CCol className="d-flex align-items-center justify-content-between">
                  <div className="order-1">{column.title}</div>
                </CCol>
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((item, itemIndex) => (
            <CTableRow key={itemIndex}>
              {columns.map((column, columnIndex) => {
                const value = get(item, column.key)
                return (
                  <CTableDataCell key={columnIndex}>
                    {column.render ? column.render(column, item) : value}
                  </CTableDataCell>
                )
              })}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

InfoTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
  nowrapHeaderCells: PropTypes.bool,
}
export default React.memo(InfoTable)
