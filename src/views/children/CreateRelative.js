import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CTable,
  CTableBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreateRelative = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const childrenId = searchParams.get('childrenId')
  const childrenName = searchParams.get('childrenName')

  const childrenApi = childrenService()
  const publicApi = publicService()

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: null,
    phone_number: '',
    mail_address: '',
    relationship: '',
    address: {
      province_id: '',
      district_id: '',
      ward_id: '',
      address_detail: '',
    },
  })
  const [formValidate, setFormValidate] = useState({
    first_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tên',
    },
    last_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập họ',
    },
    date_of_birth: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày sinh',
    },
    gender: {
      invalid: false,
      errorMessage: 'Vui lòng chọn giới tình',
    },
    phone_number: {
      invalid: false,
      errorMessage: 'Vui lòng nhập số điện thoại',
    },
    mail_address: {
      invalid: false,
      errorMessage: 'Địa chỉ email không đúng định dạng.',
    },
    relationship: {
      invalid: false,
      errorMessage: 'Vui lòng nhập quan hệ',
    },
    province_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn tỉnh/thành phố',
    },
    district_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn quận/huyện',
    },
    ward_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn xã/phường',
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
  const [done, setDone] = useState(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  useEffect(() => {
    // Get provinces
    const getProvinces = async () => {
      try {
        const response = await publicApi.getProvince()
        const result = response.result
        setProvinces(result)
      } catch (error) {
        console.log(error)
      }
    }
    getProvinces()
  }, [])

  // Init districts select options
  useEffect(() => {
    if (formData.address.province_id) {
      const province = provinces.find(
        (province) => province.province_id == formData.address.province_id,
      )
      setDistricts(province.districts)
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          district_id: null,
          ward_id: null,
        },
      })
    }
  }, [formData.address.province_id])

  // Init wards select options
  useEffect(() => {
    if (formData.address.district_id) {
      const district = districts.find(
        (district) => district.district_id == formData.address.district_id,
      )
      if (district?.wards) {
        setWards(district?.wards)
        setFormData({
          ...formData,
          address: {
            ...formData.address,
            ward_id: null,
          },
        })
      }
    }
  }, [formData.address.district_id, districts])

  useEffect(() => {
    let isValid =
      formData.first_name &&
      formData.last_name &&
      formData.date_of_birth &&
      formData.gender &&
      formData.phone_number &&
      formData.relationship &&
      formData.address.province_id &&
      formData.address.district_id &&
      formData.address.ward_id

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [formData, formValidate])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })

    let isFieldValid = validator.isEmpty(value)
    switch (name) {
      case 'mail_address':
        isFieldValid = false
        break
      case 'phone_number':
        isFieldValid = !validator.isMobilePhone(value, ['vi-VN'])
        break
      case 'first_name':
      case 'last_name':
        const vietnameseNameRegex = /^[A-Za-zÀ-Ỹà-ỹ\s]+$/
        isFieldValid = !validator.matches(value, vietnameseNameRegex)
        break
    }

    setFormValidate({
      ...formValidate,
      [name]: {
        ...formValidate[name],
        invalid: isFieldValid,
      },
    })
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    })

    if (name !== 'address_detail') {
      let isFieldValid = validator.isEmpty(value)
      setFormValidate({
        ...formValidate,
        [name]: {
          ...formValidate[name],
          invalid: isFieldValid,
        },
      })
    }
  }

  const validateForm = () => {
    let isFormValid = true

    // Validate từng trường
    Object.keys(formData).forEach((fieldName) => {
      let isFieldValid = true
      let errorMessage = ''

      switch (fieldName) {
        case 'date_of_birth':
          isFieldValid = formData[fieldName] !== ''
          errorMessage = 'Vui lòng nhập ngày sinh'
          break
        case 'gender':
          isFieldValid = validator.isEmpty(formData[fieldName])
          errorMessage = 'Vui lòng chọn giới tính'
          break
        case 'address':
          Object.keys(formData[fieldName]).forEach((addressField) => {
            switch (addressField) {
              case 'province_id':
                isFieldValid = validator.isEmpty(formData[fieldName][addressField])
                errorMessage = 'Vui lòng chọn tỉnh/thành phố'
                break
              case 'district_id':
                isFieldValid = validator.isEmpty(formData[fieldName][addressField])
                errorMessage = 'Vui lòng chọn quận/huyện'
                break
              case 'ward_id':
                isFieldValid = validator.isEmpty(formData[fieldName][addressField])
                errorMessage = 'Vui lòng chọn xã/phường'
                break
              default:
                break
            }
          })
          break
        default:
          break
      }

      setFormValidate((prevFormValidate) => ({
        ...prevFormValidate,
        [fieldName]: {
          invalid: isFieldValid,
          errorMessage,
        },
      }))

      if (!isFieldValid) {
        isFormValid = false
      }
    })

    return isFormValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    try {
      const response = await childrenApi.createRelatives(childrenId, JSON.stringify(formData))
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
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setLoadingModalVisible(false)
      setErrorModalVisible(true)
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/children/information')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Họ và tên trẻ',
      value: childrenName,
      readOnly: true,
    },
    {
      type: 'text',
      id: 'first_name',
      name: 'first_name',
      label: 'Tên người thân*',
      value: formData.first_name,
      onChange: handleInputChange,
      invalid: formValidate.first_name.invalid,
      errorMessage: formValidate.first_name.errorMessage,
    },
    {
      type: 'text',
      id: 'last_name',
      name: 'last_name',
      label: 'Họ và tên đệm*',
      value: formData.last_name,
      onChange: handleInputChange,
      invalid: formValidate.last_name.invalid,
      errorMessage: formValidate.last_name.errorMessage,
    },
    {
      type: 'date',
      id: 'date_of_birth',
      name: 'date_of_birth',
      label: 'Ngày sinh*',
      value: formData.date_of_birth,
      onChange: handleInputChange,
      invalid: formValidate.date_of_birth.invalid,
      errorMessage: formValidate.date_of_birth.errorMessage,
    },
    {
      type: 'radio',
      id: 'gender',
      name: 'gender',
      label: 'Giới tính*',
      value: formData.gender,
      onChange: handleInputChange,
      invalid: formValidate.gender.invalid,
      errorMessage: formValidate.gender.errorMessage,
      options: [
        { label: 'Nam', value: 1 },
        { label: 'Nữ', value: 2 },
        { label: 'Khác', value: 0 },
      ],
    },
    {
      type: 'email',
      id: 'mail_address',
      name: 'mail_address',
      label: 'Địa chỉ email*',
      value: formData.mail_address,
      onChange: handleInputChange,
    },
    {
      type: 'number',
      id: 'phone_number',
      name: 'phone_number',
      label: 'Số điện thoại*',
      value: formData.phone_number,
      onChange: handleInputChange,
      invalid: formValidate.phone_number.invalid,
      errorMessage: formValidate.phone_number.errorMessage,
    },
    {
      type: 'text',
      id: 'relationship',
      name: 'relationship',
      label: 'Quan hệ với trẻ*',
      value: formData.relationship,
      onChange: handleInputChange,
      invalid: formValidate.relationship.invalid,
      errorMessage: formValidate.relationship.errorMessage,
    },
    {
      type: 'select',
      id: 'province_id',
      name: 'province_id',
      label: 'Tỉnh/Thành phố*',
      value: formData.address.province_id,
      onChange: handleAddressChange,
      invalid: formValidate.province_id.invalid,
      errorMessage: formValidate.province_id.errorMessage,
      options: provinces.map((province) => ({
        label: province.province_name,
        value: province.province_id,
      })),
    },
    {
      type: 'select',
      id: 'district_id',
      name: 'district_id',
      label: 'Quận/Huyện*',
      value: formData.address.district_id,
      onChange: handleAddressChange,
      invalid: formValidate.district_id.invalid,
      errorMessage: formValidate.district_id.errorMessage,
      options: districts.map((district) => ({
        label: district.district_name,
        value: district.district_id,
      })),
    },
    {
      type: 'select',
      id: 'ward_id',
      name: 'ward_id',
      label: 'Phường/Xã*',
      value: formData.address.ward_id,
      onChange: handleAddressChange,
      invalid: formValidate.ward_id.invalid,
      errorMessage: formValidate.ward_id.errorMessage,
      options: wards.map((ward) => ({
        label: ward.ward_name,
        value: ward.ward_id,
      })),
    },
    {
      type: 'text',
      id: 'address_detail',
      name: 'address_detail',
      label: 'Địa chỉ chi tiết',
      value: formData.address.address_detail,
      onChange: handleAddressChange,
    },
  ]

  return (
    <>
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
      <LoadingModal isVisible={loadingModalVisible} setVisible={setLoadingModalVisible} />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm thông tin người thân</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../children/information">
                  <CButton className="form-table-btn">về trang danh sách</CButton>
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
                    Thêm người thân
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

export default CreateRelative
