import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import childrenService from 'src/api/services/childrenService'
import validator from 'validator'
import { NavLink, useParams } from 'react-router-dom'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'

const UpdateChildrenStatus = () => {
  const { id } = useParams()
  const childrenApi = childrenService()
  const [children, setChildren] = useState({})

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

  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await childrenApi.getChildrenStatusOptions(id)
        setChildren(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    id && getStatus()
  }, [id])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      await childrenApi.updateChildrenStatus(id, JSON.stringify(formData))
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã thêm thành công',
      }))
      setLoadingModalVisible(false)
      setSuccessModalVisible(true)
      setDone(true)
    } catch (e) {
      console.log(e)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: e?.error?.message,
      }))
      setLoadingModalVisible(false)
      setErrorModalVisible(true)
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/children/' + id)
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Họ và tên trẻ',
      value: children?.children_name,
      readOnly: true,
    },
    {
      type: 'text',
      label: 'Trạng thái hiện tại',
      value: children?.status_name,
      readOnly: true,
    },
    {
      type: 'select',
      id: 'status_id',
      name: 'status_id',
      label: 'Trạng thái mới*',
      value: formData.status_id,
      onChange: handleInputChange,
      invalid: formValidate.status_id.invalid,
      errorMessage: formValidate.status_id.errorMessage,

      options:
        children?.status_options?.length > 0
          ? children?.status_options?.map((state) => ({
              label: state.children_status_name,
              value: state.children_status_id,
            }))
          : [],
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
    <>
      <LoadingModal isVisible={loadingModalVisible} setVisible={setLoadingModalVisible} />
      <SuccessModal
        modalMessage={successModalMessage}
        isVisible={successModalVisible}
        setVisible={setSuccessModalVisible}
      />
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Cập nhật trạng thái trẻ</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../children/information">
                  <CButton className="form-table-btn">Về trang quản lý</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    {inputs.map((input, index) => (
                      <FormInputDataCell key={index} {...input} />
                    ))}
                  </CTableBody>
                </CTable>
                <div className="d-flex justify-content-end">
                  <CButton className="form-table-btn" onClick={handleSubmit} disabled={!formValid}>
                    Lưu
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default UpdateChildrenStatus
