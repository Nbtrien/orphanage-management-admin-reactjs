import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import fileService from 'src/api/services/fileService'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'
import childrenService from 'src/api/services/childrenService'
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'

const CreateChildren = () => {
  const fileApi = fileService()
  const childrenApi = childrenService()
  const publicApi = publicService()

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

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [orphaneTypes, setOrphaneTypes] = useState([])

  const [children, setChildren] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: null,
    date_of_admission: '',
    ethnicity: '',
    religion: '',
    circumstance: '',
    is_waiting_adoption: null,
    address: {
      province_id: null,
      district_id: null,
      ward_id: null,
      address_detail: '',
    },
    orphanage_type_id: null,
    image: {
      image_file_name: '',
      image_file_path: '',
    },
    documents: [],
  })
  const [imageFile, setImageFile] = useState()
  const [documentInputs, setDocumentInputs] = useState([])
  const [documentFiles, setDocumentFiles] = useState([])

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
    is_waiting_adoption: {
      invalid: false,
      errorMessage: 'Vui lòng chọn trạng thái',
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
    orphanage_type_id: {
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
  const [documentsInvalid, setDocumentsInvalid] = useState({})
  const [documentsErrorMessage, setDocumentsErrorMessage] = useState({})
  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    let isValid = true

    isValid =
      children.first_name &&
      children.last_name &&
      children.date_of_birth &&
      children.gender &&
      children.circumstance &&
      children.date_of_admission &&
      children.ethnicity &&
      children.orphanage_type_id &&
      children.religion &&
      children.address.province_id &&
      children.address.district_id &&
      children.address.ward_id &&
      children.orphanage_type_id &&
      children.is_waiting_adoption

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [children, formValidate])

  useEffect(() => {
    // Get provinces
    const getProvinces = async () => {
      try {
        const response = await publicApi.getProvince()
        const result = response.result
        setProvinces(result)
        // setProvinceId(result.at(0).province_id)
      } catch (error) {
        console.log(error)
      }
    }
    // Get Document types
    const getDocumentTypes = async () => {
      try {
        const response = await childrenApi.getDocumentTypes()
        setDocumentTypes(response.result)
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
    getDocumentTypes()
  }, [])

  // Init districts select options
  useEffect(() => {
    if (children.address.province_id) {
      const province = provinces.find(
        (province) => province.province_id == children.address.province_id,
      )
      setDistricts(province.districts)
      setChildren({
        ...children,
        address: {
          ...children.address,
          district_id: null,
          ward_id: null,
        },
      })
    }
  }, [children.address.province_id])

  // Init wards select options
  useEffect(() => {
    if (children.address.district_id) {
      const district = districts.find(
        (district) => district.district_id == children.address.district_id,
      )
      if (district?.wards) {
        setWards(district?.wards)
        setChildren({
          ...children,
          address: {
            ...children.address,
            ward_id: null,
          },
        })
      }
    }
  }, [children.address.district_id, districts])
  // Init document file inputs
  useEffect(() => {
    const docInputs = []
    documentTypes.map((documentType) => {
      const invalid = documentsInvalid[documentType.document_type_id] || false
      const error = documentsErrorMessage[documentType.document_type_id] || ''
      const docInput = {
        type: 'file',
        id: documentType.document_type_id,
        label: documentType.document_type_name,
        onChange: (event) => handleDocumentFileChange(event, documentType.document_type_id),
        invalid: invalid,
        errorMessage: error,
      }
      docInputs.push(docInput)
    })
    setDocumentInputs(docInputs)
  }, [documentTypes, documentsInvalid, documentsErrorMessage])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setChildren({
      ...children,
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

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setChildren({
      ...children,
      address: {
        ...children.address,
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
  const handleDocumentFileChange = (event, documentTypeId) => {
    const file = event.target.files[0]
    const updatedDocuments = documentFiles
    const existingDocumentIndex = updatedDocuments.findIndex(
      (document) => document.documentTypeId === documentTypeId,
    )

    if (existingDocumentIndex != -1) {
      updatedDocuments[existingDocumentIndex].file = file
    } else {
      const newDocument = { documentTypeId: documentTypeId, file }
      updatedDocuments.push(newDocument)
    }
    setDocumentFiles([])
    setDocumentFiles(updatedDocuments)

    // Validate file
    if (file && file.size > 10 * 1024 * 1024) {
      let invalids = { ...documentsInvalid }
      let errors = { ...documentsErrorMessage }
      invalids[documentTypeId] = true
      errors[documentTypeId] = 'Kích thước tệp không được vượt quá 10MB.'

      setDocumentsInvalid(invalids)
      setDocumentsErrorMessage(errors)
    } else {
      let invalids = { ...documentsInvalid }
      let errors = { ...documentsErrorMessage }
      invalids[documentTypeId] = false
      errors[documentTypeId] = ''

      setDocumentsInvalid(invalids)
      setDocumentsErrorMessage(errors)
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
        children.image.image_file_name = result?.file_name
        children.image.image_file_path = result?.file_path
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

  const handleUploadDocuments = async () => {
    try {
      const presignedResponses = await Promise.all(
        documentFiles.map((documentFile) =>
          fileApi.getPresignedUrl(documentFile.file.name, 'files'),
        ),
      )
      try {
        const docs = []
        const s3Responses = await Promise.all(
          presignedResponses.map((response, index) =>
            uploadToS3(response.result.presigned_url, documentFiles[index].file),
          ),
        )
        s3Responses.map((s3Response, index) =>
          docs.push({
            file_name: presignedResponses[index].result.file_name,
            file_path: presignedResponses[index].result.file_path,
            document_type_id: documentFiles[index].documentTypeId,
          }),
        )
        children.documents = docs
      } catch (error) {
        console.log(error)
        return false
      }
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    if ((await handleUploadImage()) && (await handleUploadDocuments())) {
      try {
        await childrenApi.createChildren(JSON.stringify(children))
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
      (window.location.href = 'http://localhost:3000/admin/children/information')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      id: 'first_name',
      name: 'first_name',
      label: 'Tên*',
      value: children.first_name,
      onChange: handleInputChange,
      invalid: formValidate.first_name.invalid,
      errorMessage: formValidate.first_name.errorMessage,
    },
    {
      type: 'text',
      id: 'last_name',
      name: 'last_name',
      label: 'Họ và tên đệm*',
      value: children.last_name,
      onChange: handleInputChange,
      invalid: formValidate.last_name.invalid,
      errorMessage: formValidate.last_name.errorMessage,
    },
    {
      type: 'date',
      id: 'date_of_birth',
      name: 'date_of_birth',
      label: 'Ngày sinh*',
      value: children.date_of_birth,
      onChange: handleInputChange,
      invalid: formValidate.date_of_birth.invalid,
      errorMessage: formValidate.date_of_birth.errorMessage,
    },
    {
      type: 'radio',
      id: 'gender',
      name: 'gender',
      label: 'Giới tính*',
      value: children.gender,
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
      value: children.date_of_admission,
      onChange: handleInputChange,
      invalid: formValidate.date_of_admission.invalid,
      errorMessage: formValidate.date_of_admission.errorMessage,
    },
    {
      type: 'text',
      id: 'ethnicity',
      name: 'ethnicity',
      label: 'Dân tộc*',
      value: children.ethnicity,
      onChange: handleInputChange,
      invalid: formValidate.ethnicity.invalid,
      errorMessage: formValidate.ethnicity.errorMessage,
    },
    {
      type: 'text',
      id: 'religion',
      name: 'religion',
      label: 'Tôn giáo*',
      value: children.religion,
      onChange: handleInputChange,
      invalid: formValidate.religion.invalid,
      errorMessage: formValidate.religion.errorMessage,
    },
    {
      type: 'select',
      id: 'province_id',
      name: 'province_id',
      label: 'Tỉnh/Thành phố*',
      value: children.address.province_id,
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
      value: children.address.district_id,
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
      value: children.address.ward_id,
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
      value: children.address.address_detail,
      onChange: handleAddressChange,
    },
    {
      type: 'select',
      id: 'orphanage_type_id',
      name: 'orphanage_type_id',
      label: 'Kiểu mồ côi*',
      value: children.orphanage_type_id,
      onChange: handleInputChange,
      invalid: formValidate.orphanage_type_id.invalid,
      errorMessage: formValidate.orphanage_type_id.errorMessage,
      options: orphaneTypes.map((orphaneType) => ({
        label: orphaneType.orphan_type_name,
        value: orphaneType.orphan_type_id,
      })),
    },
    {
      type: 'radio',
      id: 'is_waiting_adoption',
      name: 'is_waiting_adoption',
      label: 'Trạng thái chờ được nhận nuôi*',
      value: children.is_waiting_adoption,
      onChange: handleInputChange,
      invalid: formValidate.is_waiting_adoption.invalid,
      errorMessage: formValidate.is_waiting_adoption.errorMessage,
      options: [
        { label: 'Có', value: 1 },
        { label: 'không', value: 0 },
      ],
    },
    {
      type: 'textarea',
      id: 'circumstance',
      name: 'circumstance',
      label: 'Hoàn cảnh*',
      value: children.circumstance,
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
                <h4>Thêm thông tin trẻ em</h4>
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
                    {documentInputs.map((input, index) => (
                      <FormInputDataCell key={index} {...input} />
                    ))}
                  </CTableBody>
                </CTable>
                <div className="d-flex justify-content-end">
                  <CButton className="form-table-btn" onClick={handleSubmit} disabled={!formValid}>
                    Thêm trẻ
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

export default CreateChildren
