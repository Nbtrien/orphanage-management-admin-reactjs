import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CRow } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'

import statisticsService from 'src/api/services/statisticsService'

const ChildrenStatisticsByAgeChart = () => {
  const statisticsApi = statisticsService()
  const [statistics, setStatistics] = useState([])
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await statisticsApi.getChildrenStatisticsByAge()
        setStatistics(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatistics()
  }, [])

  useEffect(() => {
    setLabels(statistics.map((item) => item.age_range))
    setData(statistics.map((item) => item.children_count))
  }, [statistics])

  return (
    <CCard className="h-100">
      <CCardBody>
        <CRow>
          <h4 id="traffic" className="card-title mb-3">
            Thống kê trẻ theo độ tuổi
          </h4>
          <CChartBar
            data={{
              labels: labels,
              datasets: [
                {
                  label: 'Số trẻ',
                  backgroundColor: '#f87979',
                  data: data,

                  borderColor: '#fff',
                  fill: false,
                  barThickness: 30,
                },
              ],
            }}
            labels="Số trẻ"
            height={200}
          />
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default ChildrenStatisticsByAgeChart
