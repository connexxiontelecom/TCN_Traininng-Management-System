import store from '@/state/store'

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/pages/account/login'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    //next({ name: 'home' })
                    next()
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/pages/account/register'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/forgot-password',
        name: 'Forgot-password',
        component: () => import('../views/pages/account/forgot-password'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
                    store.dispatch('auth/logOut')
                } else {
                    store.dispatch('authfack/logout')
                }
                const authRequiredOnPreviousRoute = routeFrom.matched.some(
                    (route) => route.push('/login')
                )
                // Navigate back to previous page, or home as a fallback
                next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
            },
        },
    },
    {
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/index')
    },

    {
        path: '/users',
        name: 'Users',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/users/users')
    },

    {
        path: '/approval-setup',
        name: 'Approval-setup',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/approval/approval-setup')
    },

    {
        path: '/departments',
        name: 'Departments',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/departments/departments')
    },

    {
        path: '/categories',
        name: 'Categories',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/training-category/training-category')
    },

    {
        path: '/new-employees',
        name: 'New Employees',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/employees/new-employees')
    },

    {
        path: '/edit-employee',
        name: 'Edit Employee',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/employees/edit-employee')
    },


    {
        path: '/manage-employees',
        name: 'Manage Employees',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/employees/manage-employees')
    },

    {
        path: '/new-recommendation',
        name: 'New Recommendations',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/trainings/new-recommendation')
    },

    {
        path: '/recommendations',
        name: 'Recommendations',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/trainings/manage-recommendations')
    },

    {
        path: '/edit-recommendation',
        name: 'Edit Recommendation',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/trainings/edit-recommendation')
    },

    {
        path: '/new-schedule',
        name: 'Schedule',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/trainings/new-schedule')
    },

    {
        path: '/edit-schedule',
        name: 'Schedule',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/trainings/edit-schedule')
    },

    {
        path: '/manage-schedule',
        name: 'Schedule',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/trainings/manage-tr-schedule')
    },

    {
        path: '/approve-schedules',
        name: 'Approval Desk',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/approval-desk/manage-submitted-schedule')
    },


    {
        path: '/manage-trainings',
        name: 'Approved Trainings',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/approved-trainings/manage-trainings')
    },


    {
        path: '/approved-trainings',
        name: 'Manage Approved Trainings',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/approved-trainings/manage-approved-trainings')
    },

    {
        path: '/trainings-archive',
        name: 'Training Archive',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/training-archive/new-archive-training')
    },

    /*{
        path: '/manage-training-archive',
        name: 'manage archive',
        meta: {
            authRequired: true,
        },
        //component: () => import('../views/pages/training-archive/manage-archive-trainings')
        component: () => import('../views/pages/training-archive/training-detail')
    },*/


    {
        path: '/new-nomination',
        name: 'new nomination',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/nomination/new-nominations')
    },


    {
        path: '/manage-nominations',
        name: 'manage nominations',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/nomination/manage-nominations')
    },


    {
        path: '/reports',
        name: 'Reports',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/reports/manage-reports')
    },


]
