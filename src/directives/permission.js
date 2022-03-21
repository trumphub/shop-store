import Vue from 'vue'
import store from '@/store'

{/* <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                v-permission="createPath" // createPath: "/page/create"
              >
                新增
              </el-button> */}

Vue.directive('permission', {
    inserted(el, binding) {
        const roles = store.getters.roles
        if (roles.isSuper === 1) {
            return
        }
        const path = binding.value
        const routes = store.getters.permission_routes
        const bool = hasPermission(routes, path)
        if (!bool) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
})

function hasPermission(routes, path) {
    let bool = false
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.children) {
            bool = hasPermission(route.children, path)
        } else {
            if (route.path === path) {
                bool = true
                break
            }
        }
    }
    return bool
}
