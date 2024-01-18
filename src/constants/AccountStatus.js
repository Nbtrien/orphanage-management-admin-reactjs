const AccountStatus = {
  pending: {
    code: 0,
    display: 'Chưa kích hoạt',
  },
  active: {
    code: 1,
    display: 'Đã kích hoạt',
  },
  locked: {
    code: 2,
    display: 'Đã khóa',
  },
}
const findAccountStatusByCode = (code) => {
  for (const key in AccountStatus) {
    if (AccountStatus[key].code === code) {
      return AccountStatus[key]
    }
  }
  return null
}

export { AccountStatus, findAccountStatusByCode }
