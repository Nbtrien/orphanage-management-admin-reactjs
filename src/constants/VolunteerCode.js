export const EventState = {
  all: {
    code: 0,
    display: 'Tất cả',
  },
  occurred: {
    code: 1,
    display: 'Đã diễn ra',
  },
  inProgress: {
    code: 2,
    display: 'Đang diễn ra',
  },
  notOccurred: {
    code: 3,
    display: 'Chưa diễn ra',
  },
}

export const EventApplyState = {
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
  attended: {
    code: 3,
    display: 'Đã tham gia',
  },
  notAttended: {
    code: 4,
    display: 'Không tham gia',
  },
  canceled: {
    code: 5,
    display: 'Đã hủy',
  },
}
