import { shallowMount } from '@vue/test-utils'
import VueApp from '@/VueApp'

describe('VueApp.vue', () => {
  it('check user session', async () => {
    const wrapper = shallowMount(VueApp)

    wrapper.vm.checkUserSession()

    // expect(wrapper.vm.router.path).toMatch('/login')

    // expect(wrapper.vm.timestamp('Sun, 02 Nov 2020 22:07:36 GMT', new Date(2020, 10, 2))).toMatch('Today 22:07')

  })
})
