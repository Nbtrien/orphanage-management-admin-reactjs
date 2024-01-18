import React, { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import viVN from 'date-fns/locale/vi'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import volunteerService from 'src/api/services/volunteerService'
import accountService from 'src/api/services/accountService'
import AppointmentStatus from 'src/constants/AppointmentStatus'

const locales = {
  'vi-VN': viVN,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const AppointmentCalendar = () => {
  const accountApi = accountService()

  const [events, setEvents] = useState([])

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await accountApi.getAppointmentCalendar()
        const result = response.result
        setEvents(
          result.map((event) => ({
            title: event.applicant_full_name,
            start: new Date(event.appointment_start_date_time),
            end: new Date(event.appointment_end_date_time),
            status: getStatusFromDateTime(event),
          })),
        )
      } catch (error) {
        console.log(error)
      }
    }
    getEvents()
  }, [])

  const getStatusFromDateTime = (evnt) => {
    const now = new Date()
    const appointmentStartDateTime = new Date(evnt.appointment_start_date_time)
    console.log(appointmentStartDateTime > now)
    let status = ''
    switch (evnt.appointment_status) {
      case AppointmentStatus.pending.code:
        if (appointmentStartDateTime > now) {
          status = 'not_confirmed'
        }
        break
      case AppointmentStatus.approved.code:
        if (appointmentStartDateTime > now) {
          status = 'confirmed'
        } else if (appointmentStartDateTime <= now && evnt.appointment_end_date_time >= now) {
          status = 'ongoing'
        } else if (appointmentStartDateTime > now) {
          status = 'not_completed'
        }
        break
      case AppointmentStatus.completed.code:
        status = 'completed'
        break
      default:
        status = 'status'
        break
    }

    return status
  }

  const eventPropGetter = (event) => {
    if (event.status === 'not_confirmed') {
      return {
        className: 'not-confirmed-event',
      }
    } else if (event.status === 'completed') {
      return {
        className: 'completed-event',
      }
    } else if (event.status === 'confirmed') {
      return {
        className: 'confirmed-event',
      }
    } else if (event.status === 'not_completed') {
      return {
        className: 'not-completed-event',
      }
    } else if (event.status === 'ongoing') {
      return {
        className: 'ongoing-event',
      }
    }
    return {}
  }

  console.log(events)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 card-custom">
          <CCardHeader>
            <div className="header-title-custom">Lịch hẹn</div>
          </CCardHeader>
          <CCardBody>
            <div>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventPropGetter}
                style={{ height: 600 }}
              />
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <div className="not-confirmed-event-lb">Chưa xác nhận</div>
              <div className="confirmed-event-lb">Đã xác nhận</div>
              <div className="ongoing-event-lb">Đang diễn ra</div>
              <div className="not-completed-event-lb">Đã diễn ra</div>
              <div className="completed-event-lb">Đã hoàn thành</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AppointmentCalendar
