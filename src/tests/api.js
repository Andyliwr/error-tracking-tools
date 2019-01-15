import axios from 'axios'
import config from '../config'

const BASE_URL = `http://localhost:${config.port}/graphql`

export const testFindUser = async variables => {
  return axios.post(BASE_URL, {
    query: `
      query($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables
  })
}

export const signIn = async variables => await axios.post(BASE_URL, {
  query: `
    mutation ($login: String!, $password: String!) {
      signIn(login: $login, password: $password) {
        token
      }
    }
  `,
  variables
})

export const deleteUser = async (variables, token) => await axios.post(BASE_URL, {
  query: `
    mutation($id: ID!) {
      deleteUser(id: $id)
    }
  `,
  variables
}, {
  headers: {
    'x-token': token
  }
})