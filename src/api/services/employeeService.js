import AxiosPrivate from '../axiosPrivate'

const employeeService = () => {
  const instance = AxiosPrivate()
  const employeeApi = {
    // Get employee position
    getPositions: (params) => {
      const url = '/employee-positions'
      return instance.get(url, params)
    },
    getEmployeePositions: () => {
      const url = '/employee-positions/get-all'
      return instance.get(url)
    },
    // Create employee
    createEmployee: (data) => {
      const url = '/employees'
      return instance.post(url, data)
    },
    // Create position
    createPosition: (data) => {
      const url = '/employee-positions'
      return instance.post(url, data)
    },
    // Create payroll
    createMonthlyPayroll: (data) => {
      const url = '/monthly-payrolls'
      return instance.post(url, data)
    },
    // Get employee
    getEmployees: (params) => {
      const url = '/employees'
      return instance.get(url, params)
    },
    getEmployeeDetail: (id) => {
      const url = '/employees/' + id
      return instance.get(url)
    },
    getEmployeeUpdateInfo: (id) => {
      const url = '/employees/' + id + '/update-info'
      return instance.get(url)
    },
    updateEmployeeInfo: (id, data) => {
      const url = '/employees/' + id + '/update-info'
      return instance.put(url, data)
    },
    // Delete employee
    deleteEmployees: (params) => {
      const url = '/employees'
      return instance.delete(url, params)
    },
    // Get employee payroll
    getEmployeePayrolls: (params) => {
      const url = '/employee-payrolls'
      return instance.get(url, params)
    },
    getMonthlyPayrolls: (params) => {
      const url = '/monthly-payrolls'
      return instance.get(url, params)
    },
    getMonthlyPayrollDetail: (id, params) => {
      const url = '/monthly-payrolls/' + id
      return instance.get(url, params)
    },
    updateEmployeePayroll: (id, data) => {
      const url = '/employee-payrolls/' + id
      return instance.put(url, data)
    },

    updateMonthlyPayroll: (id, data) => {
      const url = '/monthly-payrolls/' + id
      return instance.put(url, data)
    },
    confirmMonthlyPayroll: (id) => {
      const url = '/monthly-payrolls/' + id + '/confirm'
      return instance.put(url)
    },
  }
  return employeeApi
}

export default employeeService
