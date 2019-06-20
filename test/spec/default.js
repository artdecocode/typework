import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import typework from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof typework, 'function')
  },
  async 'calls package without error'() {
    await typework()
  },
  async 'gets a link to the fixture'({ fixture }) {
    const text = fixture`text.txt`
    const res = await typework({
      text,
    })
    ok(res, text)
  },
}

export default T