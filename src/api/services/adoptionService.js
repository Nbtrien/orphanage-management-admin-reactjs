import AxiosPrivate from '../axiosPrivate'

const adoptionService = () => {
  const instance = AxiosPrivate()
  const adoptionApi = {
    getAllAdoptionApplication: (params) => {
      const url = 'adoption-application'
      return instance.get(url, params)
    },
    getAdoptionApplicationDetails: (id) => {
      const url = 'adoption-application/' + id
      return instance.get(url)
    },
    confirmAdoptionApplication: (id) => {
      const url = 'adoption-application/' + id + '/confirm'
      return instance.put(url)
    },
    declineAdoptionApplication: (id) => {
      const url = 'adoption-application/' + id + '/decline'
      return instance.put(url)
    },
    getChildrenForHistory: () => {
      const url = 'adoption-history/children'
      return instance.get(url)
    },
    createAdoptionHistory: (data) => {
      const url = 'adoption-history'
      return instance.post(url, data)
    },
    getAllAdoptionHistory: (params) => {
      const url = 'adoption-history'
      return instance.get(url, params)
    },
    getAdoptionHistoryDetail: (id) => {
      const url = 'adoption-history/' + id
      return instance.get(url)
    },
    getApplicationForCreateHistory: (id) => {
      const url = 'adoption-history/application/' + id
      return instance.get(url)
    },
    createAdoptionHistoryFromApplication: (id, data) => {
      const url = 'adoption-history/application/' + id
      return instance.post(url, data)
    },
  }
  return adoptionApi
}

export default adoptionService
