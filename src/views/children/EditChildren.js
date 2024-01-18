import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import fileService from 'src/api/services/fileService'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'
import childrenService from 'src/api/services/childrenService'
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'

const EditChildren = () => {
  const childrenApi = childrenService()
  const publicApi = publicService()
  const fileApi = fileService()
  const { id } = useParams()

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [orphaneTypes, setOrphaneTypes] = useState([])

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: null,
    date_of_admission: '',
    ethnicity: '',
    religion: '',
    circumstance: '',
    address: {
      province_id: null,
      district_id: null,
      ward_id: null,
      address_detail: '',
    },
    orphan_type_id: null,
    image: {
      image_file_name: '',
      image_file_path: '',
    },
  })
  const [image, setImage] = useState({
    image_file_name: '',
    image_file_path: '',
  })
  const [imageFile, setImageFile] = useState()
  const [formValid, setFormValid] = useState(false)

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
    date_of_admission: {
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
    circumstance: {
      invalid: false,
      errorMessage: 'Vui lòng nhập hoàn cảnh',
    },
    orphan_type_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn hoàn cảnh',
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

  const [firstProvinceChange, setFirstProvinceChange] = useState(true)
  const [firstDistrictChange, setFirstDistrictChange] = useState(true)
  const [firstChange, setFirstChange] = useState(false)

  useEffect(() => {
    let isValid = true

    if (firstChange) {
      isValid =
        formData.first_name &&
        formData.last_name &&
        formData.date_of_birth &&
        formData.gender &&
        formData.circumstance &&
        formData.date_of_admission &&
        formData.ethnicity &&
        formData.orphan_type_id &&
        formData.religion &&
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
    } else {
      isValid = false
    }
    setFormValid(isValid)
  }, [formData, formValidate])

  useEffect(() => {
    const getChildren = async () => {
      try {
        const response = await childrenApi.getChildrenUpdateInfo(id)
        setFormData(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getChildren()
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
    // Get Orphan types
    const getOrphantypes = async () => {
      try {
        const response = await childrenApi.getOrphantypes()
        setOrphaneTypes(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getProvinces()
    getOrphantypes()
  }, [id])

  // Init districts select options
  useEffect(() => {
    if (formData.address.province_id) {
      if (provinces.length > 0) {
        const province = provinces.find(
          (province) => province.province_id == formData.address.province_id,
        )
        setDistricts(province.districts)
        if (firstProvinceChange) {
          setFirstProvinceChange(false)
        } else {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              district_id: null,
              ward_id: null,
            },
          })
        }
      }
    }
  }, [formData.address.province_id, provinces])

  // Init wards select options
  useEffect(() => {
    if (formData.address.district_id) {
      if (districts.length > 0) {
        const district = districts.find(
          (district) => district.district_id == formData.address.district_id,
        )
        if (district?.wards) {
          setWards(district?.wards)
          if (firstDistrictChange) {
            setFirstDistrictChange(false)
          } else {
            setFormData({
              ...formData,
              address: {
                ...formData.address,
                ward_id: null,
              },
            })
          }
        }
      }
    }
  }, [formData.address.district_id, districts])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (!firstChange) {
      setFirstChange(true)
    }
    let isFieldValid = validator.isEmpty(value)

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
    if (!firstChange) {
      setFirstChange(true)
    }

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

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setImageFile(file)
    if (!firstChange) {
      setFirstChange(true)
    }
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
        image.image_file_name = result?.file_name
        image.image_file_path = result?.file_path
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    try {
      if (imageFile && !(await handleUploadImage())) {
        setErrorModalMessage({
          modalTile: 'Lỗi',
          modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        })
        setLoadingModalVisible(false)
        setErrorModalVisible(true)
        return
      }
      const data = {
        ...formData,
      }
      if (imageFile) {
        data.image = image
      }
      await childrenApi.updateChildrenInfo(id, JSON.stringify(data))
      setSuccessModalMessage({
        modalTile: 'Thành công!',
        modalContent: 'Đã cập nhật thành công',
      })
      setLoadingModalVisible(false)
      setSuccessModalVisible(true)
      setDone(true)
    } catch (error) {
      console.error(error)
      setErrorModalMessage({
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      })
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
      type: 'date',
      id: 'date_of_admission',
      name: 'date_of_admission',
      label: 'Ngày tiếp nhận*',
      value: formData.date_of_admission,
      onChange: handleInputChange,
      invalid: formValidate.date_of_admission.invalid,
      errorMessage: formValidate.date_of_admission.errorMessage,
    },
    {
      type: 'date',
      id: 'date_of_departure',
      name: 'date_of_departure',
      label: 'Ngày rời trại trẻ*',
      value: formData.date_of_departure,
      onChange: handleInputChange,
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
      id: 'orphan_type_id',
      name: 'orphan_type_id',
      label: 'Kiểu mồ côi*',
      value: formData.orphan_type_id,
      onChange: handleInputChange,
      invalid: formValidate.orphan_type_id.invalid,
      errorMessage: formValidate.orphan_type_id.errorMessage,
      options: orphaneTypes.map((orphaneType) => ({
        label: orphaneType.orphan_type_name,
        value: orphaneType.orphan_type_id,
      })),
    },
    {
      type: 'textarea',
      id: 'circumstance',
      name: 'circumstance',
      label: 'Hoàn cảnh*',
      value: formData.circumstance,
      onChange: handleInputChange,
      invalid: formValidate.circumstance.invalid,
      errorMessage: formValidate.circumstance.errorMessage,
      rows: 4,
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
                <h4>Cập nhật thông tin trẻ em</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../children/information">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
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

export default EditChildren
