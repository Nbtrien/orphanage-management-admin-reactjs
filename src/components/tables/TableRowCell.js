import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import { CTableDataCell } from '@coreui/react'

const TableRowCell = ({ item, column }) => {
  const value = get(item, column.key)
  return <CTableDataCell> {column.render ? column.render(column, item) : value}</CTableDataCell>
}

TableRowCell.propTypes = {
  item: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
}

export default React.memo(TableRowCell)
