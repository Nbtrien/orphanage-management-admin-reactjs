import React from 'react'
import { CNavGroup, CNavItem } from '@coreui/react'
import { FaRegIdCard } from 'react-icons/fa'

import {
  FaChildren,
  FaHandsHoldingChild,
  FaHandHoldingDollar,
  FaPeopleRoof,
  FaUserGear,
  FaRegNewspaper,
  FaGaugeHigh,
  FaUsersLine,
  FaCalendarDays,
} from 'react-icons/fa6'

const _nav = [
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/dashboard',
    icon: <FaGaugeHigh className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Quản lý tài khoản',
    to: '/users',
    icon: <FaUserGear className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách Tài khoản',
        to: '/users/management',
      },
      {
        component: CNavItem,
        name: 'Danh sách Vai trò',
        to: '/roles/management',
      },
      {
        component: CNavItem,
        name: 'Thêm tài khoản',
        to: '/users/create',
      },
      {
        component: CNavItem,
        name: 'Thêm vai trò',
        to: '/roles/create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý trẻ em',
    to: '/children',
    icon: <FaChildren className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách trẻ em',
        to: '/children/information',
      },
      {
        component: CNavItem,
        name: 'Tình trạng trẻ em',
        to: '/children/status',
      },
      {
        component: CNavItem,
        name: 'Tài liệu & hồ sơ',
        to: '/children/records',
      },
      {
        component: CNavItem,
        name: 'Thêm trẻ em',
        to: '/children/create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý gia đình',
    to: '/families',
    icon: <FaPeopleRoof className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách gia đình',
        to: '/families/information',
      },
      {
        component: CNavItem,
        name: 'Danh sách tiêu chuẩn gia đình',
        to: '/families/conditions/management',
      },
      {
        component: CNavItem,
        name: 'Thêm gia đình',
        to: '/families/create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý nhân viên',
    to: '/employees',
    icon: <FaRegIdCard className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách nhân viên',
        to: '/employees/information',
      },
      {
        component: CNavItem,
        name: 'Danh sách công việc',
        to: '/positions/management',
      },
      {
        component: CNavItem,
        name: 'Quản lý bảng lương',
        to: '/monthly-payrolls/management',
      },
      {
        component: CNavItem,
        name: 'Thêm nhân viên',
        to: '/employees/create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý nhận nuôi',
    to: '/adoption',
    icon: <FaHandsHoldingChild className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách Đơn đăng ký',
        to: '/adoption-applications/management',
      },
      {
        component: CNavItem,
        name: 'Lịch sử nhận nuôi',
        to: '/adoption-history/management',
      },
      {
        component: CNavItem,
        name: 'Thêm lịch sử nhận nuôi',
        to: '/adoption-history/create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý tài trợ',
    to: '/donations',
    icon: <FaHandHoldingDollar className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sử dụng nguồn tài trợ',
        to: '/donations/management',
      },
      {
        component: CNavItem,
        name: 'Lịch sử tài trợ',
        to: '/donations/history',
      },
      {
        component: CNavItem,
        name: 'Danh sách chiến dịch tài trợ',
        to: '/donations/programs/management',
      },
      // {
      //   component: CNavItem,
      //   name: 'Báo cáo & thống kê',
      //   to: '/donations/statistics',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý tình nguyện',
    to: '/posts',
    icon: <FaCalendarDays className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách sự kiện',
        to: '/volunteers/events/management',
      },
      {
        component: CNavItem,
        name: 'Danh sách tình nguyện viên',
        to: '/volunteers/management',
      },
      {
        component: CNavItem,
        name: 'Thêm sự kiện',
        to: '/volunteers/events/create',
      },
      {
        component: CNavItem,
        name: 'Lịch sự kiện',
        to: '/volunteers/events/calender',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý nội dung',
    to: '/articles',
    icon: <FaRegNewspaper className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách bài viết',
        to: '/articles/management',
      },
      {
        component: CNavItem,
        name: 'Danh mục bài viết',
        to: '/article-categories/management',
      },
      {
        component: CNavItem,
        name: 'Câu hỏi thường gặp',
        to: '/content/faq/management',
      },
      {
        component: CNavItem,
        name: 'Thông tin website',
        to: '/content/website-contact/create',
      },
      {
        component: CNavItem,
        name: 'Danh sách trang thông tin',
        to: '/content/information-page/management',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản lý thành viên',
    to: '/members',
    icon: <FaUsersLine className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách thành viên',
        to: '/members/management',
      },
      {
        component: CNavItem,
        name: 'Quản lý lịch hẹn',
        to: '/appointments/management',
      },
      {
        component: CNavItem,
        name: 'Lịch hẹn',
        to: '/appointments/calendar',
      },
    ],
  },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Base',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'breadcrumbs',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'jumbotrons',
  //       to: '/base/Jumbotrons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Navs & Tabs',
  //       to: '/base/navs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Placeholders',
  //       to: '/base/placeholders',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Progress',
  //       to: '/base/progress',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Spinners',
  //       to: '/base/spinners',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Button',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Dropdowns',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
