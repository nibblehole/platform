import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Access from '@/views/Access'


test('Disable external access', async () => {
  var savedExternalAccess = undefined
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
  mock.onPost('/rest/access/set_access').reply(function (config) {
      savedExternalAccess = JSON.parse(config.data).external_access
      return [
        200,
        { success: true }
      ]
    }
  )

  const elem = document.createElement('div')
  if (document.body) {
    document.body.appendChild(elem)
  }
  const wrapper = mount(Access,
    {
      attachTo: elem,
      global: {
        stubs: {
          Error: true,
          Dialog: true
        }
      }
    }
  )

  await flushPromises()

  await wrapper.find('#tgl_external').trigger('click')
  await wrapper.find('#btn_save').trigger('click')
  await flushPromises()

  expect(savedExternalAccess).toBe(false)
})
