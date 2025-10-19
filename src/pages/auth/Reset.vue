<template>
  <v-app>
    <v-main class="reset-main">
      <v-container fluid class="fill-height pa-4">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="10" xl="8">
            <v-card class="reset-card" elevation="0">
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
                  <v-form @submit.prevent="handleReset">
                    <h2 class="mb-2 text-center">Password Reset</h2>
                    <div class="mb-4">
                      <label class="form-label p-bold">Password</label>
                      <v-text-field
                        v-model="formModel.password"
                        :type="formModel.showPass ? 'text' : 'password'"
                        variant="outlined"
                        class="mt-2"
                        hide-details
                        rounded="lg"
                        bg-color="white"
                      >
                        <template v-slot:append-inner>
                          <v-icon 
                            @click="formModel.showPass = !formModel.showPass"
                            class="cursor-pointer"
                            color="grey-darken-1">
                            {{ formModel.showPass ? 'mdi-eye-off' : 'mdi-eye' }}
                          </v-icon>
                        </template>
                    </v-text-field>
                    </div>

                    <div class="mb-4">
                      <label class="form-label p-bold">Confirm Password</label>
                      <v-text-field
                        v-model="formModel.confirmPassword"
                        :type="formModel.showPass2 ? 'text' : 'password'"
                        variant="outlined"
                        class="mt-2"
                        rounded="lg"
                        hide-details
                        bg-color="white">
                        <template v-slot:append-inner>
                          <v-icon 
                            @click="formModel.showPass2 = !formModel.showPass2"
                            class="cursor-pointer"
                            color="grey-darken-1">
                            {{ formModel.showPass2 ? 'mdi-eye-off' : 'mdi-eye' }}
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>

                    <v-expand-transition>
                        <div v-if="showPasswordRequirements" class="password-requirements card-item pa-3 bg-white mb-4">
                            <div class="d-flex align-center mb-2 text-black">
                            <v-icon size="16" class="mr-2">mdi-shield-check</v-icon>
                            <span class="text-body-2 font-weight-medium">Password Requirements:</span>
                            </div>
                            
                            <div class="requirements-grid">
                            <div 
                                v-for="(req, key) in passwordRequirements" 
                                :key="key"
                                class="requirement-item d-flex align-center mb-1"
                            >
                                <v-icon 
                                :color="req.met ? 'success' : 'error'" 
                                size="16" 
                                class="mr-2"
                                >
                                {{ req.met ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                </v-icon>
                                <span 
                                :class="req.met ? 'text-success' : 'text-error'"
                                class="text-body-2"
                                >
                                {{ req.text }}
                                </span>
                            </div>
                            </div>
                                    <!-- Password Strength Indicator -->
                            <div v-if="formModel.password" class="mb-4 pt-3">
                            <div class="d-flex justify-space-between align-center mb-1">
                                <span class="text-body-2 text-black">Password Strength</span>
                                <span class="text-body-2 font-weight-medium" :class="passwordStrength.colorClass">
                                {{ passwordStrength.label }}
                                </span>
                            </div>
                            <v-progress-linear
                                :model-value="passwordStrength.score"
                                :color="passwordStrength.color"
                                height="4"
                                rounded
                            />
                            </div>
                        </div>
                    </v-expand-transition>
                
              

                    <div class="text-center">
                      <v-btn
                        type="submit"
                        size="large" rounded="lg"
                        class="reset-btn px-12"
                        elevation="0"
                      >
                        reset
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
import { ref, computed } from 'vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const formModel = ref({
  password: '',
  confirmPassword: '',
  showPass: false,
  showPass2: false,
  email: '',
  trainerID: '',
  expirationDate: ''
});




const passwordRequirements = computed(() => ({
  length: {
    text: 'At least 8 characters long',
    met: formModel.value.password.length >= 8
  },
  upper: {
    text: 'Include at least one uppercase letter',
    met: /[A-Z]/.test(formModel.value.password)
  },
  lower: {
    text: 'Include at least one lowercase letter',
    met: /[a-z]/.test(formModel.value.password)
  },
  number: {
    text: 'Include at least one number',
    met: /\d/.test(formModel.value.password)
  },
  special: {
    text: 'Include at least one special character (@$!%*?&)',
    met: /[@$!%*?&]/.test(formModel.value.password)
  },
  confirm: {
    text: formModel.value.password === formModel.value.confirmPassword ? 'Passwords match' : 'Passwords do not match',
    met: formModel.value.password === formModel.value.confirmPassword
  }
}));
const showPasswordRequirements = computed(() => {
  return formModel.value.password.length > 0 
});
const passwordStrength = computed(() => {
  const password = formModel.value.password;
  if (!password) return { score: 0, label: '', color: 'grey', colorClass: '' };

  let score = 0;
  const requirements = passwordRequirements.value;

  // Calculate score based on requirements
  Object.values(requirements).forEach(req => {
    if (req.met) score += 20;
  });

  // Additional complexity bonus
  if (password.length >= 12) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;

  let label = '';
  let color = '';
  let colorClass = '';

  if (score < 40) {
    label = 'Weak';
    color = 'error';
    colorClass = 'text-error';
  } else if (score < 80) {
    label = 'Fair';
    color = 'warning';
    colorClass = 'text-warning';
  } else if (score < 100) {
    label = 'Good';
    color = 'info';
    colorClass = 'text-info';
  } else {
    label = 'Strong';
    color = 'success';
    colorClass = 'text-success';
  }

  return { score, label, color, colorClass };
});


const handleReset = () => {
    
}



</script>



















<style scoped>
.reset-main {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  min-height: 100vh;
}

.reset-card {
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid white;
}

.left-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  color: white;
  min-height: 400px;
}

.right-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
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