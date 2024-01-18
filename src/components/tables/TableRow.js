import React from 'react'
import PropTypes from 'prop-types'
import { CTableRow } from '@coreui/react'
import TableRowCell from './TableRowCell'

const TableRow = ({ data, columns }) => {
  return (
    <>
      {data.map((item, itemIndex) => (
        <CTableRow key={itemIndex}>
          {columns.map((column, columnIndex) => (
            <TableRowCell key={columnIndex} item={item} column={column} />
          ))}
        </CTableRow>
      ))}
    </>
  )
}

TableRow.propTypes = {
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
}

export default React.memo(TableRow)
