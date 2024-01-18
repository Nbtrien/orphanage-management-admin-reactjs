import React from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const ConfirmModal = ({ isVisible, setVisible, handleConfirmBtnClick, modalMessage }) => {
  return (
    <CModal backdrop="static" visible={isVisible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{modalMessage?.modalTile}</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalMessage?.modalContent}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Hủy bỏ
        </CButton>
        <CButton color="primary" onClick={handleConfirmBtnClick}>
          Xác nhận
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ConfirmModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  handleConfirmBtnClick: PropTypes.func.isRequired,
  modalMessage: PropTypes.shape({
    modalTile: PropTypes.string.isRequired,
    modalContent: PropTypes.node.isRequired,
  }).isRequired,
}

export default ConfirmModal
