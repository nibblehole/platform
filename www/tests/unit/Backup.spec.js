import { mount } from '@vue/test-utils'
import Backup from '@/views/Backup'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'


test('show list of backups', async () => {

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/backup/list').reply(200,
    {
      'success': true,
      'data': [
        { 'path': '/data/platform/backup', 'file': 'files-2019-0515-123506.tar.gz' },
        { 'path': '/data/platform/backup', 'file': 'nextcloud-2019-0515-123506.tar.gz' }
      ]
    }
  )

  const view = mount(Backup,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: true
        }
      }
    }
  )

  await flushPromises()

  expect(view.text()).toContain('files-2019-0515-123506.tar.gz')
})
