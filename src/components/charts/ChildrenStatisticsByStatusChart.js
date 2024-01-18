import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CRow } from '@coreui/react'
import { CChartPie } from '@coreui/react-chartjs'

import statisticsService from 'src/api/services/statisticsService'

const ChildrenStatisticsByStatusChart = () => {
  const statisticsApi = statisticsService()
  const [statistics, setStatistics] = useState([])
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  const [backgroundColors, setBackgroundColors] = useState([])

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await statisticsApi.getChildrenStatisticsByStatus()
        setStatistics(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatistics()
  }, [])

  useEffect(() => {
    setLabels(statistics.map((item) => item.status))
    setData(statistics.map((item) => item.children_count))
    const generateRandomColors = () => {
      const colors = []
      for (let i = 0; i < statistics.length; i++) {
        // Tạo một màu ngẫu nhiên và thêm vào mảng
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
        colors.push(randomColor)
      }
      setBackgroundColors(colors)
    }

    statistics?.length && generateRandomColors()
  }, [statistics])

  const donutOptions = {
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        fullWidth: true,
        display: true,
        position: 'right',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <CCard className="h-100">
      <CCardBody>
        <CRow>
          <h4 id="traffic" className="card-title mb-3">
            Thống kê trẻ theo trạng thái
          </h4>
          {data?.length && (
            <CChartPie
              data={{
                labels: labels,
                datasets: [
                  {
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: backgroundColors,
                  },
                ],
              }}
              options={donutOptions}
              width={350}
              height={350}
            />
          )}
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default ChildrenStatisticsByStatusChart
