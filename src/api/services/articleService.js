import AxiosPrivate from '../axiosPrivate'

const articleService = () => {
  const instance = AxiosPrivate()
  const articleApi = {
    addNewCategory: (data) => {
      const url = '/article-categories'
      return instance.post(url, data)
    },
    addNewArticle: (data) => {
      const url = '/articles'
      return instance.post(url, data)
    },
    fetchCategories: (params) => {
      const url = '/article-categories'
      return instance.get(url, params)
    },
    fetchArtiles: (params) => {
      const url = '/articles'
      return instance.get(url, params)
    },
    deleteCategories: (params) => {
      const url = '/article-categories'
      return instance.delete(url, params)
    },
    deleteArticles: (params) => {
      const url = '/articles'
      return instance.delete(url, params)
    },
    hideArticles: (id) => {
      const url = '/articles/hidden?ids=' + id
      return instance.patch(url)
    },
    activeArticles: (id) => {
      const url = '/articles/active?ids=' + id
      return instance.patch(url)
    },
    getPageTypeDetail: (id) => {
      const url = '/content/information-page-type/' + id
      return instance.get(url)
    },
    getInformationPageDetail: (id) => {
      const url = '/content/information-page-type/' + id + '/information-page'
      return instance.get(url)
    },
    addNewInformationPage: (data) => {
      const url = '/content/information-page'
      return instance.post(url, data)
    },
  }
  return articleApi
}

export default articleService
