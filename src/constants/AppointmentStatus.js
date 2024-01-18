const AppointmentStatus = {
  pending: {
    code: 0,
    display: 'Chưa xác nhận',
  },
  approved: {
    code: 1,
    display: 'Đã xác nhận',
  },
  declined: {
    code: 2,
    display: 'Đã từ chối',
  },
  canceled: {
    code: 3,
    display: 'Đã hủy bỏ',
  },
  completed: {
    code: 4,
    display: 'Đã hoàn thành',
  },
  noShow: {
    code: 5,
    display: 'Không đến thăm',
  },
  expired: {
    code: 6,
    display: 'Đã hết hạn',
  },
}

export default AppointmentStatus
