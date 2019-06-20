/* alanode example/ */
import typework from '../src'

(async () => {
  const res = await typework({
    text: 'example',
  })
  console.log(res)
})()