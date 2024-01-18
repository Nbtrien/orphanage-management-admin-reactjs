const ApplicationStatus = {
  pending: {
    code: 0,
    display: 'Chưa xác nhận',
  },
  approved: {
    code: 1,
    display: 'Đã xác nhận',
  },
  done: {
    code: 2,
    display: 'Đã hoàn thành',
  },
  declined: {
    code: 3,
    display: 'Đã từ chối',
  },
  canceled: {
    code: 4,
    display: 'Đã hủy',
  },
}
export default ApplicationStatus
