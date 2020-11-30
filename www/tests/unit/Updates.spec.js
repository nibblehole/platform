import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Updates from '@/views/Updates'

jest.setTimeout(30000)

test('Update platform', async () => {
  let upgraded = undefined
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/versions').reply(200,
    {
      data: [
        {
          app: { id: 'platform', name: 'Platform', required: true, ui: false, url: 'http://platform.odroid-c2.syncloud.it' },
          current_version: '1',
          installed_version: '2'
        },
        {
          app: { id: 'installer', name: 'Installer', required: true, ui: false, url: 'http://installer.odroid-c2.syncloud.it' },
          current_version: '3',
          installed_version: '3'
        }
      ],
      success: true
    }
  )
  mock.onPost('/rest/upgrade').reply(function (config) {
    upgraded = true
    return [200, { success: true }]
  })

  const wrapper = mount(Updates,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: true,
          Switch: true,
          Confirmation: true
        }
      }
    }
  )
  wrapper.vm.$refs.error.show = showErrorOld
  wrapper.vm.$refs.error.showAxios = showError

  await flushPromises()

  expect(wrapper.find('#btn_platform_upgrade').exists()).toBe(true)
  expect(wrapper.find('#btn_installer_upgrade').exists()).toBe(false)

  await wrapper.find('#btn_platform_upgrade').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(upgraded).toBe(true)
  wrapper.unmount()
})

test('Update installer', async () => {
  let upgraded = undefined
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/versions').reply(200,
    {
      data: [
        {
          app: { id: 'platform', name: 'Platform', required: true, ui: false, url: 'http://platform.odroid-c2.syncloud.it' },
          current_version: '1',
          installed_version: '1'
        },
        {
          app: { id: 'installer', name: 'Installer', required: true, ui: false, url: 'http://installer.odroid-c2.syncloud.it' },
          current_version: '2',
          installed_version: '3'
        }
      ],
      success: true
    }
  )
  mock.onPost('/rest/installer/upgrade').reply(function (config) {
    upgraded = true
    return [200, { success: true }]
  })

  const wrapper = mount(Updates,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: true,
          Switch: true,
          Confirmation: true
        }
      }
    }
  )
  wrapper.vm.$refs.error.show = showErrorOld
  wrapper.vm.$refs.error.showAxios = showError

  await flushPromises()

  expect(wrapper.find('#btn_platform_upgrade').exists()).toBe(false)
  expect(wrapper.find('#btn_installer_upgrade').exists()).toBe(true)

  await wrapper.find('#btn_installer_upgrade').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(upgraded).toBe(true)
  wrapper.unmount()
})

test('Update installer error', async () => {
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/versions').reply(200,
    {
      data: [
        {
          app: { id: 'platform', name: 'Platform', required: true, ui: false, url: 'http://platform.odroid-c2.syncloud.it' },
          current_version: '1',
          installed_version: '1'
        },
        {
          app: { id: 'installer', name: 'Installer', required: true, ui: false, url: 'http://installer.odroid-c2.syncloud.it' },
          current_version: '2',
          installed_version: '3'
        }
      ],
      success: true
    }
  )
  mock.onPost('/rest/installer/upgrade').reply(function (config) {
    return [500, { success: false }]
  })

  // mock.onGet('/rest/settings/installer_status').reply(200, { success: true, is_running: false })

  const wrapper = mount(Updates,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: {
            template: '<span/>',
            methods: {
              showAxios (err) {
                showError()
              }
            }
          },
          Switch: true,
          Confirmation: true
        }
      }
    }
  )

  await flushPromises()

  await wrapper.find('#btn_installer_upgrade').trigger('click')
  await flushPromises()

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(1)
  wrapper.unmount()
})
