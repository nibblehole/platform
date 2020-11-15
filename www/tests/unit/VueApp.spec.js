import { shallowMount } from '@vue/test-utils'
import VueApp from '@/VueApp'

test('non activated', () => {

  const mockRoute = {
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: jest.fn()
  }

  const wrapper = shallowMount(VueApp,  {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  wrapper.vm.onActivationStatus({ activated: false })

  expect(mockRouter.push).toHaveBeenCalledWith('/activate')

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

  const wrapper = shallowMount(VueApp,  {
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
