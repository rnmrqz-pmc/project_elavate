import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const BASE_PATH = import.meta.env.VITE_BASE_PATH as string

// ---- Route Definitions ----
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Root', redirect: '/login',
    meta: { requiresAuth: false }
  },
  { path: '/login', name: 'Login', component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/reset', name: 'reset', component: () => import('../views/auth/Reset.vue'),
    meta: { requiresAuth: false }
  },

  { path: '/quiz', name: 'quiz', component: () => import('../views/QuizCreator2.vue'),
    meta: { requiresAuth: false }
  },
   { path: '/sidebar', name: 'sidebar', component: () => import('../views/Side.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/calendar', name: 'calendar', component: () => import('../views/Calendar.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/email', name: 'email', component: () => import('../views/EmailGenerator.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/profile', name: 'profile', component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/trainees', name: 'trainees', component: () => import('../views/Trainee.vue'),
    meta: { requiresAuth: false }
  },



]



// ---- Create Router Instance ----
const router = createRouter({
  history: createWebHistory(`${BASE_PATH}`),
  routes,
})


// ---- Navigation Guards ----
// Handles authentication, 2FA, and role-based access before each route change
router.beforeEach((_to, _from, next) => {
  // const session = useSessionStore()
  // const isLoggedIn = !!session.user

  // // Restrict access to protected routes
  // if (!isLoggedIn && (to.meta.requiresAuth || to.name === '2fa')) {
  //   return next('/login')
  // }

  // // Redirect root path to login if not logged in
  // if (!isLoggedIn && to.path === '/') {
  //   return next('/login')
  // }

  // // Manage 2FA and role-based redirection
  // if (isLoggedIn) {
  //   // 2FA is complete, but user is trying to access 2FA page
  //   if (session.auth === 'true' && to.name === '2fa') {
  //     return next('/')
  //   }

  //   // 2FA not complete, redirect to 2FA page
  //   if (session.auth != 'true' && to.name !== '2fa') {
  //     return next({ name: '2fa' })
  //   }

  //   // Redirect from login/password reset/root to role-based route
  //   if (to.path === '/login' || to.name === 'PasswordReset' || to.path === '/') {
  //     return next(`/${session.user.role}`)
  //   }

  //   // Prevent access to other roles’ routes
  //   if (to.meta.requiresAuth && to.meta.role && to.meta.role !== session.user.role) {
  //     return next('/')
  //   }
  // }

  // Allow navigation to proceed
  next()
})



export default router
