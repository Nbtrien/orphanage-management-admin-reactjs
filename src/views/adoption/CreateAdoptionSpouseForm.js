import { CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import validator from 'validator'
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import PropTypes from 'prop-types'

const CreateAdoptionSpouseForm = ({ spouse, setSpouse, formValid, setFormValid }) => {
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
  })

  useEffect(() => {
    let isValid = true

    isValid =
      spouse.first_name &&
      spouse.last_name &&
      spouse.date_of_birth &&
      spouse.gender &&
      spouse.nationality &&
      spouse.ethnicity &&
      spouse.religion &&
      spouse.phone_number &&
      spouse.address.province_id &&
      spouse.address.district_id &&
      spouse.address.ward_id

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [spouse, formValidate])

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
    if (spouse.address.province_id) {
      const province = provinces.find(
        (province) => province.province_id == spouse.address.province_id,
      )
      setDistricts(province.districts)
      setSpouse({
        ...spouse,
        address: {
          ...spouse.address,
          district_id: null,
          ward_id: null,
        },
      })
    }
  }, [spouse.address.province_id])

  // Init wards select options
  useEffect(() => {
    if (spouse.address.district_id) {
      const district = districts.find(
        (district) => district.district_id == spouse.address.district_id,
      )
      if (district?.wards) {
        setWards(district?.wards)
        setSpouse({
          ...spouse,
          address: {
            ...spouse.address,
            ward_id: null,
          },
        })
      }
    }
  }, [spouse.address.district_id, districts])

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

  const handleSpouseInputChange = (event) => {
    const { name, value } = event.target
    setSpouse({
      ...spouse,
      [name]: value,
    })

    let isFieldValid = true
    switch (name) {
      case 'mail_address':
        isFieldValid = !validator.isEmpty(value) && !validator.isEmail(value)
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
  const handleSpouseAddressChange = (event) => {
    const { name, value } = event.target
    setSpouse({
      ...spouse,
      address: {
        ...spouse.address,
        [name]: value,
      },
    })
  }

  const inputs = [
    {
      type: 'text',
      id: 'inputspouseFirstName',
      label: 'Nhập tên*',
      name: 'first_name',
      value: spouse.first_name,
      onChange: handleSpouseInputChange,
      invalid: formValidate.first_name.invalid,
      errorMessage: formValidate.first_name.errorMessage,
    },
    {
      type: 'text',
      id: 'inputspouseLastName',
      label: 'Nhập họ và tên đệm*',
      name: 'last_name',
      value: spouse.last_name,
      onChange: handleSpouseInputChange,
      invalid: formValidate.last_name.invalid,
      errorMessage: formValidate.last_name.errorMessage,
    },
    {
      type: 'date',
      id: 'inputspouseDOB',
      label: 'Nhập ngày sinh*',
      name: 'date_of_birth',
      value: spouse.date_of_birth,
      onChange: handleSpouseInputChange,
      invalid: formValidate.date_of_birth.invalid,
      errorMessage: formValidate.date_of_birth.errorMessage,
    },
    {
      type: 'text',
      id: 'inputspouseNationality',
      label: 'Nhập quốc tịch*',
      name: 'nationality',
      value: spouse.nationality,
      onChange: handleSpouseInputChange,
      invalid: formValidate.nationality.invalid,
      errorMessage: formValidate.nationality.errorMessage,
    },
    {
      type: 'text',
      id: 'inputspouseEthnicity',
      label: 'Nhập dân tộc*',
      name: 'ethnicity',
      value: spouse.ethnicity,
      onChange: handleSpouseInputChange,
      invalid: formValidate.ethnicity.invalid,
      errorMessage: formValidate.ethnicity.errorMessage,
    },
    {
      type: 'text',
      id: 'inputspouseReligion',
      label: 'Nhập tôn giáo*',
      name: 'religion',
      value: spouse.religion,
      onChange: handleSpouseInputChange,
      invalid: formValidate.religion.invalid,
      errorMessage: formValidate.religion.errorMessage,
    },
    {
      type: 'select',
      id: 'inputspouseGender',
      label: 'Chọn giới tính*',
      name: 'gender',
      value: spouse.gender,
      onChange: handleSpouseInputChange,
      invalid: formValidate.gender.invalid,
      errorMessage: formValidate.gender.errorMessage,
      options: [
        { label: 'Nam', value: 1 },
        { label: 'Nữ', value: 2 },
        { label: 'Khác', value: 0 },
      ],
    },
    {
      type: 'number',
      id: 'inputspousePhone',
      label: 'Nhập số điện thoại*',
      name: 'phone_number',
      value: spouse.phone_number,
      onChange: handleSpouseInputChange,
      invalid: formValidate.phone_number.invalid,
      errorMessage: formValidate.phone_number.errorMessage,
    },
    {
      type: 'text',
      id: 'inputspouseEmail',
      label: 'Nhập địa chỉ email*',
      name: 'mail_address',
      value: spouse.mail_address,
      onChange: handleSpouseInputChange,
      invalid: formValidate.mail_address.invalid,
      errorMessage: formValidate.mail_address.errorMessage,
    },
    {
      type: 'number',
      id: 'inputSpouseCitizen',
      label: 'Nhập số căn cước công dân*',
      name: 'citizen_id_number',
      value: spouse.citizen_id_number,
      onChange: handleSpouseInputChange,
      invalid: formValidate.citizen_id_number.invalid,
      errorMessage: formValidate.citizen_id_number.errorMessage,
    },
    {
      type: 'select',
      id: 'inputProvinceId',
      label: 'Chọn Tỉnh/Thành phố*',
      name: 'province_id',
      value: spouse.address.province_id,
      onChange: handleSpouseAddressChange,
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
      value: spouse.address.district_id,
      onChange: handleSpouseAddressChange,
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
      value: spouse.address.ward_id,
      onChange: handleSpouseAddressChange,
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
      value: spouse.address.address_detail,
      onChange: handleSpouseAddressChange,
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

CreateAdoptionSpouseForm.propTypes = {
  spouse: PropTypes.any,
  setSpouse: PropTypes.func,
  formValid: PropTypes.any,
  setFormValid: PropTypes.any,
}

export default CreateAdoptionSpouseForm
