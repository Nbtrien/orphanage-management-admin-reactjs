import { CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import validator from 'validator'
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import PropTypes from 'prop-types'

const CreateAdoptionApplicantForm = ({
  applicant,
  setApplicant,
  citizenFrontImage,
  setCitizenFrontImage,
  citizenBackImage,
  setCitizenBackImage,
  setFormValid,
}) => {
  const publicApi = publicService()
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [formValidate, setFormValidate] = useState({
    first_name: {
      invalid: false,
      errorMessage: 'Vui lòng điền tên',
    },
    last_name: {
      invalid: false,
      errorMessage: 'Vui lòng điền họ',
    },
    date_of_birth: {
      invalid: false,
      errorMessage: 'Ngày sinh không hợp lệ',
    },
    gender: {
      invalid: false,
      errorMessage: 'Vui lòng chọn giới tính',
    },
    ethnicity: {
      invalid: false,
      errorMessage: 'Vui lòng điền dân tộc',
    },
    nationality: {
      invalid: false,
      errorMessage: 'Vui lòng điền quốc tịch',
    },
    religion: {
      invalid: false,
      errorMessage: 'Vui lòng điền tôn giáo',
    },
    mail_address: {
      invalid: false,
      errorMessage: 'Địa chỉ email không hợp lệ',
    },
    phone_number: {
      invalid: false,
      errorMessage: 'Số điện thoại không hợp lệ',
    },
    citizen_id_number: {
      invalid: false,
      errorMessage: 'Số căn cước công dân không hợp lệ',
    },
    marital_status_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn tình trạng hôn nhân',
    },
  })

  useEffect(() => {
    let isValid = true
    isValid =
      applicant.first_name &&
      applicant.last_name &&
      applicant.date_of_birth &&
      applicant.gender &&
      applicant.nationality &&
      applicant.ethnicity &&
      applicant.religion &&
      applicant.phone_number &&
      applicant.mail_address &&
      applicant.citizen_id_number &&
      applicant.marital_status_id &&
      applicant.address.province_id &&
      applicant.address.district_id &&
      applicant.address.ward_id &&
      !!citizenFrontImage &&
      !!citizenBackImage

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [applicant, formValidate, citizenFrontImage, citizenBackImage])

  useEffect(() => {
    // Get provinces
    const getProvinces = async () => {
      try {
        const response = await publicApi.getProvince()
        setProvinces(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getProvinces()
  }, [])

  // Init districts select options
  useEffect(() => {
    if (applicant.address.province_id) {
      const province = provinces.find(
        (province) => province.province_id == applicant.address.province_id,
      )
      setDistricts(province.districts)
      setApplicant({
        ...applicant,
        address: {
          ...applicant.address,
          district_id: null,
          ward_id: null,
        },
      })
    }
  }, [applicant.address.province_id])

  // Init wards select options
  useEffect(() => {
    if (applicant.address.district_id) {
      const district = districts.find(
        (district) => district.district_id == applicant.address.district_id,
      )
      if (district?.wards) {
        setWards(district?.wards)
        setApplicant({
          ...applicant,
          address: {
            ...applicant.address,
            ward_id: null,
          },
        })
      }
    }
  }, [applicant.address.district_id, districts])

  const validateCitizenIdNumber = (citizenIdNumber) => {
    if (citizenIdNumber.length !== 12) {
      return false
    }

    for (let i = 0; i < 12; i++) {
      if (isNaN(citizenIdNumber[i])) {
        return false
      }
    }
    return true
  }

  const handleApplicantInputChange = (event) => {
    const { name, value } = event.target
    setApplicant({
      ...applicant,
      [name]: value,
    })

    let isFieldValid = true
    switch (name) {
      case 'mail_address':
        isFieldValid = !validator.isEmail(value)
        break
      case 'phone_number':
        isFieldValid = !(validator.isMobilePhone(value) && value.length == 10)
        break
      case 'date_of_birth':
        const currentDate = new Date()
        const selectedDate = new Date(value)
        if (validator.isEmpty(value)) {
          isFieldValid = validator.isEmpty(value)
        } else {
          isFieldValid = selectedDate > currentDate
        }
        break
      case 'citizen_id_number':
        isFieldValid = !validateCitizenIdNumber(value)
        break
      default:
        isFieldValid = validator.isEmpty(value)
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

  const handleApplicantAddressChange = (event) => {
    const { name, value } = event.target
    setApplicant({
      ...applicant,
      address: {
        ...applicant.address,
        [name]: value,
      },
    })
  }

  const handleFrontImageChange = (event) => {
    const file = event.target.files[0]
    setCitizenFrontImage(file)
  }

  const handleBackImageChange = (event) => {
    const file = event.target.files[0]
    setCitizenBackImage(file)
  }

  const inputs = [
    {
      type: 'text',
      id: 'inputApplicantFirstName',
      label: 'Nhập tên*',
      name: 'first_name',
      value: applicant.first_name,
      onChange: handleApplicantInputChange,
      invalid: formValidate.first_name.invalid,
      errorMessage: formValidate.first_name.errorMessage,
    },
    {
      type: 'text',
      id: 'inputApplicantLastName',
      label: 'Nhập họ và tên đệm*',
      name: 'last_name',
      value: applicant.last_name,
      onChange: handleApplicantInputChange,
      invalid: formValidate.last_name.invalid,
      errorMessage: formValidate.last_name.errorMessage,
    },
    {
      type: 'date',
      id: 'inputApplicantDOB',
      label: 'Nhập ngày sinh*',
      name: 'date_of_birth',
      value: applicant.date_of_birth,
      onChange: handleApplicantInputChange,
      invalid: formValidate.date_of_birth.invalid,
      errorMessage: formValidate.date_of_birth.errorMessage,
    },
    {
      type: 'text',
      id: 'inputApplicantNationality',
      label: 'Nhập quốc tịch*',
      name: 'nationality',
      value: applicant.nationality,
      onChange: handleApplicantInputChange,
      invalid: formValidate.nationality.invalid,
      errorMessage: formValidate.nationality.errorMessage,
    },
    {
      type: 'text',
      id: 'inputApplicantEthnicity',
      label: 'Nhập dân tộc*',
      name: 'ethnicity',
      value: applicant.ethnicity,
      onChange: handleApplicantInputChange,
      invalid: formValidate.ethnicity.invalid,
      errorMessage: formValidate.ethnicity.errorMessage,
    },
    {
      type: 'text',
      id: 'inputApplicantReligion',
      label: 'Nhập tôn giáo*',
      name: 'religion',
      value: applicant.religion,
      onChange: handleApplicantInputChange,
      invalid: formValidate.religion.invalid,
      errorMessage: formValidate.religion.errorMessage,
    },
    {
      type: 'select',
      id: 'inputApplicantGender',
      label: 'Chọn giới tính*',
      name: 'gender',
      value: applicant.gender,
      onChange: handleApplicantInputChange,
      invalid: formValidate.gender.invalid,
      errorMessage: formValidate.gender.errorMessage,
      options: [
        { label: 'Nam', value: 1 },
        { label: 'Nữ', value: 2 },
        { label: 'Khác', value: 0 },
      ],
    },
    {
      type: 'select',
      id: 'inputApplicantMarital',
      label: 'Chọn tình trạng hôn nhân*',
      name: 'marital_status_id',
      value: applicant.marital_status_id,
      onChange: handleApplicantInputChange,
      invalid: formValidate.marital_status_id.invalid,
      errorMessage: formValidate.marital_status_id.errorMessage,
      options: [
        { label: 'Chưa kết hôn', value: 1 },
        { label: 'Sống chung chưa kết hôn', value: 2 },
        { label: 'Đã có vợ/chồng', value: 3 },
        { label: 'Góa', value: 4 },
        { label: 'Ly hôn hoặc ly thân', value: 5 },
      ],
    },
    {
      type: 'number',
      id: 'inputApplicantPhone',
      label: 'Nhập số điện thoại*',
      name: 'phone_number',
      value: applicant.phone_number,
      onChange: handleApplicantInputChange,
      invalid: formValidate.phone_number.invalid,
      errorMessage: formValidate.phone_number.errorMessage,
    },
    {
      type: 'text',
      id: 'inputApplicantEmail',
      label: 'Nhập địa chỉ email*',
      name: 'mail_address',
      value: applicant.mail_address,
      onChange: handleApplicantInputChange,
      invalid: formValidate.mail_address.invalid,
      errorMessage: formValidate.mail_address.errorMessage,
    },
    {
      type: 'select',
      id: 'inputProvinceId',
      label: 'Chọn Tỉnh/Thành phố*',
      name: 'province_id',
      value: applicant.address.province_id,
      onChange: handleApplicantAddressChange,
      options: provinces.map((province) => ({
        label: province.province_name,
        value: province.province_id,
      })),
    },
    {
      type: 'select',
      id: 'inputDistrictId',
      label: 'Chọn Quận/Huyện*',
      name: 'district_id',
      value: applicant.address.district_id,
      onChange: handleApplicantAddressChange,
      options: districts.map((district) => ({
        label: district.district_name,
        value: district.district_id,
      })),
    },
    {
      type: 'select',
      id: 'inputWardId',
      label: 'Chọn Phường/Xã*',
      name: 'ward_id',
      value: applicant.address.ward_id,
      onChange: handleApplicantAddressChange,
      options: wards.map((ward) => ({
        label: ward.ward_name,
        value: ward.ward_id,
      })),
    },
    {
      type: 'text',
      id: 'inputAddressDetail',
      label: 'Địa chỉ chi tiết',
      name: 'address_detail',
      value: applicant.address.address_detail,
      onChange: handleApplicantAddressChange,
    },
    {
      col: 12,
      type: 'number',
      id: 'inputApplicantCitizen',
      label: 'Nhập số căn cước công dân*',
      name: 'citizen_id_number',
      value: applicant.citizen_id_number,
      onChange: handleApplicantInputChange,
      invalid: formValidate.citizen_id_number.invalid,
      errorMessage: formValidate.citizen_id_number.errorMessage,
    },
    {
      formLabel: 'Chọn ảnh CCCD mặc trước*',
      type: 'file',
      id: 'inputCitizenImg1',
      label: 'Chọn ảnh CCCD mặc trước*',
      onChange: handleFrontImageChange,
    },
    {
      formLabel: 'Chọn ảnh CCCD mặc sau*',
      type: 'file',
      id: 'inputCitizenImg2',
      label: 'Chọn ảnh CCCD mặc sau*',
      onChange: handleBackImageChange,
    },
  ]

  return (
    <>
      <CTable responsive bordered className="form-table overflow-hidden table-border-2">
        <CTableBody>
          {inputs.map((input, index) => (
            <FormInputDataCell key={index} {...input} />
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

CreateAdoptionApplicantForm.propTypes = {
  applicant: PropTypes.any,
  setApplicant: PropTypes.func,
  citizenFrontImage: PropTypes.any,
  setCitizenFrontImage: PropTypes.any,
  citizenBackImage: PropTypes.any,
  setCitizenBackImage: PropTypes.any,
  formValid: PropTypes.any,
  setFormValid: PropTypes.any,
}

export default CreateAdoptionApplicantForm
