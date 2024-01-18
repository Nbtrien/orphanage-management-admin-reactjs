import AxiosPrivate from '../axiosPrivate'

const childrenService = () => {
  const instance = AxiosPrivate()
  const childrenApi = {
    getDocumentTypes: () => {
      const url = 'children/document-types'
      return instance.get(url)
    },
    getOrphantypes: () => {
      const url = '/orphan-types'
      return instance.get(url)
    },
    getChildrenStatus: () => {
      const url = '/children-status'
      return instance.get(url)
    },
    getChildrenStatusOptions: (id) => {
      const url = '/children/' + id + '/update-status'
      return instance.get(url)
    },
    createChildren: (data) => {
      const url = '/children'
      return instance.post(url, data)
    },
    getChildrens: (params) => {
      const url = '/children'
      return instance.get(url, params)
    },
    getAllChildrenStatus: (params) => {
      const url = '/children/status'
      return instance.get(url, params)
    },
    getAllChildrenRecord: (params) => {
      const url = '/children/records'
      return instance.get(url, params)
    },
    getChildrenDetail: (id) => {
      const url = '/children/' + id
      return instance.get(url)
    },
    getMedicalVaccinationRecords: (id) => {
      const url = '/children/' + id + '/medical-vaccination-records'
      return instance.get(url)
    },
    getMedicalRecords: (id) => {
      const url = '/children/' + id + '/medical-records'
      return instance.get(url)
    },
    getVaccinationRecords: (id) => {
      const url = '/children/' + id + '/vaccination-records'
      return instance.get(url)
    },
    getStatusHistory: (id) => {
      const url = '/children/' + id + '/status-history'
      return instance.get(url)
    },
    getFamilyHistory: (id) => {
      const url = '/children/' + id + '/family-history'
      return instance.get(url)
    },
    getChildrenRelatives: (id) => {
      const url = '/children/' + id + '/relatives'
      return instance.get(url)
    },
    getChildrenUpdateInfo: (id) => {
      const url = '/children/' + id + '/update-info'
      return instance.get(url)
    },
    deleteChildren: (params) => {
      const url = '/children'
      return instance.delete(url, params)
    },
    searchChildren: (params) => {
      const url = '/children/search'
      return instance.get(url, params)
    },
    searchChildrenStatus: (params) => {
      const url = '/children/status/search'
      return instance.get(url, params)
    },
    getChildrenByFamilyId: (familyId) => {
      const url = '/children/family/' + familyId
      return instance.get(url)
    },
    createRelatives: (childrenId, data) => {
      const url = '/children/' + childrenId + '/relatives'
      return instance.post(url, data)
    },
    createMedicalRecords: (childrenId, data) => {
      const url = '/children/' + childrenId + '/medical-records'
      return instance.post(url, data)
    },
    createVaccinationRecords: (childrenId, data) => {
      const url = '/children/' + childrenId + '/vaccination-records'
      return instance.post(url, data)
    },
    setFamilyForChildren: (childrenId, familyId) => {
      const url = '/children/' + childrenId + '/set-family?family_id=' + familyId
      return instance.put(url)
    },
    updateChildrenInfo: (id, data) => {
      const url = '/children/' + id + '/update-info'
      return instance.put(url, data)
    },
    uploadDocuments: (childrenId, data) => {
      const url = '/children/' + childrenId + '/upload-documents'
      return instance.put(url, data)
    },
    updateDocuments: (childrenId, data) => {
      const url = '/children/' + childrenId + '/update-documents'
      return instance.put(url, data)
    },
    updateAdoptionStatus: (childrenId, adoptionStatus) => {
      const url = '/children/' + childrenId + '/adoption-status?adoption_status=' + adoptionStatus
      return instance.put(url)
    },
    deleteRelative: (childrenId, relativeId) => {
      const url = '/children/' + childrenId + '/relatives/' + relativeId + '/delete-relative'
      return instance.patch(url)
    },
    deleteMedicalRecord: (id) => {
      const url = '/medical-records/' + id
      return instance.delete(url)
    },
    deleteVaccinationRecord: (id) => {
      const url = '/vaccinations-records/' + id
      return instance.delete(url)
    },
    updateChildrenStatus: (id, data) => {
      const url = '/children/' + id + '/update-status'
      return instance.put(url, data)
    },
  }
  return childrenApi
}

export default childrenService
