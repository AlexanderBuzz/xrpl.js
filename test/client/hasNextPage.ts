import assert from 'assert-diff'
import {TestSuite} from '../testUtils'
import rippled from '../fixtures/rippled'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/client/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'returns true when there is another page': async (client, address, mockRippled) => {
    mockRippled.addResponse({command: 'ledger_data'}, rippled.ledger_data.first_page)
    // @ts-ignore
    const response = await client.request({command: 'ledger_data'})
    assert(client.hasNextPage(response))
  },

  'returns false when there are no more pages': async (client, address, mockRippled) => {
    const rippledResponse = function(request: Request) : object {
      if ('marker' in request) {
        return rippled.ledger_data.last_page
      } else {
        return rippled.ledger_data.first_page
      }
    }
    mockRippled.addResponse({command: 'ledger_data'}, rippledResponse)
    // @ts-ignore
    const response = await client.request({command: 'ledger_data'})
    const responseNextPage = await client.requestNextPage(
      // @ts-ignore
      {command: 'ledger_data'},
      response
    )
    assert(!client.hasNextPage(responseNextPage))
  }
}