<template>
  <v-app>
    <v-main class="login-main">
      <v-container fluid class="fill-height pa-4">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="10" xl="8">
            <v-card class="login-card" elevation="0">
              <v-row no-gutters>
                <v-col cols="12" md="6" 
                  class="left-section d-flex flex-column justify-center align-center pa-8"
                  style="height: 80vh;"
                >
                  <div class="logo-container mb-4">
                    <img 
                      src="../../assets/images/PMC.png"
                      alt="Elevate"
                      max-height="50"
                      style="width: 100%;"
                    />
                  </div>
                  
                  <h1 class="welcome-text text-center">
                    Welcome to<br/>PMCIE!
                  </h1>
                </v-col>

                <v-col 
                  cols="12" 
                  md="6" 
                  class="right-section d-flex flex-column justify-center pa-8 pa-md-12"
                >
                  <v-form @submit.prevent="handleLogin">
                    <div class="mb-6">
                      <label class="form-label p-bold">Username</label>
                      <v-text-field
                        v-model="username"
                        variant="outlined"
                        class="mt-2"
                        hide-details
                        rounded="lg"
                        bg-color="white"
                      ></v-text-field>
                    </div>

                    <div class="mb-4">
                      <label class="form-label p-bold">Password</label>
                      <v-text-field
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        variant="outlined"
                        class="mt-2"
                        rounded="lg"
                        hide-details
                        bg-color="white"
                      >
                        <template v-slot:append-inner>
                          <v-icon 
                            @click="showPassword = !showPassword"
                            class="cursor-pointer"
                            color="grey-darken-1"
                          >
                            {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>

                    <div class="text-center mb-6">
                      <a href="#" class="forgot-link">Forgot your password?</a>
                    </div>

                    <div class="text-center">
                      <v-btn
                        type="submit"
                        size="large"
                        class="login-btn px-12"
                        elevation="0"
                      >
                        Login
                      </v-btn>
                    </div>
                  </v-form>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = () => {
  console.log('Login attempted', { username: username.value });
};
</script>

<style scoped>
.login-main {
  background: linear-gradient(135deg, #8f0f20 0%, #8f0f20 100%);
  min-height: 100vh;
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid white;
}

.left-section {
  background: linear-gradient(135deg, #8f0f20 0%, #8f0f20 100%);
  color: white;
  min-height: 400px;
}

.right-section {
  background: linear-gradient(135deg, #8f0f20 0%, #8f0f20 100%);
  color: white;
}

.logo-container {
  width: 200px;
  height: 200px;
}

.logo {
  width: 100%;
  height: 100%;
}

.circle-text {
  fill: white;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.welcome-text {
  font-size: 48px;
  font-weight: 600;
  line-height: 1.2;
}

.form-label {
  color: white;
  font-size: 16px;
  font-weight: 500;
  display: block;
}

.forgot-link {
  color: white;
  text-decoration: underline;
  font-size: 14px;
}

.forgot-link:hover {
  opacity: 0.8;
}



/* Responsive adjustments */
@media (max-width: 960px) {
  .left-section {
    min-height: 300px;
  }
  
  .welcome-text {
    font-size: 36px;
  }
  
  .logo-container {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 600px) {
  .welcome-text {
    font-size: 32px;
  }
  
  .logo-container {
    width: 120px;
    height: 120px;
  }
  
  .circle-text {
    font-size: 9px;
  }
}
</style>