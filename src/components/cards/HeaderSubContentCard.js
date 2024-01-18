import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CFormInput, CRow } from '@coreui/react'

const HeaderSubContentCard = ({ label, content }) => {
  return (
    <CRow className="header-content-custom">
      <CCol className="header-content-left" lg={5}>
        {label}
      </CCol>
      <CCol className="header-content-right" lg={7}>
        <CFormInput value={content} readOnly />
      </CCol>
    </CRow>
  )
}

HeaderSubContentCard.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
}

export default HeaderSubContentCard
