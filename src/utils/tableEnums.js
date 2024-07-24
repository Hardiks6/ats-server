export const userTable = {
    USER_IS_VERIFIED_YES: 'Y',
    USER_IS_VERIFIED_NO: 'N',
    USER_STATUS_IN_ACTIVE: 'I',
    USER_STATUS_PENDING: 'P',
    USER_STATUS_ACTIVE: 'A',
}

export const menuLists = [
    {
        key: 'dashboard',
        name: 'Dashboard'
    },
    {
        key: 'order',
        name: 'Orders'
    },
    {
        key: 'product',
        name: 'Products'
    },
    {
        key: 'services',
        name: 'Services'
    },
    {
        key: 'coupons_referrals',
        name: 'Coupons & Referrals'
    },
    {
        key: 'reports',
        name: 'Reports'
    },
    {
        key: 'users',
        name: 'Users',
        subMenu: [
            {
                key: 'customers',
                name: 'Customers'
            },
            {
                key: 'washers',
                name: 'Washers'
            },
            {
                key: 'admin',
                name: 'Admin'
            }
        ]
    },
    {
        key: 'manage_training',
        name: 'Manage Training',
        subMenu: [
            {
                key: 'modules',
                name: 'Modules'
            },
            {
                key: 'videos',
                name: 'Videos'
            },
            {
                key: 'questions',
                name: 'Questions'
            }
        ]
    },
    {
        key: 'finance',
        name: 'Finance'
    },
    {
        key: 'notifications',
        name: 'Notifications'
    },
    {
        key: 'cms',
        name: 'CMS',
        subMenu: [
            {
                key: 'faqs',
                name: 'FAQs'
            },{
                key: 'tandc',
                name: 'T&C'
            }
        ]
    },
    {
        key: 'support',
        name: 'Support'
    },
    {
        key: 'setting',
        name: 'Setting'
    }
]