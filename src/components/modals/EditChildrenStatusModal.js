import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import childrenService from 'src/api/services/childrenService'
import validator from 'validator'
import FormInputDataCell from '../forms/FormInputDataCell'

const EditChildrenStatusModal = ({
  childrenId,
  childrenName,
  childrenStatus,
  isWaitingAdoption,
  isVisible,
  setVisible,
  handleResult,
}) => {
  const childrenApi = childrenService()

  const [status, setStatus] = useState([])
  const [adoptionValue, setAdoptionValue] = useState()
  const [statusValue, setStatusValue] = useState()

  const [saveBtnDisabled, setSaveBtnDisbled] = useState(true)

  const [formData, setFormData] = useState({
    status_id: null,
    start_date: '',
    end_date: '',
    note: '',
  })

  const [formValidate, setFormValidate] = useState({
    status_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn trạng thái',
    },
    start_date: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày bắt đầu',
    },
    end_date: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày kết thúc',
    },
    note: {
      invalid: false,
      errorMessage: 'Vui lòng nhập chi tiết',
    },
  })
  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await childrenApi.getChildrenStatusOptions(childrenId)
        setStatus(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getStatus()
  }, [childrenId, childrenStatus])

  useEffect(() => {
    let isValid =
      formData.status_id &&
      formData.start_date &&
      formData.end_date &&
      formData.note &&
      !formValidate.status_id.invalid &&
      !formValidate.start_date.invalid &&
      !formValidate.end_date.invalid &&
      !formValidate.note.invalid

    setFormValid(isValid)
  }, [formData, formValidate])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })

    let isFieldValid = validator.isEmpty(value)

    setFormValidate({
      ...formValidate,
      [name]: {
        ...formValidate[name],
        invalid: isFieldValid,
      },
    })
  }

  const handleSubmit = async () => {
    // let result = true
    // if (statusValue != curentStatus.children_status_id) {
    //   const data = {
    //     children_status_id: statusValue,
    //   }
    //   try {
    //     await childrenApi.updateStatus(childrenId, JSON.stringify(data))
    //   } catch (error) {
    //     console.log(error)
    //     result = false
    //   }
    // }
    // if (adoptionValue != isWaitingAdoption) {
    //   try {
    //     await childrenApi.updateAdoptionStatus(childrenId, adoptionValue)
    //   } catch (error) {
    //     console.log(error)
    //     result = false
    //   }
    // }
    // handleResult(result)
  }

  const inputs = [
    {
      type: 'select',
      id: 'status_id',
      name: 'status_id',
      label: 'Trạng thái mới*',
      value: formData.status_id,
      onChange: handleInputChange,
      invalid: formValidate.status_id.invalid,
      errorMessage: formValidate.status_id.errorMessage,
      options: status.map((state) => ({
        label: state.children_status_name,
        value: state.children_status_id,
      })),
    },
    {
      type: 'date',
      id: 'start_date',
      name: 'start_date',
      label: 'Ngày bắt đầu trạng thái mới*',
      value: formData.start_date,
      onChange: handleInputChange,
      invalid: formValidate.start_date.invalid,
      errorMessage: formValidate.start_date.errorMessage,
    },
    {
      type: 'date',
      id: 'end_date',
      name: 'end_date',
      label: 'Ngày kết thúc trạng thái cũ*',
      value: formData.end_date,
      onChange: handleInputChange,
      invalid: formValidate.end_date.invalid,
      errorMessage: formValidate.end_date.errorMessage,
    },
    {
      type: 'textarea',
      id: 'note',
      name: 'note',
      label: 'Chi tiết*',
      value: formData.note,
      onChange: handleInputChange,
      invalid: formValidate.note.invalid,
      errorMessage: formValidate.note.errorMessage,
    },
  ]

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      size="xl"
      onClose={() => setVisible()}
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Trẻ - {childrenName}</div>
      </CModalHeader>
      <CModalBody>
        <div className="header-title-sub-custom mb-2">Cập nhật trạng thái</div>
        <CRow>
          <CForm>
            <CTable responsive bordered className="form-table overflow-hidden table-border-2">
              <CTableBody>
                {inputs.map((input, index) => (
                  <FormInputDataCell key={index} {...input} />
                ))}
              </CTableBody>
            </CTable>
          </CForm>
          {/* <CFormFloating>
            <CFormSelect
              defaultValue={curentStatus.children_status_id}
              className="col-form-label custom-select-floating"
              aria-label="Large select example"
              onChange={handleStatusIdChange}
            >
              {status.map((state, index) => (
                <option
                  key={index}
                  value={state.children_status_id}
                  selected={curentStatus.children_status_id == state.children_status_id}
                >
                  {state.children_status_name}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel htmlFor="inputStatus">Trạng thái</CFormLabel>
          </CFormFloating> */}
        </CRow>
      </CModalBody>
      <CModalFooter className="border-0">
        <CButton className="form-table-btn" onClick={handleSubmit} disabled={!formValid}>
          Thêm trẻ
        </CButton>
        <CButton color="secondary" onClick={() => setVisible()}>
          Hủy bỏ
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

EditChildrenStatusModal.propTypes = {
  childrenId: PropTypes.any,
  childrenName: PropTypes.string,
  childrenStatus: PropTypes.any,
  isWaitingAdoption: PropTypes.any,
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  handleResult: PropTypes.func,
}

export default EditChildrenStatusModal
