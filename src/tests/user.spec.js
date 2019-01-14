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
    const result = await userApi.testFindUser({ id: 1 })
    expect(result.data).to.eql(expectedResult)
  })
})
