import AxiosPrivate from '../axiosPrivate'

const statisticsService = () => {
  const instance = AxiosPrivate()
  const statisticsApi = {
    getSummaryStatistics: () => {
      const url = '/statistics/summary'
      return instance.get(url)
    },
    getChildrenStatisticsByGender: () => {
      const url = '/statistics/children/count-by-gender'
      return instance.get(url)
    },
    getChildrenStatisticsByAge: () => {
      const url = '/statistics/children/count-by-age'
      return instance.get(url)
    },
    getChildrenStatisticsByStatus: () => {
      const url = '/statistics/children/count-by-status'
      return instance.get(url)
    },
    getChildrenStatisticsByFamily: () => {
      const url = '/statistics/children/count-by-family'
      return instance.get(url)
    },

    getDonationStatisticsBymonth: () => {
      const url = '/statistics/donation/count-by-month'
      return instance.get(url)
    },
    getDonationStatisticsByPurpose: (params) => {
      const url = '/statistics/donation/count-by-purpose'
      return instance.get(url, params)
    },
    getDonationStatisticsByFamily: (params) => {
      const url = '/statistics/donation/count-by-family'
      return instance.get(url, params)
    },
    getTopDonor: (params) => {
      const url = '/statistics/donation/donor/top'
      return instance.get(url, params)
    },
  }
  return statisticsApi
}

export default statisticsService
