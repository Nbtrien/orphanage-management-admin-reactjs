import AxiosPrivate from '../axiosPrivate'

const accountService = () => {
  const instance = AxiosPrivate()
  const accountApi = {
    fetchAccounts: (params) => {
      const url = '/accounts'
      return instance.get(url, params)
    },
    updateAccountStatus: (accountId, status) => {
      const url = '/accounts/' + accountId + '/update-status/' + status
      return instance.patch(url)
    },
    fetchAppointment: (params) => {
      const url = '/appointments'
      return instance.get(url, params)
    },
    getAppointmentCalendar: () => {
      const url = '/appointments/calendar'
      return instance.get(url)
    },
    approveAppointment: (params) => {
      const url = '/appointments/approve?ids=' + params.ids
      return instance.patch(url)
    },
    declineAppointment: (params) => {
      const url = '/appointments/decline?ids=' + params.ids
      return instance.patch(url)
    },
    updateAppointmentStatus: (status, params) => {
      const url = '/appointments/update-status/' + status + '?ids=' + params.ids
      return instance.patch(url)
    },
  }
  return accountApi
}

export default accountService
