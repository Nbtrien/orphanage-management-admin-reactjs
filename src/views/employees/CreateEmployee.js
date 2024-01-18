import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import employeeService from 'src/api/services/employeeService'
import fileService from 'src/api/services/fileService'
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateEmployee = () => {
  const employeeApi = employeeService()
  const publicApi = publicService()
  const fileApi = fileService()

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [positions, setPositions] = useState([])

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: null,
    phone_number: '',
    mail_address: '',
    ethnicity: '',
    religion: '',
    hire_date: '',
    salary: '',
    position_id: null,
    address: {
      province_id: null,
      district_id: null,
      ward_id: null,
      address_detail: '',
    },
    image: {
      image_file_name: '',
      image_file_path: '',
    },
  })
  const [imageFile, setImageFile] = useState(null)
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
      errorMessage: 'Ngày sinh không hợp lệ',
    },
    gender: {
      invalid: false,
      errorMessage: 'Vui lòng chọn giới',
    },
    hire_date: {
      invalid: false,
      errorMessage: 'Ngày tiếp nhận không hợp lệ',
    },
    ethnicity: {
      invalid: false,
      errorMessage: 'Vui lòng nhập dân tộc',
    },
    religion: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tôn giáo',
    },
    phone_number: {
      invalid: false,
      errorMessage: 'Vui lòng nhập số điện thoại',
    },
    mail_address: {
      invalid: false,
      errorMessage: 'Vui lòng nhập địa chỉ email',
    },
    salary: {
      invalid: false,
      errorMessage: 'Vui lòng nhập lương',
    },
    position_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn công việc',
    },
    province_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn tỉnh/thành phố',
    },
    district_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn quận huyện',
    },
    ward_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn xã',
    },
    image: {
      invalid: false,
      errorMessage: 'Vui lòng chọn ảnh',
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
    let isValid = true

    isValid =
      formData.first_name &&
      formData.last_name &&
      formData.date_of_birth &&
      formData.gender &&
      formData.mail_address &&
      formData.hire_date &&
      formData.ethnicity &&
      formData.phone_number &&
      formData.religion &&
      formData.address.province_id &&
      formData.address.district_id &&
      formData.address.ward_id &&
      formData.salary &&
      formData.position_id

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
    // Get positions
    const getPositions = async () => {
      try {
        const response = await employeeApi.getEmployeePositions()
        const result = response.result
        setPositions(result)
      } catch (error) {
        console.log(error)
      }
    }
    getProvinces()
    getPositions()
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
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setImageFile(file)
    if (file && file.size > 10 * 1024 * 1024) {
      setFormValidate({
        ...formValidate,
        image: {
          ...formValidate.image,
          invalid: true,
          errorMessage: 'Kích thước tệp không được vượt quá 10MB.',
        },
      })
    } else {
      setFormValidate({
        ...formValidate,
        image: {
          ...formValidate.image,
          invalid: false,
        },
      })
    }
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

  const uploadToS3 = async (presignedUrl, file) => {
    const binaryData = await fileToBinary(file)
    try {
      await axios.put(presignedUrl, binaryData, {
        headers: {
          'Content-Type': file.type,
        },
      })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  const handleUploadImage = async () => {
    try {
      const response = await fileApi.getPresignedUrl(imageFile.name, 'images')
      const result = response.result
      try {
        await uploadToS3(result.presigned_url, imageFile)
        formData.image.image_file_name = result?.file_name
        formData.image.image_file_path = result?.file_path
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    if (await handleUploadImage()) {
      try {
        await employeeApi.createEmployee(JSON.stringify(formData))
        setLoadingModalVisible(false)
        setSuccessModalMessage((prevSuccessModal) => ({
          ...prevSuccessModal,
          modalTile: 'Thành công!',
          modalContent: 'Đã thêm thành công',
        }))
        setSuccessModalVisible(true)
        setDone(true)
      } catch (e) {
        setLoadingModalVisible(false)
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        }))
        setErrorModalVisible(true)
      }
    } else {
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/employees/information')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      id: 'first_name',
      name: 'first_name',
      label: 'Tên*',
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
      id: 'ethnicity',
      name: 'ethnicity',
      label: 'Dân tộc*',
      value: formData.ethnicity,
      onChange: handleInputChange,
      invalid: formValidate.ethnicity.invalid,
      errorMessage: formValidate.ethnicity.errorMessage,
    },
    {
      type: 'text',
      id: 'religion',
      name: 'religion',
      label: 'Tôn giáo*',
      value: formData.religion,
      onChange: handleInputChange,
      invalid: formValidate.religion.invalid,
      errorMessage: formValidate.religion.errorMessage,
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
    {
      type: 'select',
      id: 'position_id',
      name: 'position_id',
      label: 'Công việc*',
      value: formData.position_id,
      onChange: handleInputChange,
      invalid: formValidate.position_id.invalid,
      errorMessage: formValidate.position_id.errorMessage,
      options: positions.map((pos) => ({
        label: pos.position_title,
        value: pos.position_id,
      })),
    },
    {
      type: 'number',
      id: 'salary',
      name: 'salary',
      label: 'Lương(VND)*',
      value: formData.salary,
      onChange: handleInputChange,
      invalid: formValidate.salary.invalid,
      errorMessage: formValidate.salary.errorMessage,
    },
    {
      type: 'date',
      id: 'hire_date',
      name: 'hire_date',
      label: 'Ngày bắt đầu*',
      value: formData.hire_date,
      onChange: handleInputChange,
      invalid: formValidate.hire_date.invalid,
      errorMessage: formValidate.hire_date.errorMessage,
    },
    {
      type: 'file',
      id: 'image',
      label: 'Chọn ảnh*',
      onChange: handleImageChange,
      invalid: formValidate.image.invalid,
      errorMessage: formValidate.image.errorMessage,
    },
  ]

  return (
    <>
      <LoadingModal isVisible={loadingModalVisible} setVisible={setLoadingModalVisible} />
      <SuccessModal
        modalMessage={successModalMessage}
        isVisible={successModalVisible}
        setVisible={setSuccessModalVisible}
      ></SuccessModal>
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      ></ErrorModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm nhân viên</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../employees/information">
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
                    Thêm nhân viên
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

export default CreateEmployee
