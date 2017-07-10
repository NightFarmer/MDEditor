import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/123',
            name: 'landing-page',
            component: require('@/components/LandingPage')
        },
        {
            path: '/',
            name: 'landing-page',
            component: require('@/components/Editor')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
