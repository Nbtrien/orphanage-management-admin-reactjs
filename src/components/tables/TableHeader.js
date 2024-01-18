import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop } from '@coreui/icons'

const TableHeader = ({ columns, onSortClick, sortConfig, nowrapHeaderCells }) => {
  // console.log(onSortClick)
  const handleSortClick = (column) => {
    if (column.sortable) {
      onSortClick(column.key)
    }
  }
  const getSortIcon = (column) => {
    if (column.key === sortConfig.key) {
      if (sortConfig.direction === 'desc') {
        return (
          <>
            <CIcon className="icon-active" size="custom" icon={cilArrowBottom} />
            <CIcon size="custom" icon={cilArrowTop} />
          </>
        )
      } else {
        return (
          <>
            <CIcon size="custom" icon={cilArrowBottom} />
            <CIcon className="icon-active" size="custom" icon={cilArrowTop} />
          </>
        )
      }
    } else {
      return (
        <>
          <CIcon size="custom" icon={cilArrowBottom} />
          <CIcon size="custom" icon={cilArrowTop} />
        </>
      )
    }
  }
  return (
    <CTableHead>
      <CTableRow>
        {columns.map((column, columnIndex) => (
          <CTableHeaderCell
            key={columnIndex}
            scope="col"
            className={nowrapHeaderCells ? 'text-nowrap' : ''}
          >
            <CCol className="d-flex align-items-center justify-content-between">
              {column?.renderColumn ? (
                column.renderColumn()
              ) : (
                <div className="order-1">{column.title}</div>
              )}

              {column.sortable && (
                <div className="me-2 order-2 sort-icons" onClick={() => handleSortClick(column)}>
                  {getSortIcon(column)}
                </div>
              )}
            </CCol>
          </CTableHeaderCell>
        ))}
      </CTableRow>
    </CTableHead>
  )
}

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSortClick: PropTypes.func,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }),
  nowrapHeaderCells: PropTypes.bool,
}

export default React.memo(TableHeader)
