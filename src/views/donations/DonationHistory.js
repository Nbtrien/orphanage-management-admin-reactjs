import React, { useEffect, useState } from 'react'
import { CCol, CRow, CWidgetStatsF, CNav, CNavItem, CNavLink } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCreditCard, cilMoney, cilPeople } from '@coreui/icons'
import { FaDonate } from 'react-icons/fa'
import donationService from 'src/api/services/donationService'
import numeral from 'numeral'
import DonationHistoryTab from 'src/components/tabs/DonationHistoryTab'
import FundingUsageHistoryTab from 'src/components/tabs/FundingUsageHistoryTab'
import FamilyDonationHistoryTab from 'src/components/tabs/FamilyDonationHistoryTab'
import DonorManagementTab from 'src/components/tabs/DonorManagementTab'

const DonationHistory = () => {
  const donationApi = donationService()
  const [activeState, setActiveState] = useState(1)
  const [donationStats, setDonationStats] = useState({})
  useEffect(() => {
    const getDonationStats = async () => {
      try {
        const response = await donationApi.getDonationStats()
        const result = response.result
        setDonationStats(result)
      } catch (error) {
        console.log(error)
      }
    }
    getDonationStats()
  }, [])
  return (
    <>
      <CNav className="nav-custom" variant="pills" layout="fill">
        <CNavItem className="cursor-pointer text-uppercase">
          <CNavLink onClick={() => setActiveState(1)} active={activeState === 1}>
            Lịch sử tài trợ
          </CNavLink>
        </CNavItem>
        <CNavItem className="cursor-pointer text-uppercase">
          <CNavLink onClick={() => setActiveState(2)} active={activeState === 2}>
            Lịch sử sử dụng
          </CNavLink>
        </CNavItem>
        <CNavItem className="cursor-pointer text-uppercase">
          <CNavLink onClick={() => setActiveState(3)} active={activeState === 3}>
            Tài trợ theo gia đình
          </CNavLink>
        </CNavItem>
        <CNavItem className="cursor-pointer text-uppercase">
          <CNavLink onClick={() => setActiveState(4)} active={activeState === 4}>
            Danh sách nhà tài trợ
          </CNavLink>
        </CNavItem>
      </CNav>
      {
        <div className="mt-3">
          <CRow>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3 widget-custom"
                icon={<CIcon width={20} icon={cilPeople} size="lg" />}
                title="Tổng số nhà tài trợ"
                value={donationStats?.donor_count}
                color="secondary"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3 widget-custom"
                icon={<CIcon width={20} icon={cilCreditCard} size="lg" />}
                title="Tổng số lượt tài trợ"
                value={donationStats?.donation_count}
                color="secondary"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3 widget-custom"
                icon={<CIcon width={20} icon={cilMoney} size="lg" />}
                title="Tổng Số tiền tài trợ"
                value={numeral(donationStats?.total_amount).format('0,0₫') + ' VND'}
                color="secondary"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3 widget-custom pr-0"
                icon={<FaDonate />}
                title="Số tiền đã sử dụng"
                value={numeral(donationStats?.used_amount).format('0,0₫') + ' VND'}
                color="secondary"
              />
            </CCol>
          </CRow>
          {activeState === 1 && <DonationHistoryTab />}
          {activeState === 2 && <FundingUsageHistoryTab />}
          {activeState === 3 && <FamilyDonationHistoryTab />}
          {activeState === 4 && <DonorManagementTab />}
        </div>
      }
    </>
  )
}

export default DonationHistory
