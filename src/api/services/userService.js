import AxiosPrivate from '../axiosPrivate'

const userService = () => {
  const instance = AxiosPrivate()
  const userApi = {
    getAllUsers: (params) => {
      const url = '/users'
      return instance.get(url, params)
    },
    getUserDetail: (id) => {
      const url = '/users/' + id
      return instance.get(url)
    },
    deleteUsers: (params) => {
      const url = '/users'
      return instance.delete(url, params)
    },
    createUser: (data) => {
      const url = '/users'
      return instance.post(url, data)
    },
    updateUser: (id, data) => {
      const url = '/users/' + id
      return instance.put(url, data)
    },
    getAllRoles: (params) => {
      const url = '/roles/get-all'
      return instance.get(url, params)
    },
    getRoles: (params) => {
      const url = '/roles'
      return instance.get(url, params)
    },
    getRoleDetail: (id) => {
      const url = '/roles/' + id
      return instance.get(url)
    },
    deleteRoles: (params) => {
      const url = '/roles'
      return instance.delete(url, params)
    },
    createRole: (data) => {
      const url = '/roles'
      return instance.post(url, data)
    },
    updateRole: (id, data) => {
      const url = '/roles/' + id
      return instance.put(url, data)
    },
    getAllPermissions: (params) => {
      const url = '/permissions'
      return instance.get(url, params)
    },
  }
  return userApi
}

export default userService
