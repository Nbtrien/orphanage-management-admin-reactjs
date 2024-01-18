import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CProgress,
  CProgressBar,
} from '@coreui/react'
import { cilCloudUpload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FaCheck, FaFileAlt } from 'react-icons/fa'
import { fileToBinary } from 'src/utils/fileToBinary'
import axios from 'axios'
import fileService from 'src/api/services/fileService'

const DragDropFile = ({
  isVisible,
  setVisible,
  uploadDocumentData,
  setUploadDocumentData,
  handleSubmitBtnClick,
}) => {
  const fileApi = fileService()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [file, setFile] = useState()
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [isUploading, setIsUploading] = useState(false) // Trạng thái kiểm soát việc tải lên

  const inputRef = React.useRef(null)

  const handleDrag = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isUploading) {
      // Chỉ cho phép kéo và thả nếu không trong trạng thái đang tải lên
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0])
        setUploadProgress(0)
        setIsFileUploaded(true)
        handleFiles(e.dataTransfer.files)
      }
    }
  }

  const handleChange = function (e) {
    e.preventDefault()
    if (!isUploading) {
      // Chỉ cho phép chọn tệp nếu không trong trạng thái đang tải lên
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0])
        setUploadProgress(0)
        setIsFileUploaded(true)
        handleFiles(e.target.files)
      }
    }
  }

  const onButtonClick = () => {
    if (!isUploading) {
      // Chỉ cho phép chọn tệp nếu không trong trạng thái đang tải lên
      inputRef.current.click()
    }
  }

  const handleFiles = (files) => {
    simulateUploadProgress(files[0])
  }

  const simulateUploadProgress = (file) => {
    const totalSize = file.size
    let loaded = 0

    const updateProgress = () => {
      if (loaded < totalSize) {
        const increment = Math.min(100000, totalSize - loaded)
        loaded += increment
        setUploadProgress((loaded / totalSize) * 100)

        if (loaded < totalSize) {
          setTimeout(updateProgress, 100)
        } else {
          setIsUploading(false)
        }
      }
    }

    setIsUploading(true)
    setTimeout(updateProgress, 100)
  }

  const truncateFilename = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + '...'
    }
    return name
  }

  const handleSubmit = async () => {
    if (!isUploading) {
      setIsUploading(true)

      try {
        const response = await fileApi.getPresignedUrl(file.name, 'documents')
        if (response.status === 200) {
          const result = response.result
          let presignedUrl = result.presigned_url
          const binaryData = await fileToBinary(file)
          try {
            await axios.put(presignedUrl, binaryData, {
              headers: {
                'Content-Type': file.type,
              },
            })
            setUploadDocumentData((uploadDocumentData) => ({
              ...uploadDocumentData,
              file: {
                fileName: result.file_name,
                filePath: result.file_path,
              },
            }))
            setUploadProgress(0)
            setIsFileUploaded(false)
            setFile()
            setVisible(false)
          } catch (err) {
            setUploadDocumentData((uploadDocumentData) => ({
              ...uploadDocumentData,
              error: err,
            }))
            setUploadProgress(0)
            setIsFileUploaded(false)
            setFile()
            setVisible(false)
          }
        }
      } catch (error) {
        setUploadDocumentData((uploadDocumentData) => ({
          ...uploadDocumentData,
          error: error,
        }))
        setUploadProgress(0)
        setIsFileUploaded(false)
        setFile()
        setVisible(false)
      }
    }
  }

  const handleCloseBtnClick = () => {
    setUploadProgress(0)
    setIsUploading(false)
    setFile()
    setVisible(false)
  }

  return (
    <>
      <CModal
        backdrop="static"
        alignment="center"
        className="bg-transparent "
        visible={isVisible}
        onClose={handleCloseBtnClick}
      >
        <CModalHeader>
          <CModalTitle>Tải tệp lên</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex flex-column">
            <form
              id="form-file-upload"
              onDragEnter={handleDrag}
              onSubmit={(e) => e.preventDefault()}
            >
              <CFormInput
                ref={inputRef}
                type="file"
                id="input-file-upload"
                onChange={handleChange}
              />
              <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={dragActive ? 'drag-active' : ''}
              >
                <div className="gap-2 d-flex flex-column justify-content-center">
                  <div>
                    <CIcon icon={cilCloudUpload} size="3xl" />
                  </div>
                  <h4>Kéo và thả tệp ở đây để tải lên</h4>
                  <h6>hoặc</h6>
                  <div>
                    <CButton onClick={onButtonClick} disabled={isUploading}>
                      Chọn tệp từ thiết bị
                    </CButton>
                  </div>
                </div>
              </label>

              {dragActive && (
                <div
                  id="drag-file-element"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                ></div>
              )}
            </form>
            {uploadProgress > 0 && (
              <div className="mt-3 d-flex gap-3">
                <div>
                  <FaFileAlt size="1.9rem" />
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between">
                    <strong
                      title={file?.name}
                      style={{
                        width: '60%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {truncateFilename(file?.name, 20)}{' '}
                    </strong>
                    {uploadProgress === 100 ? (
                      <>
                        <FaCheck />
                      </>
                    ) : (
                      <b>{Math.round(uploadProgress)}%</b>
                    )}
                  </div>
                  <CProgress className="h-3">
                    <CProgressBar value={uploadProgress}></CProgressBar>
                  </CProgress>
                </div>
              </div>
            )}
            {isFileUploaded && uploadProgress === 100 && (
              <div className="mt-3 d-flex justify-content-end">
                <CButton color="primary" onClick={handleSubmit} disabled={isUploading}>
                  Lưu
                </CButton>
              </div>
            )}
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}

DragDropFile.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  handleSubmitBtnClick: PropTypes.func,
  uploadDocumentData: PropTypes.any,
  setUploadDocumentData: PropTypes.func,
}

export default DragDropFile
