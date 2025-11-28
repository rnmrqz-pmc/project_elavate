<template>
  <!-- Sidebar -->
    <v-app-bar app height="70" class="--bg-main" style="width: 100%;"
      :class="`pa-0 ma-0`" fixed elevation="2">
      
      <!-- Left side: Logo and Nav Icon -->
      <v-toolbar-title class="drawer-title --bg-main align-content-center" style="flex: 0 0 auto;">
        <div class="d-flex justify-center">
          <img class="py-2"
            src="../../assets/images/elevate-white.png"
            alt="Elevate"
            max-height="50"
            style="width: 55%;"
          />
        </div>
      </v-toolbar-title>
      
      <v-app-bar-nav-icon @click="drawer = !drawer" class="text-white" style="flex: 0 0 auto;"/>
      
      <!-- Center: Title -->
      <v-spacer />
      <h2 class="text-center text-white" style="flex: 0 0 auto;">
        Power Mac Center Institute for Excellence     
      </h2>
      <v-spacer />
      
      <!-- Right side: Logout Button -->
      <div class="mx-2 pa-2" style="flex: 0 0 auto;">    
        <v-btn v-if="!(mx.isMobile || mx.isTablet)" @click="logoutDialog = true"
          class="hover-y" color="white" variant="elevated" rounded="pill">
          Logout
        </v-btn>
      </div>
    </v-app-bar>


  <v-navigation-drawer v-model="drawer" permanent
    class="--bg-main pt-2">
      <!-- <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="John Doe"
        subtitle="john@example.com"
        nav
      >
      </v-list-item>

      <v-divider></v-divider> -->

      <v-list nav class="pa-0">
        <template v-for="item in menuItems" :key="item.title">
          <!-- Items without children -->
          <v-list-item
            v-if="!item.children"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.title"
            :to="item.to"
            class="customNav text-white"
          ></v-list-item>

          <!-- Items with children -->
          <v-list-group v-else :value="item.title">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
                class="customNav text-white"
              ></v-list-item>
            </template>

            <template v-for="child in item.children" :key="child.title">
              <!-- First level children without nested children -->
              <v-list-item
                v-if="!child.children"
                :prepend-icon="child.icon"
                :title="child.title"
                :value="child.title"
                :to="child.to"
                class="customNav text-white p-text"
              ></v-list-item>

              <!-- First level children with nested children -->
              <v-list-group v-else :value="child.title" sub-group>
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="child.icon"
                    :title="child.title"
                  ></v-list-item>
                </template>

                <v-list-item
                  v-for="subChild in child.children"
                  :key="subChild.title"
                  :prepend-icon="subChild.icon"
                  :title="subChild.title"
                  :value="subChild.title"
                  :to="subChild.to"
                  color="primary"
                ></v-list-item>
              </v-list-group>
            </template>
          </v-list-group>
        </template>
      </v-list>
        <template v-slot:append>
          <div class="d-flex justify-center py-4">
            <img class="py-2"
              src="../../assets/images/PMC.png"
              alt="Elevate"
              max-height="50"
              style="width: 55%;"
            />
          </div>
        </template>
    </v-navigation-drawer>
  <ConfirmDialog 
    v-model="logoutDialog"
    title="Logout"
    message="Are you sure you want to logout? All unsaved changes will be lost."
    confirmText="Yes"
    cancelText="No"
    @confirm="logout"
  />

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useMXStore } from '@/stores/mx'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const mx = useMXStore();
const props = defineProps<{
  modelValue: boolean
}>()


const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const session = useSessionStore()
const route = useRoute()
const router = useRouter()

const drawer = ref( mx.isMobile || mx.isTablet ? false :  true )
const userSession = computed(() => session.user || {})
const logoutDialog = ref(false)

const menuItems = ref<any[]>([
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Dashboard', icon: 'mdi-home', to: '/dashboard' },
  { title: 'Manage Trainees', icon: 'mdi-account-group', to: '/trainees' },
  { title: 'Calendar', icon: 'mdi-calendar-month', to: '/calendar' },
  { title: 'Manage Schedule', icon: 'mdi-folder', to: '/schedule' },
  { title: 'Training', icon: 'mdi-file-document-edit', to: '/training',
    children: [
      { title: 'Quizzes & Feedback', icon: 'mdi-star', to: '/training/quiz' },
      { title: 'Video Modules', icon: 'mdi-movie-play', to: '/training/test' },
    ]
  },
  { title: 'Generated Email', icon: 'mdi-email', to: '/email' },

  // { title: 'Content', icon: 'mdi-file-document-multiple',
  //   children: [
  //     { title: 'Articles', icon: 'mdi-file-document', to: '/reset' },
  //     { title: 'Categories', icon: 'mdi-folder',
  //       children: [
  //         { title: 'Main Categories', icon: 'mdi-folder-open', to: '/content/categories/main' },
  //         { title: 'Sub Categories', icon: 'mdi-folder-outline', to: '/content/categories/sub' },
  //       ]
  //     },
  //   ]
  // },
]);


const sidebarLinks = ref<any>([
  { to: '/', text: 'Home', role: 'admin|manager|supervisor' },
  { to: '/about', text: 'About', role: 'admin|manager|supervisor' },
  { to: '/contact', text: 'Contact', role: 'admin|manager|supervisor' },
  // Trainer Tab links
  { role: 'trainer', to: '/trainer', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'trainer', to: '/trainer/trainings', text: 'Trainings', icon: 'mdi-account-group' },
  { role: 'trainer', to: '/trainer/calendar', text: 'Calendar', icon: 'mdi-calendar' },
  { role: 'trainer', to: '/trainer/performance', text: 'Performance', icon: 'mdi-star' },
  // Supervisor links
  { role: 'supervisor', to: '/supervisor', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'supervisor', to: '/supervisor/trainers', text: 'Trainers Profile', icon: 'mdi-account-supervisor' },
  { role: 'supervisor', to: '/supervisor/trainings', text: 'Trainings', icon: 'mdi-file-document-check-outline' },
  { role: 'supervisor', to: '/supervisor/calendar', text: 'Calendar of Activities', icon: 'mdi-calendar-month' },
  { role: 'supervisor', to: '/supervisor/trainer_availability', text: 'Trainer Availability', icon: 'mdi-account-clock' },
  { role: 'supervisor', to: '/supervisor/performance_review', text: 'Performance Review', icon: 'mdi-star' },
  { role: 'supervisor', to: '/supervisor/reports', text: 'Report', icon: 'mdi-finance' },
  // Manager links
  { role: 'manager', to: '/manager', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'manager', to: '/manager/trainers', text: 'Trainers Profile', icon: 'mdi-account-supervisor' },
  { role: 'manager', to: '/manager/trainings', text: 'Trainings', icon: 'mdi-file-document-check-outline' },
  { role: 'manager', to: '/manager/calendar', text: 'Calendar of Activities', icon: 'mdi-calendar-month' },
  { role: 'manager', to: '/manager/trainer_availability', text: 'Trainer Availability', icon: 'mdi-account-clock' },
  { role: 'manager', to: '/manager/performance_review', text: 'Performance Review', icon: 'mdi-star' },
  { role: 'manager', to: '/manager/reports', text: 'Report', icon: 'mdi-finance' },
    // Admin links
  { role: 'admin', to: '/test', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'admin', to: '/sidebar', text: 'Trainers Profile', icon: 'mdi-account-supervisor' },
  { role: 'admin', to: '/quiz', text: 'Trainings', icon: 'mdi-file-document-check-outline' },

])

// Filter sidebar links based on the user's role
const activeLinks = computed(() => {
  return sidebarLinks.value.filter((link:any) => link.role === 'admin')
})


//  Logs the user out and redirects to the login page.
const logout = async () => {
  session.logout()
  router.replace({name: 'Login'})
}

// Detect mobile screen size using Vuetify's display service
const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
</script>
