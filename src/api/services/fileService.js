import AxiosPrivate from '../axiosPrivate'

const fileService = () => {
  const instance = AxiosPrivate()
  const fileApi = {
    getPresignedUrl: (fileName, folderPath) => {
      const url = 'files'
      return instance.post(url, {
        fileName: fileName,
        folderPath: folderPath,
      })
    },
  }
  return fileApi
}

export default fileService
