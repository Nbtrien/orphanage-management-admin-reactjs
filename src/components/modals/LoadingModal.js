import React from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalBody, CSpinner } from '@coreui/react'

const LoadingModal = ({ isVisible, setVisible }) => {
  return (
    <CModal
      backdrop="static"
      alignment="center"
      className="bg-transparent modal-transparent"
      visible={isVisible}
      onClose={setVisible}
    >
      <CModalBody>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <CSpinner color="light" className="spinner-xl" />
          <h4 className="text-white">Đang tải ...</h4>
        </div>
      </CModalBody>
    </CModal>
  )
}

LoadingModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
}

export default LoadingModal
