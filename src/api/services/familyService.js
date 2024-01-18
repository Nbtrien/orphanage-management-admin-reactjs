import AxiosPrivate from '../axiosPrivate'

const familyService = () => {
  const instance = AxiosPrivate()
  const familyApi = {
    getFamilies: (params) => {
      const url = '/families'
      return instance.get(url, params)
    },
    getConditions: (params) => {
      const url = '/families/conditions'
      return instance.get(url, params)
    },
    searchFamilies: (params) => {
      const url = '/families/search'
      return instance.get(url, params)
    },
    getAllMothersAvailable: (params) => {
      const url = '/families/mothers'
      return instance.get(url, params)
    },
    getFamilyConditions: (params) => {
      const url = '/families/family-conditions'
      return instance.get(url, params)
    },
    createFamily: (data) => {
      const url = '/families'
      return instance.post(url, data)
    },
    getFamilyDetail: (id) => {
      const url = '/families/' + id
      return instance.get(url)
    },
    getFamiliesForChildren: (childrenId) => {
      const url = '/families?children_id=' + childrenId
      return instance.get(url)
    },
    getFamilyDonationStats: (params) => {
      const url = '/families/donation-statistics'
      return instance.get(url, params)
    },
    getFamilyDonationStatsDetail: (id) => {
      const url = '/families/donation-statistics/' + id
      return instance.get(url)
    },
    addNewFamilyPost: (id, data) => {
      const url = '/families/' + id + '/posts'
      return instance.post(url, data)
    },
    addNewConditions: (data) => {
      const url = '/families/family-conditions'
      return instance.post(url, data)
    },
    deleteFamily: (params) => {
      const url = '/families'
      return instance.delete(url, params)
    },
    updateMotherForFamily: (familyId, motherId) => {
      const url = '/families/' + familyId + '/mothers/' + motherId
      return instance.patch(url)
    },
    deleteChildren: (familyId, params) => {
      const url = '/families/' + familyId + '/delete-children?ids=' + params.ids
      return instance.patch(url)
    },
    getFamilyPostUpdateInfo: (id) => {
      const url = '/families/' + id + '/posts/update-info'
      return instance.get(url)
    },
    exportFamilyDonationStatsToExcel: () => {
      const url = '/families/donation-statistics/export-to-excel'
      return instance.get(url, { responseType: 'blob' })
    },
  }
  return familyApi
}

export default familyService
