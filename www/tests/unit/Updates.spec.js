import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Updates from '@/views/Updates'

jest.setTimeout(30000)

test('Update platform', async () => {
  let upgraded = false
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/versions').reply(200,
    {
      data: [
        {
          app: { id: 'platform', name: 'Platform' },
          current_version: '1',
          installed_version: '2'
        },
        {
          app: { id: 'installer', name: 'Installer' },
          current_version: '3',
          installed_version: '3'
        }
      ],
      success: true
    }
  )
  mock.onPost('/rest/upgrade').reply(function (_) {
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
  let upgraded = false
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/versions').reply(200,
    {
      data: [
        {
          app: { id: 'platform', name: 'Platform' },
          current_version: '1',
          installed_version: '1'
        },
        {
          app: { id: 'installer', name: 'Installer' },
          current_version: '2',
          installed_version: '3'
        }
      ],
      success: true
    }
  )
  mock.onPost('/rest/installer/upgrade').reply(function (_) {
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
          app: { id: 'platform', name: 'Platform' },
          current_version: '1',
          installed_version: '1'
        },
        {
          app: { id: 'installer', name: 'Installer' },
          current_version: '2',
          installed_version: '3'
        }
      ],
      success: true
    }
  )
  mock.onPost('/rest/installer/upgrade').reply(function (_) {
    return [500, { success: false }]
  })

  const wrapper = mount(Updates,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: {
            template: '<span/>',
            methods: {
              showAxios: showError
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
