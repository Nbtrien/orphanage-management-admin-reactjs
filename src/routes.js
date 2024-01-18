import React from 'react'
import ChildrenDetail from './views/children/ChildrenDetail'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))
const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// My pages
// User management pages
const UserManagement = React.lazy(() => import('./views/users/UserManagement'))
const CreateUser = React.lazy(() => import('./views/users/CreateUser'))
const UserDetail = React.lazy(() => import('./views/users/UserDetail'))
const EditUser = React.lazy(() => import('./views/users/EditUser'))
const RoleManagement = React.lazy(() => import('./views/users/RoleManagement'))
const CreateRole = React.lazy(() => import('./views/users/CreateRole'))
const EditRole = React.lazy(() => import('./views/users/EditRole'))
const RoleDetail = React.lazy(() => import('./views/users/RoleDetail'))
// Children management pages
const CreateChildren = React.lazy(() => import('./views/children/CreateChildren'))
const ChildrenManagement = React.lazy(() => import('./views/children/ChildrenManagement'))
const CreateRelative = React.lazy(() => import('./views/children/CreateRelative'))
const CreateMedicalRecord = React.lazy(() => import('./views/children/CreateMedicalRecord'))
const CreateVaccinationRecord = React.lazy(() => import('./views/children/CreateVaccinationRecord'))
const EditChildren = React.lazy(() => import('./views/children/EditChildren'))
const ChildrenStatusManagement = React.lazy(() =>
  import('./views/children/ChildrenStatusManagement'),
)
const ChildrenRecordManagement = React.lazy(() =>
  import('./views/children/ChildrenRecordManagement'),
)
const UpdateChildrenStatus = React.lazy(() => import('./views/children/UpdateChildrenStatus'))

// Employee management pages
const CreateEmployee = React.lazy(() => import('./views/employees/CreateEmployee'))
const EmployeeManagement = React.lazy(() => import('./views/employees/EmployeeManagement'))
const EmployeeDetails = React.lazy(() => import('./views/employees/EmployeeDetails'))
const PositionManagement = React.lazy(() => import('./views/employees/PositionManagement'))
const PayrollManagement = React.lazy(() => import('./views/employees/PayrollManagement'))
const MonthlyPayrollManagement = React.lazy(() =>
  import('./views/employees/MonthlyPayrollManagement'),
)
const EditEmployee = React.lazy(() => import('./views/employees/EditEmployee'))
const CreatePosition = React.lazy(() => import('./views/employees/CreatePosition'))
const CreateMonthlyPayroll = React.lazy(() => import('./views/employees/CreateMonthlyPayroll'))

// Family management pages
const FamilyManagement = React.lazy(() => import('./views/families/FamilyManagement'))
const CreateFamily = React.lazy(() => import('./views/families/CreateFamily'))
const FamilyDetails = React.lazy(() => import('./views/families/FamilyDetails'))
const CreateFamilyPost = React.lazy(() => import('./views/families/CreateFamilyPost'))
const FamilyConditionManagement = React.lazy(() =>
  import('./views/families/FamilyConditionManagement'),
)
const CreateFamilyCondition = React.lazy(() => import('./views/families/CreateFamilyCondition'))

// Adoption management pages
const AdoptionApplicationManagement = React.lazy(() =>
  import('./views/adoption/AdoptionApplicationManagement'),
)
const AdoptionApplicationDetails = React.lazy(() =>
  import('./views/adoption/AdoptionApplicationDetails'),
)
const CreateAdoptionHistory = React.lazy(() => import('./views/adoption/CreateAdoptionHistory'))
const AdoptionHistoryManagement = React.lazy(() =>
  import('./views/adoption/AdoptionHistoryManagement'),
)
const AdoptionHistoryDetail = React.lazy(() => import('./views/adoption/AdoptionHistoryDetail'))
const CreateAdoptionHistoryFromApplication = React.lazy(() =>
  import('./views/adoption/CreateAdoptionHistoryFromApplication'),
)

// Donation management pages
const DonationManagement = React.lazy(() => import('./views/donations/DonationManagement'))
const DonationHistory = React.lazy(() => import('./views/donations/DonationHistory'))
const DonationProgramManagement = React.lazy(() =>
  import('./views/donations/DonationProgramManagement'),
)
const CreateDonationPurpose = React.lazy(() => import('./views/donations/CreateDonationPurpose'))
const CreateDonationPurposePost = React.lazy(() =>
  import('./views/donations/CreateDonationPurposePost'),
)

// Volunteer management pages
const CreateEvent = React.lazy(() => import('./views/volunteers/CreateEvent'))
const EventManagement = React.lazy(() => import('./views/volunteers/EventManagement'))
const EventDetailManagement = React.lazy(() => import('./views/volunteers/EventDetailManagement'))
const VolunteerManagement = React.lazy(() => import('./views/volunteers/VolunteerManagement'))
const VolunteerDetailManagement = React.lazy(() =>
  import('./views/volunteers/VolunteerDetailManagement'),
)
const EventCalender = React.lazy(() => import('./views/volunteers/EventCalender'))

// Article management pages
const CreateCategory = React.lazy(() => import('./views/articles/CreateCategory'))
const CreateArticle = React.lazy(() => import('./views/articles/CreateArticle'))
const ArticleManagement = React.lazy(() => import('./views/articles/ArticleManagement'))
const ArticleCategoryManagement = React.lazy(() =>
  import('./views/articles/ArticleCategoryManagement'),
)
const InformationPageManagement = React.lazy(() =>
  import('./views/articles/InformationPageManagement'),
)
const CreateFaqQuestion = React.lazy(() => import('./views/articles/CreateFaqQuestion'))
const FaqQuestionManagement = React.lazy(() => import('./views/articles/FaqQuestionManagement'))
const CreateWebsiteContact = React.lazy(() => import('./views/articles/CreateWebsiteContact'))
const CreateInformationPage = React.lazy(() => import('./views/articles/CreateInformationPage'))

// Member management pages
const MemberManagement = React.lazy(() => import('./views/members/MemberManagement'))
const AppointmentManagement = React.lazy(() => import('./views/members/AppointmentManagement'))
const AppointmentCalendar = React.lazy(() => import('./views/members/AppointmentCalendar'))

const routes = [
  // User management routes
  { path: '/users', name: 'Tài khoản', exact: true },
  { path: '/users/management', name: 'Tài khoản', element: UserManagement },
  { path: '/users/create', name: 'Thêm mới', element: CreateUser },
  { path: '/users/:id', name: 'Chi tiết', element: UserDetail },
  { path: '/users/:id/edit', name: 'Chỉnh sửa', element: EditUser },
  { path: '/roles', name: 'Phân quền', exact: true },
  { path: '/roles/management', name: 'Phân quền', element: RoleManagement },
  { path: '/roles/create', name: 'Thêm mới', element: CreateRole },
  { path: '/roles/:id/edit', name: 'Chỉnh sửa', element: EditRole },
  { path: '/roles/:id', name: 'Chi tiết', element: RoleDetail },

  // Children management routes
  { path: '/children/create', name: 'Thêm mới', element: CreateChildren },
  { path: '/children', name: 'Trẻ em', element: Buttons, exact: true },
  { path: '/children/information', name: 'Quản lý', element: ChildrenManagement },
  { path: '/relatives', name: 'Người thân', exact: true },
  { path: '/relatives/create', name: 'Thêm mới', element: CreateRelative },
  { path: '/children/:id', name: 'Chi tiết', element: ChildrenDetail },
  { path: '/medical-records/create', name: 'Hồ sơ y tế', element: CreateMedicalRecord },
  {
    path: '/vaccination-records/create',
    name: 'Hồ sơ vaccin',
    element: CreateVaccinationRecord,
  },
  { path: '/children/:id/edit', name: 'Cập nhật', element: EditChildren },
  { path: '/children/status', name: 'Quản lý tình trạng', element: ChildrenStatusManagement },
  { path: '/children/records', name: 'Quản lý hồ sơ', element: ChildrenRecordManagement },
  { path: '/children/:id/update-status', name: 'Quản lý hồ sơ', element: UpdateChildrenStatus },

  // Employee management routes
  { path: '/employees', name: 'Nhân viên', exact: true },
  { path: '/employees/information', name: 'Quản lý', element: EmployeeManagement },
  { path: '/employees/create', name: 'Thêm mới', element: CreateEmployee },
  { path: '/employees/:id', name: 'Chi tiết', element: EmployeeDetails },
  { path: '/employees/:id/edit', name: 'Chi tiết', element: EditEmployee },
  { path: '/positions/management', name: 'Công việc', element: PositionManagement },
  {
    path: '/monthly-payrolls/management',
    name: 'Quản lý lương',
    element: MonthlyPayrollManagement,
  },
  { path: '/monthly-payrolls/:id', name: 'Tính lương', element: PayrollManagement },
  { path: '/positions/create', name: 'Công việc', element: CreatePosition },
  {
    path: '/monthly-payrolls/create',
    name: 'Quản lý lương',
    element: CreateMonthlyPayroll,
  },

  // Family management routes
  { path: '/families', name: 'Gia đình', exact: true },
  { path: '/families/information', name: 'Quản lý', element: FamilyManagement },
  { path: '/families/create', name: 'Thêm mới', element: CreateFamily },
  {
    path: '/families/conditions/management',
    name: 'Tiêu chuẩn',
    element: FamilyConditionManagement,
  },
  {
    path: '/families/conditions/create',
    name: 'Tiêu chuẩn',
    element: CreateFamilyCondition,
  },
  { path: '/families/:id', name: 'Chi tiết', element: FamilyDetails },
  { path: '/families/:id/posts/create', name: 'Thêm bài viết', element: CreateFamilyPost },

  // Adoption management routes
  {
    path: '/adoption-applications/management',
    name: 'Quản lý nhận nuôi',
    element: AdoptionApplicationManagement,
  },
  {
    path: '/adoption-applications/:id',
    name: 'Detail',
    element: AdoptionApplicationDetails,
  },
  {
    path: '/adoption-history/management',
    name: 'adoption history',
    element: AdoptionHistoryManagement,
  },
  {
    path: '/adoption-history/create',
    name: 'create',
    element: CreateAdoptionHistory,
  },
  {
    path: '/adoption-history/:id',
    name: 'Detail',
    element: AdoptionHistoryDetail,
  },
  {
    path: '/adoption-applications/:id/adoption-history/create',
    name: 'create',
    element: CreateAdoptionHistoryFromApplication,
  },

  // Donation management routes
  {
    path: '/donations',
    name: 'Tài trợ',
    exact: true,
  },
  {
    path: '/donations/management',
    name: 'Sử dụng tài trợ',
    element: DonationManagement,
  },
  {
    path: '/donations/history',
    name: 'Lịch sử tài trợ',
    element: DonationHistory,
  },
  {
    path: '/donations/programs/management',
    name: 'Chiến dịch tài trợ',
    element: DonationProgramManagement,
  },
  {
    path: '/donations/programs/create',
    name: 'Program',
    element: CreateDonationPurpose,
  },
  {
    path: '/donations/programs/:id',
    name: 'Program',
    element: CreateDonationPurposePost,
  },

  // Donation management routes
  {
    path: '/volunteers',
    name: 'Tình nguyện',
    exact: true,
  },
  {
    path: '/volunteers',
    name: 'Tình nguyện',
    exact: true,
  },
  {
    path: '/volunteers/events/management',
    name: 'Quản lý Sự kiện',
    element: EventManagement,
  },
  {
    path: '/volunteers/events/:id/management',
    name: 'Quản lý Sự kiện',
    element: EventDetailManagement,
  },
  {
    path: '/volunteers/management',
    name: 'Quản lý tình nguyện viên',
    element: VolunteerManagement,
  },
  {
    path: '/volunteers/:id/management',
    name: 'Quản lý tình nguyện viên',
    element: VolunteerDetailManagement,
  },
  {
    path: '/volunteers/events/calender',
    name: 'Lịch sự kiện',
    element: EventCalender,
  },
  {
    path: '/volunteers/events/create',
    name: 'Thêm sự kiện',
    element: CreateEvent,
  },

  // Article management routes
  {
    path: '/articles/management',
    name: 'Bài viết',
    element: ArticleManagement,
  },
  {
    path: '/article-categories/management',
    name: 'Danh mục',
    element: ArticleCategoryManagement,
  },
  {
    path: '/article-categories/create',
    name: 'Danh mục',
    element: CreateCategory,
  },
  {
    path: '/articles/create',
    name: 'Bài viết',
    element: CreateArticle,
  },
  {
    path: '/content/faq/management',
    name: 'FAQ',
    element: FaqQuestionManagement,
  },
  {
    path: '/content/faq/create',
    name: 'FAQ',
    element: CreateFaqQuestion,
  },
  {
    path: '/content/website-contact/create',
    name: 'FAQ',
    element: CreateWebsiteContact,
  },
  {
    path: '/content/information-page/management',
    name: 'Information Page',
    element: InformationPageManagement,
  },
  {
    path: '/content/information-page/create',
    name: 'Information Page',
    element: CreateInformationPage,
  },

  // Member management routes
  {
    path: '/members/management',
    name: 'Thành viên',
    element: MemberManagement,
  },
  {
    path: '/appointments/management',
    name: 'Lịch hẹn',
    element: AppointmentManagement,
  },
  {
    path: '/appointments/calendar',
    name: 'Lịch hẹn',
    element: AppointmentCalendar,
  },

  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/jumbotrons', name: 'Paginations', element: Jumbotrons },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },

  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
