import AxiosPrivate from '../axiosPrivate'

const donationService = () => {
  const instance = AxiosPrivate()

  const donationApi = {
    fetchDonations: (params) => {
      const url = '/donations'
      return instance.get(url, params)
    },
    fetchFundingUsage: (params) => {
      const url = '/donations/funding-usage'
      return instance.get(url, params)
    },
    fetchDonors: (params) => {
      const url = '/donors'
      return instance.get(url, params)
    },
    fetchDonationPurposes: (params) => {
      const url = '/donation-purposes'
      return instance.get(url, params)
    },
    getDonationDetail: (id) => {
      const url = '/donations/' + id
      return instance.get(url)
    },
    getDonorDetail: (id) => {
      const url = '/donors/' + id
      return instance.get(url)
    },
    getFundingUsageDetail: (id) => {
      const url = '/donations/funding-usage/' + id
      return instance.get(url)
    },
    getDonationPurposeDetail: (id) => {
      const url = '/donation-purposes/' + id
      return instance.get(url)
    },
    getDonationStats: () => {
      const url = '/donations/stats'
      return instance.get(url)
    },
    getDonationsUsableByPurpose: (purposeId, params) => {
      const url = '/purposes/' + purposeId + '/donations/usable'
      return instance.get(url, params)
    },
    useDonationByPurpose: (purposeId, data) => {
      const url = '/donations/purpose/' + purposeId + '/use'
      return instance.post(url, data)
    },
    useDonationById: (id, data) => {
      const url = '/donations/' + id + '/use'
      return instance.post(url, data)
    },
    addNewDonationPurposePost: (id, data) => {
      const url = 'donation-purposes/' + id + '/posts'
      return instance.post(url, data)
    },
    addNewDonationPurpose: (data) => {
      const url = 'donation-purposes'
      return instance.post(url, data)
    },
    updateDonationPurposeStatus: (id) => {
      const url = 'donation-purposes/' + id + '/update-status'
      return instance.patch(url)
    },
    getDonationPostUpdateInfo: (id) => {
      const url = 'donation-purposes/' + id + '/posts/update-info'
      return instance.get(url)
    },
    exportDonationsToExcel: () => {
      const url = 'donations/export-to-excel'
      return instance.get(url, { responseType: 'blob' })
    },
    exportFungdingUsagesToExcel: () => {
      const url = 'donations/funding-usage/export-to-excel'
      return instance.get(url, { responseType: 'blob' })
    },
    exportDonorsToExcel: () => {
      const url = 'donors/export-to-excel'
      return instance.get(url, { responseType: 'blob' })
    },
  }
  return donationApi
}

export default donationService
