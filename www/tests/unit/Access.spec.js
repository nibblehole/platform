import { mount } from '@vue/test-utils'
import Backup from '@/views/Access'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Access from '@/views/Access'


test('Disable external access', async () => {
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/access/access').reply(200,
    {
      data: {
        external_access: true,
        upnp_available: false,
        upnp_enabled: true,
        public_ip: '111.111.111.111'
      },
      success: true
    }
  )

  mock.onGet('/rest/access/port_mappings').reply(200,
    {
      port_mappings: [
        { local_port: 80, external_port: 80 },
        { local_port: 443, external_port: 10001 }
      ],
      success: true
    }
  )
  mock.onPost('/rest/access/set_access').reply(200,
    { success: true }
  )

  const wrapper = mount(Access,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: true,
          Dialog: true
        }
      }
    }
  )
  wrapper.vm.$refs.error.show = showErrorOld
  wrapper.vm.$refs.error.showAxios = showError

  await flushPromises()

  wrapper.find('#tgl_external').trigger('click')
  wrapper.find('#btn_save').trigger('click')
  await flushPromises()

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)

})
