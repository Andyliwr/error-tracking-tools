import axios from 'axios'
import config from '../config'

const BASE_URL = `http://localhost:${config.port}/graphql`

export const testFindUser = async ({ id }) => {
  return axios.post(BASE_URL, {
    query: `
      query {
        user(id: ${id}) {
          id
          username
          email
          role
        }
      }
    `
  })
}
