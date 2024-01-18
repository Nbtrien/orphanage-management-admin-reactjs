import AxiosPrivate from '../axiosPrivate'

const contentService = () => {
  const instance = AxiosPrivate()
  const contentApi = {
    addFaq: (data) => {
      const url = '/content/faq'
      return instance.post(url, data)
    },
    addWebsiteContact: (data) => {
      const url = '/content/website-contact'
      return instance.post(url, data)
    },
    updateWebsiteContact: (id, data) => {
      const url = '/content/website-contact/' + id
      return instance.put(url, data)
    },
    fetchFaq: (params) => {
      const url = '/content/faq'
      return instance.get(url, params)
    },
    fetchWebsiteContact: (params) => {
      const url = '/content/website-contact'
      return instance.get(url, params)
    },
    fetchInformationPage: (params) => {
      const url = '/content/information-page-type'
      return instance.get(url, params)
    },
    deleteFaqs: (params) => {
      const url = '/content/faq'
      return instance.delete(url, params)
    },
  }
  return contentApi
}

export default contentService
