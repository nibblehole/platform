import { mount } from '@vue/test-utils'
import VueApp from '@/VueApp'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import { h } from 'vue'

test('activated and logged in', async () => {
  const mockRoute = { params: { id: 1 } }
  const mockRouter = { push: jest.fn() }

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/activation_status').reply(200,
    { activated: true }
  )
  mock.onGet('/rest/user').reply(200,
    { message: 'OK' }
  )

  mount(VueApp, {
    global: {
      components: {
        RouterView: { render() { return h('div') } }
      },
      stubs: {
        Menu: true
      },
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await flushPromises()
  expect(mockRouter.push).toHaveBeenCalledTimes(0)
})

test('activated and not logged in', async () => {
  const mockRoute = { params: { id: 1 } }
  const mockRouter = { push: jest.fn() }

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/activation_status').reply(200,
    { activated: true }
  )
  mock.onGet('/rest/user').reply(500,
    { message: 'not OK' }
  )

  mount(VueApp, {
    global: {
      components: {
        RouterView: { render() { return h('div') } }
      },
      stubs: {
        Menu: true
      },
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await flushPromises()
  expect(mockRouter.push).toHaveBeenCalledWith('/login')
})

test('not activated and not logged in', async () => {
  const mockRoute = { params: { id: 1 } }
  const mockRouter = { push: jest.fn() }

  const mock = new MockAdapter(axios)
  mock.onGet('/rest/activation_status').reply(200,
    { activated: false }
  )
  mock.onGet('/rest/user').reply(500,
    { message: 'not OK' }
  )

  mount(VueApp, {
    global: {
      components: {
        RouterView: { render() { return h('div') } }
      },
      stubs: {
        Menu: true
      },
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await flushPromises()
  expect(mockRouter.push).toHaveBeenCalledWith('/activate')
})
