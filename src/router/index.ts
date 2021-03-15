import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/
export const constantRoutes: RouteConfig[] = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: {
                    title: 'dashboard',
                    icon: 'dashboard'
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
        meta: {hidden: true}
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        meta: { hidden: true },
        children: [
            {
                path: 'index',
                component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
                name: 'Profile',
                meta: {
                    title: '个人中心',
                    icon: 'user',
                    noCache: true
                }
            }
        ]
    },
    {
        path: '/404',
        component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
        meta: {hidden: true}
    }
]

export const asyncRoutes: RouteConfig[] = [
    {
        path: '/salary',
        component: Layout,
        redirect: '/salary/first-step',
        meta: {
            title: 'salary',
            icon: 'example'
        },
        children: [
            {
                path: 'first-step',
                component: () => import(/* webpackChunkName: "first-step" */ '@/views/salary/first-step.vue'),
                name: 'FirstStep',
                meta: {
                    title: 'firstStep'
                }
            },
            {
                path: 'second-step',
                component: () => import(/* webpackChunkName: "second-step" */ '@/views/salary/second-step.vue'),
                name: 'SecondStep',
                meta: {
                    title: 'secondStep'
                }
            },
            {
                path: 'send-record',
                component: () => import(/* webpackChunkName: "second-step" */ '@/views/salary/send-record.vue'),
                name: 'SendRecord',
                meta: {
                    title: 'sendRecord'
                }
            }
        ]
    },
    {
        path: '/table',
        component: Layout,
        redirect: '/table/complex-table',
        name: 'table',
        meta: {
            title: 'table',
            icon: 'table'
        },
        children: [
            {
              path: 'dynamic-table',
              component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/table/dynamic-table/index.vue'),
              name: 'DynamicTable',
              meta: { title: 'dynamicTable' }
            },
            {
              path: 'draggable-table',
              component: () => import(/* webpackChunkName: "draggable-table" */ '@/views/table/draggable-table.vue'),
              name: 'DraggableTable',
              meta: { title: 'draggableTable' }
            },
            {
              path: 'inline-edit-table',
              component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/table/inline-edit-table.vue'),
              name: 'InlineEditTable',
              meta: { title: 'inlineEditTable' }
            },
            {
              path: 'complex-table',
              component: () => import(/* webpackChunkName: "complex-table" */ '@/views/table/complex-table.vue'),
              name: 'ComplexTable',
              meta: { title: 'complexTable' }
            }
          ]
    },
    {
        path: '/charts',
        component: Layout,
        redirect: 'noredirect',
        name: 'Charts',
        meta: {
          title: 'charts',
          icon: 'chart'
        },
        children: [
          {
            path: 'bar-chart',
            component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/charts/bar-chart.vue'),
            name: 'BarChartDemo',
            meta: {
              title: 'barChart',
              noCache: true
            }
          },
          {
            path: 'map-chart',
            component: () => import(/* webpackChunkName: "map-chart" */ '@/views/charts/map-chart.vue'),
            name: 'MapChartDemo',
            meta: {
              title: 'mapChart',
              noCache: true
            }
          },
          {
            path: 'line-chart',
            component: () => import(/* webpackChunkName: "line-chart" */ '@/views/charts/line-chart.vue'),
            name: 'LineChartDemo',
            meta: {
              title: 'lineChart',
              noCache: true
            }
          },
          {
            path: 'mixed-chart',
            component: () => import(/* webpackChunkName: "mixed-chart" */ '@/views/charts/mixed-chart.vue'),
            name: 'MixedChartDemo',
            meta: {
              title: 'mixedChart',
              noCache: true
            }
          }
        ]
    },
    {
        path: '/d3charts',
        component: Layout,
        redirect: 'noredirect',
        name: 'd3charts',
        meta: {
          title: 'd3charts',
          icon: 'chart'
        },
        children: [
            {
              path: 'index',
              component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/d3charts/index.vue'),
              name: 'd3Demo1',
              meta: {
                title: 'd3Demo1',
                noCache: true
              }
            },
            {
                path: 'index2',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/d3charts/index2.vue'),
                name: 'd3Demo2',
                meta: {
                  title: 'd3Demo2',
                  noCache: true
                }
              },
            {
                path: 'index3',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/d3charts/index3.vue'),
                name: 'd3Demo3',
                meta: {
                  title: 'd3Demo3',
                  noCache: true
                }
              },
        ]
    },
    {
        path: '/g6charts',
        component: Layout,
        redirect: 'noredirect',
        name: 'g6charts',
        meta: {
          title: 'g6charts',
          icon: 'chart'
        },
        children: [
            {
              path: 'g6intro',
              component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/g6intro.vue'),
              name: 'g6intro',
              meta: {
                title: 'g6intro',
                noCache: true
              }
            },
            {
              path: 'benifit',
              component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/benifit.vue'),
              name: 'benifit',
              meta: {
                title: 'benifit',
                noCache: true
              }
            },
            {
              path: 'g6equity',
              component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/equity.vue'),
              name: 'g6equity',
              meta: {
                title: 'g6equity',
                noCache: true
              }
            },
            {
              path: 'g6equity1',
              component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/equitys1.vue'),
              name: 'g6equity1',
              meta: {
                title: 'g6equity1',
                noCache: true
              }
            },
            {
                path: 'index1',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/index1.vue'),
                name: 'g6Demo1',
                meta: {
                  title: 'g6Demo1',
                  noCache: true
                }
              },
              {
                path: 'Controller',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/Controller.vue'),
                name: 'Controller',
                meta: {
                  title: 'Controller',
                  noCache: true
                }
              },
              {
                path: 'ControllerHehe',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/ControllerHehe.vue'),
                name: 'ControllerHehe',
                meta: {
                  title: 'ControllerHehe',
                  noCache: true
                }
              },
              {
                path: 'hehe',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/hehe.vue'),
                name: 'hehe',
                meta: {
                  title: 'hehe',
                  noCache: true
                }
              },
              {
                path: 'equitys',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/equitys.vue'),
                name: 'equitys',
                meta: {
                  title: 'equitys',
                  noCache: true
                }
              },
              {
                path: 'enterprise',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/enterprise.vue'),
                name: 'enterprise',
                meta: {
                  title: 'enterprise',
                  noCache: true
                }
              },
	      {
                path: 'g6-deom-l',
                component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/g6charts/g6-demo-l/index.vue'),
                name: 'g6DemoL',
                meta: {
                  title: 'g6DemoL',
                  noCache: true
                }
              },
        ]
    },
    {
        path: '/help-center',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import(/* webpackChunkName: "helpCenter" */ '@/views/help-center/index.vue'),
                name: 'help-center',
                meta: {
                    title: 'helpCenter',
                    icon: 'icon',
                    noCache: true
                }
            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        meta: {hidden: true}
    }
]

const createRouter = () => new Router({
    // scrollBehavior功能只在 HTML5 history 模式下可用，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样
    // mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {// 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },

    base: process.env.BASE_URL,
    routes: constantRoutes
})

const router = createRouter()

export default router
