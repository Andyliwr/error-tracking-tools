import { expect } from 'chai'
import * as userApi from './api'

describe('user(id: String!): User', () => {
  it('returns a user when user can be found', async () => {
    const expectedResult = {
      data: {
        user: {
          id: '1',
          username: 'This is andyliwr',
          email: 'andyliwr@outlook.com',
          role: 'admin'
        }
      }
    }
    const result = await userApi.testFindUser({ id: '1' })
    expect(result.data).to.eql(expectedResult)
  })

  it('return null when user can not be found', async () => {
    const expectedResult = {
      data: {
        user: null
      }
    }

    const result = await userApi.testFindUser({ id: '1000' })
    expect(result.data).to.eql(expectedResult)
  })
})


describe('deleteUser(id: String!): Boolean', () => {
  it('returns an error because only admins can delete a user', async () => {
    const {
      data: {
        data: {
          signIn: { token }
        }
      }
    } = await userApi.signIn({
      login: 'andyliwr2',
      password: '12345678'
    })

    const {
      data: { errors }
    } = await userApi.deleteUser({ id: '1' }, token)

    expect(errors[0].message).to.eql('需要管理员权限')
  })
})