import axiosPublic from '../axiosPublic'
const publicService = () => {
  const publicApi = {
    getProvince: () => {
      const url = '/provinces'
      return axiosPublic.get(url)
    },
    getDonationPurposes: () => {
      const url = '/donation-purposes'
      return axiosPublic.get(url)
    },
    getAllFamiliesForDonate: () => {
      const url = '/donations/families'
      return axiosPublic.get(url)
    },
    getAllArticleCategories: () => {
      const url = '/article-categories'
      return axiosPublic.get(url)
    },
    getWebsiteContact: () => {
      const url = '/content/website-contact'
      return axiosPublic.get(url)
    },
  }
  return publicApi
}

export default publicService
