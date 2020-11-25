import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Access from '@/views/Access'

jest.setTimeout(30000)

let defaultPortMappings = {
  port_mappings: [
    { local_port: 80, external_port: 80 },
    { local_port: 443, external_port: 10001 }
  ],
  success: true
}

test('Disable external access', async () => {
  let savedExternalAccess = undefined
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

  mock.onGet('/rest/access/port_mappings').reply(200, defaultPortMappings )
  mock.onPost('/rest/access/set_access').reply(function (config) {
      savedExternalAccess = JSON.parse(config.data).external_access
      return [ 200, { success: true } ]
    })

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

  await wrapper.find('#tgl_external').trigger('click')
  await wrapper.find('#btn_save').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(savedExternalAccess).toBe(false)
  wrapper.unmount()
})

test('Enable external access', async () => {
  let savedExternalAccess = undefined
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/access/access').reply(200,
    {
      data: {
        external_access: false,
        upnp_available: false,
        upnp_enabled: true,
        public_ip: '111.111.111.111'
      },
      success: true
    }
  )

  mock.onGet('/rest/access/port_mappings').reply(200, defaultPortMappings )
  mock.onPost('/rest/access/set_access').reply(function (config) {
    savedExternalAccess = JSON.parse(config.data).external_access
    return [200, { success: true }]
  })

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

  await wrapper.find('#tgl_external').trigger('click')
  await wrapper.find('#btn_save').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(savedExternalAccess).toBe(true)
  wrapper.unmount()
})

test('Enable auto port mapping (upnp)', async () => {
  let savedUpnpEnabled = undefined
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/access/access').reply(200,
    {
      data: {
        external_access: false,
        upnp_available: false,
        upnp_enabled: false,
        public_ip: '111.111.111.111'
      },
      success: true
    }
  )

  mock.onGet('/rest/access/port_mappings').reply(200, defaultPortMappings )
  mock.onPost('/rest/access/set_access').reply(function (config) {
    savedUpnpEnabled = JSON.parse(config.data).upnp_enabled
    return [200, { success: true }]
  })

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
  await wrapper.find('#tgl_external').trigger('click')
  await wrapper.find('#tgl_upnp').trigger('click')
  await wrapper.find('#btn_save').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(savedUpnpEnabled).toBe(true)
  wrapper.unmount()
})

test('Set access and certificate ports', async () => {
  let savedCertificatePort = undefined
  let savedAccessPort = undefined
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/access/access').reply(200,
    {
      data: {
        external_access: false,
        upnp_available: false,
        upnp_enabled: false,
        public_ip: '111.111.111.111'
      },
      success: true
    }
  )

  mock.onGet('/rest/access/port_mappings').reply(200, defaultPortMappings )
  mock.onPost('/rest/access/set_access').reply(function (config) {
    let request = JSON.parse(config.data)
    savedCertificatePort = request.certificate_port
    savedAccessPort = request.access_port
    return [200, { success: true }]
  })

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
  await wrapper.find('#tgl_external').trigger('click')
  await wrapper.find('#certificate_port').setValue('1')
  await wrapper.find('#access_port').setValue(2)
  await wrapper.find('#btn_save').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(savedCertificatePort).toBe(1)
  expect(savedAccessPort).toBe(2)
  wrapper.unmount()
})
