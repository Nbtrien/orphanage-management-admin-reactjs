import React from 'react'
import {
  CButton,
  CButtonGroup,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
} from '@coreui/react'
import PropTypes from 'prop-types'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import { Pagination, Limits } from 'src/constants/Pagination'

const BorderedTable = (props) => {
  const { data, columns } = props
  const { sortConfig, onSortClick } = props
  const {
    handleSelectAllClick,
    handleDeleteAllClick,
    handleDeselectAllClick,
    handleLimitChange,
    handleSearchChange,
  } = props

  return (
    <>
      <CRow>
        <CCol xs={12} sm={12} md={4} lg={6} xl={2} className="mb-1">
          <CForm>
            <CRow>
              <CFormLabel
                htmlFor="inputEmail3"
                className="col-sm-3 col-md-4 col-3  col-form-label text-nowrap"
              >
                Hiển thị
              </CFormLabel>
              <CCol md={8} sm={9} xs={9}>
                <CFormSelect
                  defaultValue={Pagination.limit}
                  className="col-form-label"
                  size="sm"
                  aria-label="Large select example"
                  onChange={(e) => handleLimitChange(e.target.value)}
                >
                  {Limits.map((limit, key) => (
                    <option value={limit} key={key}>
                      {limit}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CCol>
        <CCol xs={12} sm={12} md={8} lg={6} xl={6}>
          <CButtonGroup className="d-flex flex-wrap gap-2">
            <CButton color="primary" shape="rounded-0" className="" onClick={handleSelectAllClick}>
              Chọn tất cả
            </CButton>
            <CButton
              color="secondary"
              shape="rounded-0"
              className=""
              onClick={handleDeselectAllClick}
            >
              Bỏ chọn tất cả
            </CButton>
            <CButton color="danger" shape="rounded-0" className="" onClick={handleDeleteAllClick}>
              Xóa đã chọn
            </CButton>
          </CButtonGroup>
        </CCol>
        <CCol xs={12} sm={12} md={12} lg={6} xl={4}>
          <CForm>
            <CRow>
              <CFormLabel
                htmlFor="inputSearch"
                className="col-md-4 col-sm-3 col-xs-3 col-3 col-form-label"
              >
                Tìm kiếm:
              </CFormLabel>
              <CCol md={8} sm={9} xs={9} className="col-form-label">
                <CFormInput
                  size="sm"
                  type="text"
                  id="inputSearch"
                  onChange={(e) => {
                    handleSearchChange(e.target.value)
                  }}
                />
              </CCol>
            </CRow>
          </CForm>
        </CCol>
      </CRow>
      <CTable striped borderColor="grey" align="middle" className="mb-3 border" hover responsive>
        <TableHeader
          columns={columns}
          onSortClick={onSortClick}
          sortConfig={sortConfig}
          nowrapHeaderCells={props.nowrapHeaderCells}
        />
        <CTableBody>
          <TableRow data={data} columns={columns} />
        </CTableBody>
      </CTable>
    </>
  )
}

BorderedTable.propTypes = {
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
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }),
  onSortClick: PropTypes.func,
  handleSelectAllClick: PropTypes.func.isRequired,
  handleDeleteAllClick: PropTypes.func.isRequired,
  handleDeselectAllClick: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  nowrapHeaderCells: PropTypes.bool,
}
export default React.memo(BorderedTable)
