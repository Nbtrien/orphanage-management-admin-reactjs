import React, { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import viVN from 'date-fns/locale/vi'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import volunteerService from 'src/api/services/volunteerService'
import { parse as parseDateFns, format as formatDateFns } from 'date-fns-tz'
import moment from 'moment-timezone'

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

const EventCalender = () => {
  const volunteerApi = volunteerService()

  const [events, setEvents] = useState([])

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await volunteerApi.getEventsCalendar()
        const result = response.result
        setEvents(
          result.map((event) => ({
            title: event.title,
            start: new Date(event.event_start_date),
            end: new Date(event.event_end_date),
          })),
        )
      } catch (error) {
        console.log(error)
      }
    }
    getEvents()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 card-custom">
          <CCardHeader>
            <div className="header-title-custom">Lịch sự kiện</div>
          </CCardHeader>
          <CCardBody>
            <div>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EventCalender
