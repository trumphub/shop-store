import Vue from 'vue'
import store from '@/store'

Vue.directive('action', {
    inserted(el, binding, vnode) {
        const roles = store.getters.roles
        if (roles.isSuper === 1) {
            return
        }
        const actionType = binding.arg
        const permissionId = vnode.context.$route.meta.permission

        roles.permissions.forEach(item => {
            if (permissionId.includes(item.permissionId)) {
                let flag = item.actionEntitySet.some(({ action }) => actionType === action)
                if (!flag) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            }
        })
    }
})
