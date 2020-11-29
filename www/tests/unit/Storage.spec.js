import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Storage from '@/views/Storage'

jest.setTimeout(30000)

test('Format external disk', async () => {
  let deviceToFormat
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/disks').reply(200,
    {
      disks: [
        { name: 'Name1', device: '/dev/sdb', active: false, size: '2G', partitions: [] },
        { name: 'Name2', device: '/dev/sdc', active: false, size: '2G', partitions: [] },
      ],
      success: true
    }
  )
  mock.onPost('/rest/storage/disk_format').reply(function (config) {
    deviceToFormat = JSON.parse(config.data).device
    return [200, { success: true }]
  })

  const wrapper = mount(Storage,
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

  await wrapper.find('#format_1').trigger('click')
  await wrapper.find('#format_confirm').trigger('click')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(deviceToFormat).toBe('/dev/sdc')
  wrapper.unmount()
})

test('Activate partition', async () => {
  let deviceAction
  const showError = jest.fn()
  const showErrorOld = jest.fn()

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/settings/disks').reply(200,
    {
      disks: [
        { name: 'Name1', device: '/dev/sdb', active: true, size: '2G', partitions: [
            { active: false, device: '/dev/sdb1', fs_type: 'ext4', mount_point: '', mountable: true, size: '931.5G' }
          ] },
        { name: 'Name2', device: '/dev/sdc', active: false, size: '2G', partitions: [
            { active: false, device: '/dev/sdc1', fs_type: 'ext4', mount_point: '', mountable: true, size: '931.5G' }
          ] },
      ],
      success: true
    }
  )
  mock.onPost('/rest/settings/disk_activate').reply(function (config) {
    deviceAction = JSON.parse(config.data).device
    return [200, { success: true }]
  })

  const wrapper = mount(Storage,
    {
      attachTo: document.body,
      global: {
        stubs: {
          Error: true,
          Switch: {
            template: '<button id="switch" />'
          },
          Confirmation: {
            template: '<button id="confirm" />',
            methods: {
              show () {}
            }
          }
        }
      }
    }
  )
  wrapper.vm.$refs.error.show = showErrorOld
  wrapper.vm.$refs.error.showAxios = showError

  await flushPromises()

  await wrapper.findAll('#switch')[1].trigger('toggle')
  await wrapper.find('#confirm').trigger('confirm')

  expect(showErrorOld).toHaveBeenCalledTimes(0)
  expect(showError).toHaveBeenCalledTimes(0)
  expect(deviceAction).toBe('/dev/sdc1')
  wrapper.unmount()
})
