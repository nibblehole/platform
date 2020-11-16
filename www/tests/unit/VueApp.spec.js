import { shallowMount } from '@vue/test-utils'
import VueApp from '@/VueApp'
import axios from 'axios'
import flushPromises from 'flush-promises'

test('activated and logged in', async () => {

  jest.mock('axios', () => ({
    get: jest.fn((url) => {
      switch (url) {
        case '/rest/user':
          return { message: 'OK' }
        case '/rest/activation_status':
          return { activated: true }
      }
    })
  }))

  const mockRoute = { params: { id: 1 } }
  const mockRouter = { push: jest.fn() }

  const wrapper = shallowMount(VueApp, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await wrapper.vm.checkUserSession()

  await flushPromises()

  expect(mockRouter.push).toHaveBeenCalledTimes(0)

})

test('activated and not logged in', async () => {

  jest.mock('axios', () => ({
    get: jest.fn((url) => {
      switch (url) {
        case '/rest/user':
          return Promise.reject(new Error("Not logged in"))
        case '/rest/activation_status':
          return {data: { activated: true }}
      }
    })
  }))

  const mockRoute = { params: { id: 1 } }
  const mockRouter = { push: jest.fn() }

  const wrapper = shallowMount(VueApp, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await wrapper.vm.checkUserSession()

  await flushPromises()

  expect(mockRouter.push).toHaveBeenCalledWith('/login')

})

test('activated', () => {

  const mockRoute = {
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: jest.fn()
  }

  const wrapper = shallowMount(VueApp, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  wrapper.vm.onActivationStatus({ activated: true })

  expect(mockRouter.push).toHaveBeenCalledWith('/login')

})
