import React from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'

const SuccessModal = ({ isVisible, setVisible, modalMessage }) => {
  return (
    <CModal visible={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CIcon size="xxl" icon={cilCheckCircle} className="me-2" />
        <CModalTitle>{modalMessage?.modalTile}</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalMessage?.modalContent}</CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={() => setVisible(false)}>
          OK
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

SuccessModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  modalMessage: PropTypes.shape({
    modalTile: PropTypes.string.isRequired,
    modalContent: PropTypes.node.isRequired,
  }).isRequired,
}

export default SuccessModal
