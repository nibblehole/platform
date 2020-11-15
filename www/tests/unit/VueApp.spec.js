import { shallowMount } from '@vue/test-utils'
import VueApp from '@/VueApp'

test('VueApp.vue', () => {
    const wrapper = shallowMount(VueApp)

    // wrapper.vm.onActivationStatus({ activated: false })

    // expect(wrapper.vm.$route.path).toBe('/login')

    // expect(wrapper.vm.timestamp('Sun, 02 Nov 2020 22:07:36 GMT', new Date(2020, 10, 2))).toMatch('Today 22:07')

})
