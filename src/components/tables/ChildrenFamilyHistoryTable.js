import React, { useEffect, useState } from 'react'
import { CFormCheck, CLink, CTable, CTableBody } from '@coreui/react'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { PropTypes } from 'prop-types'

const ChildrenFamilyHistoryTable = ({ childrenId }) => {
  const childrenApi = childrenService()
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [changeCount, setChangeCount] = useState(0)

  useEffect(() => {
    const getFamilyHistory = async () => {
      try {
        const response = await childrenApi.getFamilyHistory(childrenId)
        setData(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getFamilyHistory()
  }, [childrenId, changeCount])

  useEffect(() => {
    const columns1 = [
      {
        key: 'family_history_id',
        title: '',
        render: (_, { family_history_id }) => (
          <CFormCheck
            // checked={checkedState[family_history_id]}
            id="checkboxNoLabel"
            value={family_history_id}
            aria-label="..."
            // onChange={() => handleIdCBChange(family_history_id)}
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
        key: 'family_id',
        title: 'ID',
        render: (_, { family_id }) => <>#{family_id}</>,
      },
      {
        key: 'mother_start_date',
        title: 'Từ ngày',
        render: (_, { mother_start_date }) => (
          <>{format(new Date(mother_start_date), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'mother_end_date',
        title: 'Đến ngày',
        render: (_, { mother_end_date }) => (
          <>{mother_end_date ? format(new Date(mother_end_date), 'dd/MM/yyyy') : 'Nay'}</>
        ),
      },
      {
        key: 'family_name',
        title: 'Gia đình',
      },
      {
        key: 'mother_name',
        title: 'Bà mẹ quản lý',
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

ChildrenFamilyHistoryTable.propTypes = {
  childrenId: PropTypes.any,
}

export default ChildrenFamilyHistoryTable
