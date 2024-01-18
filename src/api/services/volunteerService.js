import AxiosPrivate from '../axiosPrivate'

const volunteerService = () => {
  const instance = AxiosPrivate()
  const volunteerApi = {
    addNewEvent: (data) => {
      const url = '/events'
      return instance.post(url, data)
    },
    getAllEvents: (params) => {
      const url = '/events'
      return instance.get(url, params)
    },
    getEventDetail: (id) => {
      const url = '/events/' + id
      return instance.get(url)
    },
    getVolunteersByEventId: (id, params) => {
      const url = '/events/' + id + '/volunteers'
      return instance.get(url, params)
    },
    approveApplications: (id, params) => {
      const url = '/events/' + id + '/volunteers/approve?ids=' + params.ids
      return instance.patch(url)
    },
    declineApplications: (id, params) => {
      const url = '/events/' + id + '/volunteers/decline?ids=' + params.ids
      return instance.patch(url)
    },
    confirmNotAttendApplications: (id, params) => {
      const url = '/events/' + id + '/volunteers/not-attended?ids=' + params.ids
      return instance.patch(url)
    },
    approveEventApplications: (id, params) => {
      const url = '/volunteers/' + id + '/events/approve?ids=' + params.ids
      return instance.patch(url)
    },
    declineEventApplications: (id, params) => {
      const url = '/volunteers/' + id + '/events/decline?ids=' + params.ids
      return instance.patch(url)
    },
    updateEventApplication: (volunteerId, eventId, status) => {
      const url =
        '/volunteers/' +
        volunteerId +
        '/events/' +
        eventId +
        '/update-status?applicationStatus=' +
        status
      return instance.patch(url)
    },
    getAllVolunteers: (params) => {
      const url = '/volunteers'
      return instance.get(url, params)
    },
    getVolunteerDetail: (id) => {
      const url = '/volunteers/' + id
      return instance.get(url)
    },
    getEventsByVolunteerId: (id, params) => {
      const url = '/volunteers/' + id + '/events'
      return instance.get(url, params)
    },
    getEventsCalendar: () => {
      const url = '/events/calendar'
      return instance.get(url)
    },
  }
  return volunteerApi
}

export default volunteerService
