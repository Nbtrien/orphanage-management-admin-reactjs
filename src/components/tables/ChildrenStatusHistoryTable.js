import React, { useEffect, useState } from 'react'
import { CFormCheck, CLink, CTable, CTableBody } from '@coreui/react'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { PropTypes } from 'prop-types'

const ChildrenStatusHistoryTable = ({ childrenId }) => {
  const childrenApi = childrenService()
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [changeCount, setChangeCount] = useState(0)

  useEffect(() => {
    const getStatusHistory = async () => {
      try {
        const response = await childrenApi.getStatusHistory(childrenId)
        setData(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getStatusHistory()
  }, [childrenId, changeCount])

  useEffect(() => {
    const columns1 = [
      {
        key: 'status_history_id',
        title: '',
        render: (_, { status_history_id }) => (
          <CFormCheck
            // checked={checkedState[status_history_id]}
            id="checkboxNoLabel"
            value={status_history_id}
            aria-label="..."
            // onChange={() => handleIdCBChange(status_history_id)}
          />
        ),
        renderColumn: () => (
          <CFormCheck
            // checked={checkAllState}
            id="checkboxNoLabel"
            aria-label="..."
            // onChange={handleCheckAllClick}
          />
        ),
      },
      {
        key: 'status_history_id',
        title: 'ID',
        render: (_, { status_history_id }) => <>#{status_history_id}</>,
      },
      {
        key: 'start_date',
        title: 'Từ ngày',
        render: (_, { start_date }) => <>{format(new Date(start_date), 'dd/MM/yyyy')}</>,
      },
      {
        key: 'end_date',
        title: 'Đến ngày',
        render: (_, { end_date }) => (
          <>{end_date ? format(new Date(end_date), 'dd/MM/yyyy') : 'Nay'}</>
        ),
      },
      {
        key: 'status_name',
        title: 'Trạng thái',
      },
      {
        key: 'description',
        title: 'Chi tiết',
      },
    ]

    if (childrenId && data.length > 0) {
      setColumns(columns1)
    }
  }, [childrenId, data])

  return (
    <>
      {data?.length > 0 && (
        <CTable
          striped
          bordered
          borderColor="light"
          align="middle"
          className="mb-3 border table-border-custom "
          hover
          responsive
        >
          <TableHeader
            columns={columns}
            nowrapHeaderCells={true}
            sortConfig={{ key: '', direction: '' }}
          />
          <CTableBody>
            <TableRow data={data} columns={columns} />
          </CTableBody>
        </CTable>
      )}
    </>
  )
}

ChildrenStatusHistoryTable.propTypes = {
  childrenId: PropTypes.any,
}

export default ChildrenStatusHistoryTable
