import store from '@/state/store';
const loggeduser = store.getters['auth/loggedInUser'];
let user  = JSON.parse(loggeduser);
console.log(user);
console.log("user");
export const menuItems = [
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: true
    },
    {
        id: 2,
        label: 'menuitems.dashboard.text',
        icon: 'ri-dashboard-line',
        badge: {
            variant: "success",
            text: "menuitems.dashboard.badge"
        },
        link: '/'
    },
    (user.permissions.find(e => e.name === 'manage_users'))?{
        id: 3,
        label: 'menuitems.systemsetup.text',
        icon: 'ri-settings-5-line',
        link: '',
        subItems: [
            {
                id:5,
                label: 'menuitems.systemsetup.list.users',
                link: '/users'
            },

            {
                id:5,
                label: 'menuitems.systemsetup.list.approvers',
                link: '/approval-setup'
            },

            {
                id:6,
                label: 'menuitems.systemsetup.list.departments',
                link: '/departments'
            },
            {
                id:7,
                label: 'menuitems.systemsetup.list.trainingcategory',
                link: '/categories'
            },
        ]
    }:{},


    (user.permissions.find(e => e.name === 'manage_employees')) ? {
        id: 8,
        label: 'menuitems.employees.text',
        icon: 'ri-team-line',
        link: '',
        subItems: [
            {
                id:9,
                label: 'menuitems.employees.list.newemployees',
                link: '/new-employees'
            },
            {
                id:10,
                label: 'menuitems.employees.list.manageemployees',
                link: '/manage-employees'
            },
        ]
    }:{},

    {
        id: 11,
        label: 'menuitems.trainings.text',
        icon: 'ri-suitcase-2-line',
        link: '',
        subItems: [
            {
                id:12,
                label: 'menuitems.trainings.list.newrecommendation',
                link: '/new-recommendation'
            },
            {
                id:13,
                label: 'menuitems.trainings.list.recommendations',
                link: '/recommendations'
            },
            (user.permissions.find(e => e.name === 'create_schedule')) ?  {
                id:14,
                label: 'menuitems.trainings.list.trainingschedule',
                link: '/new-schedule'
            }:{},

            {
                id:15,
                label: 'menuitems.trainings.list.managetrainingschedule',
                link: '/manage-schedule'
            },

            (user.permissions.find(e => e.name === 'approve_schedule')) ?  {
                id:16,
                label: 'menuitems.trainings.list.approve-schedule',
                link: '/approve-schedules'
            }:{},
        ]
    },

/*    {
        id: 16,
        label: 'menuitems.approval-desk.text',
        icon: ' mdi mdi-checkbox-multiple-marked-outline',
        link: '/approval-desk'
    },*/

    (user.permissions.find(e => e.name === 'manage_nominations')) ?   {
        id: 23,
        label: 'menuitems.nominations.text',
        icon: ' ri-account-pin-box-line',
        link: '',
        subItems: [
          /*  {
                id:24,
                label: 'menuitems.nominations.list.newnominations',
                link: '/new-nomination'
            },*/
            {
                id:25,
                label: 'menuitems.nominations.list.managenominations',
                link: '/manage-nominations'
            },
        ]
    }:{},

    {
        id: 17,
        label: 'menuitems.approved-trainings.text',
        icon: 'ri-calendar-check-line',
        link: '',
        subItems: [
          /*  {
                id:18,
                label: 'menuitems.approved-trainings.list.approvedtrainings',
                link: '/approved-trainings'
            },*/
            {
                id:19,
                label: 'menuitems.approved-trainings.list.manageapprovedtrainings',
                link: '/manage-trainings'
            },
        ]
    },

    {
        id: 20,
        label: 'menuitems.training-archive.text',
        icon: 'ri-archive-line',
        link: '',
        subItems: [
            {
                id:21,
                label: 'menuitems.training-archive.list.trainings',
                link: '/trainings-archive'
            },
        ]
    },


    {
        id: 26,
        label: 'menuitems.reports.text',
        icon: 'ri-file-list-3-line',
        link: '/reports',
    },


 /*   {
        id: 5,
        label: 'menuitems.ecommerce.text',
        icon: 'ri-store-2-line',
        subItems: [
            {
                id: 6,
                label: 'menuitems.ecommerce.list.products',
                link: ''
            },
            {
                id: 7,
                label: 'menuitems.ecommerce.list.productdetail',
                link: ''
            },
            {
                id: 8,
                label: 'menuitems.ecommerce.list.orders',
                link: ''
            },
            {
                id: 9,
                label: 'menuitems.ecommerce.list.customers',
                link: ''
            },
            {
                id: 10,
                label: 'menuitems.ecommerce.list.cart',
                link: ''
            },
            {
                id: 11,
                label: 'menuitems.ecommerce.list.checkout',
                link: ''
            },
            {
                id: 12,
                label: 'menuitems.ecommerce.list.shops',
                link: ''
            },
            {
                id: 13,
                label: 'menuitems.ecommerce.list.addproduct',
                link: ''
            }
        ]
    },
    {
        id: 14,
        label: 'menuitems.email.text',
        icon: 'ri-mail-send-line',
        subItems: [
            {
                id: 15,
                label: 'menuitems.email.list.inbox',
                link: ''
            },
            {
                id: 16,
                label: 'menuitems.email.list.reademail',
                link: ''
            }
        ]
    },
    {
        id: 17,
        label: 'menuitems.kanban.text',
        icon: 'ri-artboard-2-line',
        link: ''
    },
    {
        id: 18,
        isLayout: true
    },
    {
        id: 19,
        label: 'menuitems.pages.text',
        isTitle: true
    },
    {
        id: 20,
        label: 'menuitems.authentication.text',
        icon: 'ri-account-circle-line',
        subItems: [
            {
                id: 21,
                label: 'menuitems.authentication.list.login',
                link: ''
            },
            {
                id: 22,
                label: 'menuitems.authentication.list.register',
                link: ''
            },
            {
                id: 23,
                label: 'menuitems.authentication.list.recoverpwd',
                link: ''
            },
            {
                id: 24,
                label: 'menuitems.authentication.list.lockscreen',
                link: ''
            }
        ]
    },
    {
        id: 25,
        label: 'menuitems.utility.text',
        icon: 'ri-profile-line',
        subItems: [
            {
                id: 26,
                label: 'menuitems.utility.list.starter',
                link: ''
            },
            {
                id: 27,
                label: 'menuitems.utility.list.maintenance',
                link: ''
            },
            {
                id: 28,
                label: 'menuitems.utility.list.comingsoon',
                link: ''
            },
            {
                id: 29,
                label: 'menuitems.utility.list.timeline',
                link: ''
            },
            {
                id: 30,
                label: 'menuitems.utility.list.faqs',
                link: ''
            },
            {
                id: 31,
                label: 'menuitems.utility.list.pricing',
                link: ''
            },
            {
                id: 32,
                label: 'menuitems.utility.list.error404',
                link: ''
            },
            {
                id: 33,
                label: 'menuitems.utility.list.error500',
                link: ''
            },
        ]
    },
    {
        id: 36,
        label: 'menuitems.components.text',
        isTitle: true
    },
    {
        id: 37,
        label: 'menuitems.uielements.text',
        icon: 'ri-pencil-ruler-2-line',
        subItems: [
            {
                id: 38,
                label: 'menuitems.uielements.list.alerts',
                link: ''
            },
            {
                id: 39,
                label: 'menuitems.uielements.list.buttons',
                link: ''
            },
            {
                id: 40,
                label: 'menuitems.uielements.list.cards',
                link: ''
            },
            {
                id: 41,
                label: 'menuitems.uielements.list.carousel',
                link: ''
            },
            {
                id: 42,
                label: 'menuitems.uielements.list.dropdowns',
                link: ''
            },
            {
                id: 43,
                label: 'menuitems.uielements.list.grid',
                link: ''
            },
            {
                id: 44,
                label: 'menuitems.uielements.list.images',
                link: ''
            },
            {
                id: 45,
                label: 'menuitems.uielements.list.lightbox',
                link: ''
            }, {
                id: 46,
                label: 'menuitems.uielements.list.modals',
                link: ''
            }, {
                id: 47,
                label: 'menuitems.uielements.list.rangeslider',
                link: ''
            }, {
                id: 48,
                label: 'menuitems.uielements.list.sessiontimeout',
                link: ''
            },
            {
                id: 49,
                label: 'menuitems.uielements.list.progressbar',
                link: ''
            }, {
                id: 50,
                label: 'menuitems.uielements.list.sweetalert',
                link: ''
            }, {
                id: 51,
                label: 'menuitems.uielements.list.tabs',
                link: ''
            }, {
                id: 52,
                label: 'menuitems.uielements.list.typography',
                link: ''
            }, {
                id: 53,
                label: 'menuitems.uielements.list.video',
                link: ''
            }, {
                id: 54,
                label: 'menuitems.uielements.list.general',
                link: ''
            }, {
                id: 55,
                label: 'menuitems.uielements.list.rating',
                link: ''
            }, {
                id: 56,
                label: 'menuitems.uielements.list.notifications',
                link: ''
            }
        ]
    },
    {
        id: 57,
        label: 'menuitems.forms.text',
        icon: 'ri-eraser-fill',
        badge: {
            variant: 'danger',
            text: 'menuitems.forms.badge'
        },
        subItems: [
            {
                id: 58,
                label: 'menuitems.forms.list.elements',
                link: ''
            },
            {
                id: 59,
                label: 'menuitems.forms.list.validation',
                link: ''
            },
            {
                id: 60,
                label: 'menuitems.forms.list.advanced',
                link: ''
            },
            {
                id: 61,
                label: 'menuitems.forms.list.editor',
                link: ''
            },
            {
                id: 62,
                label: 'menuitems.forms.list.fileupload',
                link: ''
            },
            {
                id: 63,
                label: 'menuitems.forms.list.wizard',
                link: ''
            },
            {
                id: 64,
                label: 'menuitems.forms.list.mask',
                link: '/form/mask'
            }
        ]
    },
    {
        id: 65,
        label: 'menuitems.tables.text',
        icon: 'ri-table-2',
        subItems: [
            {
                id: 66,
                label: 'menuitems.tables.list.basic',
                link: ''
            },
            {
                id: 67,
                label: 'menuitems.tables.list.advanced',
                link: ''
            },
        ]
    },
    {
        id: 69,
        label: 'menuitems.charts.text',
        icon: 'ri-bar-chart-line',
        subItems: [
            {
                id: 70,
                label: 'menuitems.charts.list.apex',
                link: ''
            },
            {
                id: 71,
                label: "menuitems.charts.list.chartjs",
                link: ''
            },
            {
                id: 72,
                label: "menuitems.charts.list.chartist",
                link: ''
            },
            {
                id: 73,
                label: "menuitems.charts.list.echart",
                link: ''
            }
        ]
    },
    {
        id: 74,
        label: "menuitems.icons.text",
        icon: 'ri-brush-line',
        subItems: [
            {
                id: 75,
                label: 'menuitems.icons.list.remix',
                link: ''
            },
            {
                id: 76,
                label: "menuitems.icons.list.materialdesign",
                link: ''
            },
            {
                id: 77,
                label: "menuitems.icons.list.dripicons",
                link: ''
            },
            {
                id: 78,
                label: "menuitems.icons.list.fontawesome",
                link: ''
            }
        ]
    },
    {
        id: 79,
        label: "menuitems.maps.text",
        icon: 'ri-map-pin-line',
        subItems: [
            {
                id: 80,
                label: "menuitems.maps.list.googlemap",
                link: ''
            },
            {
                id: 81,
                label: 'menuitems.maps.list.leaflet',
                link: ''
            }
        ]
    }*/
]