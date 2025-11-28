<template>
  <v-app v-if="ready">
    <v-main class="bg-grey-lighten-2">
      <router-view />
      <GlobalAlert />
    </v-main>
    <Sidebar v-if="!isLogin" v-model="drawer" />

  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from './stores/session'
import { useMXStore } from './stores/mx'
import Sidebar from '@/components/layout/Sidebar.vue'
import GlobalAlert from '@/components/ui/GlobalAlert.vue'

const mx = useMXStore();
const session = useSessionStore();
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance()!

const device_uuid = mx.getDeviceId();
const user_agent = mx.getUserAgent();
const drawer = ref(true)
const ready = ref(false)

async function check2fa() {
    let data = {
        userID: session.user.ID,
        UUID: device_uuid,
        USER_AGENT: user_agent
    }
    if(session.auth == 'null'){
      const res = await proxy!.$api.check2FA(data)
      session.setAuth(res.data.status)
    }

}

onMounted(async () => {
  await router.isReady()
  ready.value = true
  if(session.user){
    await check2fa()
  }
})

const isLogin = computed(() => route.path === '/login' || route.path == '/2fa_auth')
</script>
