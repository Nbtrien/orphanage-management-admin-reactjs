import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CRow } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import childrenService from 'src/api/services/childrenService'
import fileService from 'src/api/services/fileService'
import publicService from 'src/api/services/publicService'
import HorizontalFormInput from 'src/components/forms/HorizontalFormInput'
import ErrorModal from 'src/components/modals/ErrorModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateChildren = () => {
  const childrenApi = childrenService()
  const publicApi = publicService()
  const fileApi = fileService()

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [orphaneTypes, setOrphaneTypes] = useState([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState()
  const [isWaitingAdoption, setIsWaitingAdoption] = useState()
  const [dateOfAdmission, setDateOfAdmission] = useState('')
  const [ethnicity, setEthnicity] = useState('')
  const [religion, setReligion] = useState('')
  const [circumstance, setCircumstance] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [wardId, setWardId] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [orphanageTypeId, setOrphanageTypeId] = useState()
  const [image, setImage] = useState({
    image_file_name: '',
    image_file_path: '',
  })

  const [imageFile, setImageFile] = useState()

  const [documentInputs, setDocumentInputs] = useState([])
  const [documentFiles, setDocumentFiles] = useState([])
  const [documents, setDocuments] = useState([])

  const [documentsInvalid, setDocumentsInvalid] = useState({})
  const [documentsErrorMessage, setDocumentsErrorMessage] = useState({})

  // useState invalid
  const [firstNameInvalid, setFirstNameInvalid] = useState(false)
  const [lastNameInvalid, setLastNameInvalid] = useState(false)
  const [dateOfBirthInvalid, setDateOfBirthInvalid] = useState(false)
  const [dateOfAdmissionInvalid, setDateOfAdmissionInvalid] = useState(false)
  const [ethnicityInvalid, setEthnicityInvalid] = useState(false)
  const [religionInvalid, setReligionInvalid] = useState(false)
  const [genderInvalid, setGenderInvalid] = useState(false)
  const [isWaitingAdoptionInvalid, setIsWaitingAdoptionInvalid] = useState(false)
  const [provinceIdInvalid, setProvinceIdInvalid] = useState(false)
  const [districtIdInvalid, setDistrictIdInvalid] = useState(false)
  const [wardIdInvalid, setWardIdInvalid] = useState(false)
  const [orphanageTypeIdInvalid, setOrphanageTypeIdInvalid] = useState(false)
  const [imageFileInvalid, setImageFileInvalid] = useState(false)

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
  const [dateOfBirthErrorMessage, setDateOfBirthErrorMessage] = useState('')
  const [dateOfAdmissionErrorMessage, setDateOfAdmissionErrorMessage] = useState('')
  const [ethnicityErrorMessage, setEthnicityErrorMessage] = useState('')
  const [religionErrorMessage, setReligionErrorMessage] = useState('')
  const [genderErrorMessage, setGenderErrorMessage] = useState('')
  const [isWaitingAdoptionErrorMessage, setIsWaitingAdoptionErrorMessage] = useState('')
  const [provinceIdErrorMessage, setProvinceIdErrorMessage] = useState('')
  const [districtIdErrorMessage, setDistrictIdErrorMessage] = useState('')
  const [wardIdErrorMessage, setWardIdErrorMessage] = useState('')
  const [orphanageTypeIdErrorMessage, setOrphanageTypeIdErrorMessage] = useState('')
  const [imageFileErrorMessage, setImageFileErrorMessage] = useState('')

  const [fileImageKey, setFileImageKey] = useState(0)

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

  const [formValid, setFormValid] = useState(false)
  const [isReset, setIsReset] = useState(0)

  useEffect(() => {
    let valid =
      firstName &&
      lastName &&
      dateOfBirth &&
      dateOfAdmission &&
      ethnicity &&
      religion &&
      !firstNameInvalid &&
      !lastNameInvalid &&
      !dateOfBirthInvalid &&
      !dateOfAdmissionInvalid &&
      !ethnicityInvalid &&
      !religionInvalid

    if (valid) {
      for (var key in documentsInvalid) {
        if (documentsInvalid[key]) {
          valid = false
        }
      }
    }

    setFormValid(valid)
  }, [
    firstName,
    lastName,
    dateOfBirth,
    dateOfAdmission,
    ethnicity,
    religion,
    firstNameInvalid,
    lastNameInvalid,
    dateOfBirthInvalid,
    dateOfAdmissionInvalid,
    ethnicityInvalid,
    religionInvalid,
    documentsInvalid,
  ])

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
  }, [documentTypes, documentsInvalid, documentsErrorMessage, isReset])

  // Init districts select options
  useEffect(() => {
    if (provinceId) {
      const province = provinces.find((province) => province.province_id == provinceId)
      setDistricts(province.districts)
      // setDistrictId(province.districts.at(0).district_id)
    }
  }, [provinceId])

  // Init wards select options
  useEffect(() => {
    if (districtId) {
      const district = districts.find((district) => district.district_id == districtId)
      setWards(district.wards)
      // setWardId(district.wards.at(0).ward_id)
    }
  }, [districtId])

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
      let invalids = { ...documentsInvalid } // Tạo bản sao của documentsInvalid
      let errors = { ...documentsErrorMessage } // Tạo bản sao của documentsErrorMessage
      invalids[documentTypeId] = true
      errors[documentTypeId] = 'Kích thước tệp không được vượt quá 10MB.'

      setDocumentsInvalid(invalids)
      setDocumentsErrorMessage(errors)
    } else {
      let invalids = { ...documentsInvalid } // Tạo bản sao của documentsInvalid
      let errors = { ...documentsErrorMessage } // Tạo bản sao của documentsErrorMessage
      invalids[documentTypeId] = false
      errors[documentTypeId] = ''

      setDocumentsInvalid(invalids)
      setDocumentsErrorMessage(errors)
    }
  }

  const handleFirstNameChange = (event) => {
    const value = event.target.value
    setFirstName(value)
    if (validator.isEmpty(value)) {
      setFirstNameInvalid(true)
      setFirstNameErrorMessage('Tên không được để trống')
    } else {
      setFirstNameInvalid(false)
      setFirstNameErrorMessage('')
    }
  }

  const handleLastNameChange = (event) => {
    const value = event.target.value
    setLastName(value)
    if (validator.isEmpty(value)) {
      setLastNameInvalid(true)
      setLastNameErrorMessage('Họ không được để trống')
    } else {
      setLastNameInvalid(false)
      setLastNameErrorMessage('')
    }
  }

  const handleDateOfBirthChange = (event) => {
    const value = event.target.value
    const currentDate = new Date()
    const selectedDate = new Date(value)

    if (selectedDate > currentDate) {
      setDateOfBirthInvalid(true)
      setDateOfBirthErrorMessage('Ngày sinh không được lớn hơn ngày hiện tại')
    } else {
      setDateOfBirthInvalid(false)
      setDateOfBirthErrorMessage('')
      setDateOfBirth(value)
    }
  }

  const handleDateOfAdmissionChange = (event) => {
    const value = event.target.value
    const currentDate = new Date()
    const selectedDate = new Date(value)

    if (selectedDate > currentDate) {
      setDateOfAdmissionInvalid(true)
      setDateOfAdmissionErrorMessage('Ngày tiếp nhận không được lớn hơn ngày hiện tại')
    } else {
      setDateOfAdmissionInvalid(false)
      setDateOfAdmissionErrorMessage('')
      setDateOfAdmission(value)
    }
  }

  const handleEthnicityChange = (event) => {
    const value = event.target.value
    setEthnicity(value)
    if (validator.isEmpty(value)) {
      setEthnicityInvalid(true)
      setEthnicityErrorMessage('Dân tộc không được để trống')
    } else {
      setEthnicityInvalid(false)
      setEthnicityErrorMessage('')
    }
  }

  const handleReligionChange = (event) => {
    const value = event.target.value
    setReligion(value)
    if (validator.isEmpty(value)) {
      setReligionInvalid(true)
      setReligionErrorMessage('Tôn giáo không được để trống')
    } else {
      setReligionInvalid(false)
      setReligionErrorMessage('')
    }
  }

  const handleGenderChange = (event) => {
    const value = event.target.value
    setGender(value)
    if (validator.isEmpty(value)) {
      setGenderInvalid(true)
      setGenderErrorMessage('Giới tính không được để trống')
    } else {
      setGenderInvalid(false)
      setGenderErrorMessage('')
    }
  }

  const handleIsWaitingAdoptionChange = (event) => {
    const value = event.target.value
    setIsWaitingAdoption(value)
    if (validator.isEmpty(value)) {
      setIsWaitingAdoptionInvalid(true)
      setIsWaitingAdoptionErrorMessage('Trạng thái chờ nhận nuôi không được để trống')
    } else {
      setIsWaitingAdoptionInvalid(false)
      setIsWaitingAdoptionErrorMessage('')
    }
  }

  const handleCircumstanceChange = (event) => {
    setCircumstance(event.target.value)
  }

  const handleAddressDetailChange = (event) => {
    setAddressDetail(event.target.value)
  }

  const handleProvinceIdChange = (event) => {
    const value = event.target.value
    setProvinceId(value)
    if (validator.isEmpty(value)) {
      setProvinceIdInvalid(true)
      setProvinceIdErrorMessage('Tỉnh/Thành phố không được để trống')
    } else {
      setProvinceIdInvalid(false)
      setProvinceIdErrorMessage('')
    }
  }

  const handleDistrictIdChange = (event) => {
    const value = event.target.value
    setDistrictId(value)
    if (validator.isEmpty(value)) {
      setDistrictIdInvalid(true)
      setDistrictIdErrorMessage('Quận/Huyện không được để trống')
    } else {
      setDistrictIdInvalid(false)
      setDistrictIdErrorMessage('')
    }
  }

  const handleWardIdChange = (event) => {
    const value = event.target.value
    setWardId(value)
    if (validator.isEmpty(value)) {
      setWardIdInvalid(true)
      setWardIdErrorMessage('Phường/Xã không được để trống')
    } else {
      setWardIdInvalid(false)
      setWardIdErrorMessage('')
    }
  }

  const handleOrphanageTypeIdChange = (event) => {
    const value = event.target.value
    setOrphanageTypeId(value)
    if (validator.isEmpty(value)) {
      setOrphanageTypeIdInvalid(true)
      setOrphanageTypeIdErrorMessage('Vui lòng chọn kiểu mồ côi')
    } else {
      setOrphanageTypeIdInvalid(false)
      setOrphanageTypeIdErrorMessage('')
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setImageFile(file)
    if (file && file.size > 10 * 1024 * 1024) {
      // 10MB
      setImageFileInvalid(true)
      setImageFileErrorMessage('Kích thước tệp không được vượt quá 10MB.')
    } else {
      setImageFileInvalid(false)
      setImageFileErrorMessage('')
    }
  }

  const handleUploadImage = async () => {
    try {
      const response = await fileApi.getPresignedUrl(imageFile.name, 'images')
      if (response.status === 200) {
        const result = response.result
        let presignedUrl = result.presigned_url
        const binaryData = await fileToBinary(imageFile)
        try {
          await axios.put(presignedUrl, binaryData, {
            headers: {
              'Content-Type': imageFile.type,
            },
          })
          image.image_file_name = result?.file_name
          image.image_file_path = result?.file_path
          setImage(image)
          return true
        } catch (err) {
          console.log(err)
          return false
        }
      }
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }

  const handleUploadDocuments = async () => {
    try {
      const docs = documents
      for (const documentFile of documentFiles) {
        const response = await fileApi.getPresignedUrl(documentFile.file.name, 'files')
        if (response.status === 200) {
          const result = response.result
          let presignedUrl = result.presigned_url
          const binaryData = await fileToBinary(documentFile.file)
          try {
            await axios.put(presignedUrl, binaryData, {
              headers: {
                'Content-Type': documentFile.file.type,
              },
            })
            docs.push({
              file_name: result.file_name,
              file_path: result.file_path,
              document_type_id: documentFile.documentTypeId,
            })
          } catch (err) {
            console.log(err)
            return false
          }
        }
      }
      setDocuments(docs)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setDateOfBirth('')
    setGender()
    setIsWaitingAdoption()
    setDateOfAdmission('')
    setEthnicity('')
    setReligion('')
    setCircumstance('')
    setProvinceId('')
    setDistrictId('')
    setWardId('')
    setAddressDetail('')
    setOrphanageTypeId('')
    setImage({
      image_file_name: '',
      image_file_path: '',
    })
    setImageFile('')
    setFileImageKey((prevKey) => prevKey + 1)
    setDocumentFiles([])
    setDocuments([])
    setDocumentInputs([])
    setIsReset(!isReset)
  }

  const validateSelects = () => {
    let isValid = true

    if (!gender) {
      setGenderInvalid(true)
      setGenderErrorMessage('Vui lòng chọn giới tính')
      isValid = false
    } else {
      setGenderInvalid(false)
      setGenderErrorMessage('')
    }

    if (!isWaitingAdoption) {
      setIsWaitingAdoptionInvalid(true)
      setIsWaitingAdoptionErrorMessage('Vui lòng chọn trạng thái chờ nhận nuôi')
      isValid = false
    } else {
      setIsWaitingAdoptionInvalid(false)
      setIsWaitingAdoptionErrorMessage('')
    }

    if (!provinceId) {
      setProvinceIdInvalid(true)
      setProvinceIdErrorMessage('Vui lòng chọn Tỉnh/Thành phố')
      isValid = false
    } else {
      setProvinceIdInvalid(false)
      setProvinceIdErrorMessage('')
    }

    if (!districtId) {
      setDistrictIdInvalid(true)
      setDistrictIdErrorMessage('Vui lòng chọn Quận/Huyện')
      isValid = false
    } else {
      setDistrictIdInvalid(false)
      setDistrictIdErrorMessage('')
    }

    if (!wardId) {
      setWardIdInvalid(true)
      setWardIdErrorMessage('Vui lòng chọn Phường/Xã')
      isValid = false
    } else {
      setWardIdInvalid(false)
      setWardIdErrorMessage('')
    }

    if (!imageFile) {
      setImageFileInvalid(true)
      setImageFileErrorMessage('Vui lòng chọn Ảnh')
      isValid = false
    } else {
      setImageFileInvalid(false)
      setImageFileErrorMessage('')
    }

    if (!orphanageTypeId) {
      setOrphanageTypeIdInvalid(true)
      setOrphanageTypeIdErrorMessage('Vui lòng chọn kiểu mồ côi')
      isValid = false
    } else {
      setOrphanageTypeIdInvalid(false)
      setOrphanageTypeIdErrorMessage('')
    }

    return isValid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (validateSelects()) {
      const uploadImage = await handleUploadImage()
      const uploadDocuments = await handleUploadDocuments()

      if (uploadImage & uploadDocuments) {
        const data = {
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          gender: gender,
          is_waiting_adoption: isWaitingAdoption,
          date_of_admission: dateOfAdmission,
          ethnicity: ethnicity,
          religion: religion,
          circumstance: circumstance,
          address: {
            province_id: provinceId,
            district_id: districtId,
            ward_id: wardId,
            address_detail: addressDetail,
          },
          orphanage_type_id: orphanageTypeId,
          image,
          documents,
        }
        try {
          await childrenApi.createChildren(JSON.stringify(data))
          setSuccessModalMessage((prevSuccessModal) => ({
            ...prevSuccessModal,
            modalTile: 'Thành công!',
            modalContent: 'Đã thêm thành công',
          }))
          setSuccessModalVisible(true)
        } catch (e) {
          if (e?.status === 409) {
            setErrorModalMessage((prevModalError) => ({
              ...prevModalError,
              modalTile: 'Lỗi',
              modalContent: e?.error?.message,
            }))
            setErrorModalVisible(true)
          }
        }
        resetForm()
      }
    }
  }

  const inputs = [
    {
      type: 'text',
      id: 'inputFirstName',
      label: 'Tên*',
      value: firstName,
      onChange: handleFirstNameChange,
      invalid: firstNameInvalid,
      errorMessage: firstNameErrorMessage,
    },
    {
      type: 'text',
      id: 'inputLastName',
      label: 'Họ*',
      value: lastName,
      onChange: handleLastNameChange,
      invalid: lastNameInvalid,
      errorMessage: lastNameErrorMessage,
    },
    {
      type: 'date',
      id: 'inputDateOfBirth',
      label: 'Ngày sinh*',
      value: dateOfBirth,
      onChange: handleDateOfBirthChange,
      invalid: dateOfBirthInvalid,
      errorMessage: dateOfBirthErrorMessage,
    },
    {
      type: 'radio',
      id: 'inputGender',
      label: 'Giới tính*',
      value: gender,
      onChange: handleGenderChange,
      invalid: genderInvalid,
      errorMessage: genderErrorMessage,
      options: [
        { label: 'Nam', value: 1 },
        { label: 'Nữ', value: 2 },
        { label: 'Khác', value: 0 },
      ],
    },
    {
      type: 'date',
      id: 'inputDateOfAdmission',
      label: 'Ngày tiếp nhận*',
      value: dateOfAdmission,
      onChange: handleDateOfAdmissionChange,
      invalid: dateOfAdmissionInvalid,
      errorMessage: dateOfAdmissionErrorMessage,
    },
    {
      type: 'text',
      id: 'inputEthnicity',
      label: 'Dân tộc*',
      value: ethnicity,
      onChange: handleEthnicityChange,
      invalid: ethnicityInvalid,
      errorMessage: ethnicityErrorMessage,
    },
    {
      type: 'text',
      id: 'inputReligion',
      label: 'Tôn giáo*',
      value: religion,
      onChange: handleReligionChange,
      invalid: religionInvalid,
      errorMessage: religionErrorMessage,
    },
    {
      type: 'select',
      id: 'inputProvinceId',
      label: 'Tỉnh/Thành phố*',
      value: provinceId,
      onChange: handleProvinceIdChange,
      invalid: provinceIdInvalid,
      errorMessage: provinceIdErrorMessage,
      options: provinces.map((province) => ({
        label: province.province_name,
        value: province.province_id,
      })),
    },
    {
      type: 'select',
      id: 'inputDistrictId',
      label: 'Quận/Huyện*',
      value: districtId,
      onChange: handleDistrictIdChange,
      invalid: districtIdInvalid,
      errorMessage: districtIdErrorMessage,
      options: districts.map((district) => ({
        label: district.district_name,
        value: district.district_id,
      })),
    },
    {
      type: 'select',
      id: 'inputWardId',
      label: 'Phường/Xã*',
      value: wardId,
      onChange: handleWardIdChange,
      invalid: wardIdInvalid,
      errorMessage: wardIdErrorMessage,
      options: wards.map((ward) => ({
        label: ward.ward_name,
        value: ward.ward_id,
      })),
    },
    {
      type: 'text',
      id: 'inputAddressDetail',
      label: 'Địa chỉ chi tiết',
      value: addressDetail,
      onChange: handleAddressDetailChange,
    },
    {
      type: 'select',
      id: 'inputOrphanageTypeId',
      label: 'Kiểu mồ côi*',
      value: orphanageTypeId,
      onChange: handleOrphanageTypeIdChange,
      invalid: orphanageTypeIdInvalid,
      errorMessage: orphanageTypeIdErrorMessage,
      options: orphaneTypes.map((orphaneType) => ({
        label: orphaneType.orphan_type_name,
        value: orphaneType.orphan_type_id,
      })),
    },
    {
      type: 'radio',
      id: 'inputWaitingAdoption',
      label: 'Trạng thái chờ được nhận nuôi*',
      value: isWaitingAdoption,
      onChange: handleIsWaitingAdoptionChange,
      invalid: isWaitingAdoptionInvalid,
      errorMessage: isWaitingAdoptionErrorMessage,
      options: [
        { label: 'Có', value: 1 },
        { label: 'không', value: 0 },
      ],
    },
    {
      type: 'textarea',
      id: 'inputCircumstance',
      label: 'Hoàn cảnh*',
      value: circumstance,
      onChange: handleCircumstanceChange,
    },
    {
      type: 'file',
      id: 'inputImageFileName',
      label: 'Chọn ảnh*',
      key: fileImageKey,
      onChange: handleImageChange,
      invalid: imageFileInvalid,
      errorMessage: imageFileErrorMessage,
    },
  ]

  return (
    <>
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
            <CCardHeader>
              <h4>Thêm trẻ em</h4>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit}>
                {inputs.map((input) => (
                  <HorizontalFormInput key={input.id} {...input} />
                ))}

                {documentInputs.map((input) => (
                  <HorizontalFormInput key={input.id} {...input} />
                ))}
                <CCol xs={12}>
                  <CButton type="submit" disabled={!formValid}>
                    Lưu
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CreateChildren
