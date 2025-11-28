<template>
  <v-container fluid class="profile-details-page my-2">
    <v-card class="profile-card mx-2" elevation="4">
      <v-card-text class="pa-6">
        <div class="d-flex justify-space-between">
            <h1 class="text-h4 font-weight-bold mb-0" style="color: #8B1538;"> Profile Details </h1>
             <v-btn
              color="#8B1538"
              rounded="pill"
              class="px-10"
              elevation="2"
              @click="handleEdit"
              :disabled="!isFormValid"
            >
              Edit
            </v-btn>
        </div>
       

        <v-row class="ma-0 pa-0">
          <!-- Left Column - Form Fields -->
          <v-col cols="12" lg="8">
            <v-form ref="profileForm" v-model="isFormValid">
              <!-- Full Name and Nick Name Row -->
              <v-row>
                <v-col cols="12" md="6">
                  <label class="field-label">Full Name</label>
                  <v-text-field
                    v-model="profile.fullName"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                    hide-details="auto"
                    class="mb-4" 
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label class="field-label">Nick Name</label>
                  <v-text-field
                    v-model="profile.nickName"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Position and Branch/Team Row -->
              <v-row>
                <v-col cols="12" md="6">
                  <label class="field-label">Position</label>
                  <v-text-field
                    v-model="profile.position"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <label class="field-label">Branch / Team</label>
                  <v-text-field
                    v-model="profile.branch"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Birthday -->
              <v-row>
                <v-col cols="12">
                  <label class="field-label">Birthday</label>
                  <v-text-field
                    v-model="profile.birthday"
                    variant="outlined"
                    density="comfortable"
                    type="date"
                    :rules="[rules.required]"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Address -->
              <v-row>
                <v-col cols="12">
                  <label class="field-label">Address</label>
                  <v-text-field
                    v-model="profile.address"
                    variant="outlined"
                    density="comfortable"
                    placeholder="House #, Street, Barangay, City, Province, ZIP"
                    :rules="[rules.required]"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Email, Company Email, Phone Row -->
              <v-row>
                <v-col cols="12" md="4">
                  <label class="field-label">Email</label>
                  <v-text-field
                    v-model="profile.email"
                    variant="outlined"
                    density="comfortable"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">Company Email</label>
                  <v-text-field
                    v-model="profile.companyEmail"
                    variant="outlined"
                    density="comfortable"
                    type="email"
                    :rules="[rules.email]"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">Phone number / Viber</label>
                  <v-text-field
                    v-model="profile.phone"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Educational Attainment -->
              <v-row>
                <v-col cols="12">
                  <label class="field-label">Educational Attainment</label>
                  <v-text-field
                    v-model="profile.education"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Recent Job Experience Row -->
              <v-row>
                <v-col cols="12" md="4">
                  <label class="field-label">Recent Job Experience</label>
                  <v-text-field
                    v-model="profile.recentCompany"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">Position</label>
                  <v-text-field
                    v-model="profile.recentPosition"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">Duration</label>
                  <v-text-field
                    v-model="profile.duration"
                    variant="outlined"
                    density="comfortable"
                    placeholder="2024 - 2025"
                    hide-details="auto"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <!-- Right Column - Photo Upload -->
          <v-col cols="12" lg="4" class="d-flex flex-column align-center">
            <div class="photo-upload-section text-center">
              <div class="photo-preview mb-4">
                <v-avatar
                  v-if="profile.photoUrl"
                  size="200"
                  class="photo-avatar"
                >
                  <v-img :src="profile.photoUrl" cover></v-img>
                </v-avatar>
                <v-avatar
                  v-else
                  size="200"
                  class="photo-avatar"
                  color="grey-lighten-2"
                >
                  <v-icon size="80" color="grey">mdi-account</v-icon>
                </v-avatar>
              </div>
              
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileUpload"
              />
              
              <v-btn
                variant="text"
                class="upload-btn"
                @click="triggerFileUpload"
              >
                Upload photo
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Edit Button -->
        <v-row class="mt-4">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="#8B1538"
              size="large"
              rounded="pill"
              class="px-10"
              elevation="2"
              @click="handleEdit"
              :disabled="!isFormValid"
            >
              Edit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Profile {
  fullName: string;
  nickName: string;
  position: string;
  branch: string;
  birthday: string;
  address: string;
  email: string;
  companyEmail: string;
  phone: string;
  education: string;
  recentCompany: string;
  recentPosition: string;
  duration: string;
  photoUrl: string;
}

interface Snackbar {
  show: boolean;
  message: string;
  color: string;
}

// Refs
const profileForm = ref();
const fileInput = ref<HTMLInputElement>();
const isFormValid = ref(false);

// State
const profile = reactive<Profile>({
  fullName: 'Juan Dela Cruz',
  nickName: 'Juan',
  position: 'Partner Trainer',
  branch: 'IT',
  birthday: '1994-11-08',
  address: 'House #, Street, Barangay, City, Province, ZIP',
  email: 'juan.delacruz',
  companyEmail: 'juan@powermaccenter.com',
  phone: '0912-345-6789',
  education: 'University',
  recentCompany: 'Company',
  recentPosition: 'IT',
  duration: '2024 - 2025',
  photoUrl: ''
});

const snackbar = reactive<Snackbar>({
  show: false,
  message: '',
  color: 'success'
});

// Validation Rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => {
    if (!v) return true; // Optional field
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(v) || 'Invalid email format';
  }
};

// Methods
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showSnackbar('File size must be less than 5MB', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.photoUrl = e.target?.result as string;
      showSnackbar('Photo uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleEdit = async () => {
  const { valid } = await profileForm.value.validate();
  
  if (valid) {
    // Here you would typically make an API call to save the profile
    console.log('Saving profile:', profile);
    showSnackbar('Profile updated successfully!', 'success');
  } else {
    showSnackbar('Please fill in all required fields correctly', 'error');
  }
};

const showSnackbar = (message: string, color: string) => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};
</script>

<style scoped>
.profile-details-page {
  background-color: #e2e2e2;
  min-height: 100vh;
  /* padding: 40px 20px; */
}

.profile-card {
  background-color: #f5f5f5;
  border-radius: 16px;
}

.field-label {
  display: block;
  font-size: 0.95rem;
  color: #9e9e9e;
  margin-bottom: 8px;
  font-weight: 500;
}

.v-text-field :deep(.v-field) {
  background-color: white;
  border: 1px solid #8B1538;
  /* border-color: #8B1538; */
}

/* .v-text-field :deep(.v-field--focused) {
  border: 2px solid #8B1538;
} */

.photo-upload-section {
  position: sticky;
  top: 20px;
}

.photo-avatar {
  border: 3px solid #8B1538;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-btn {
  color: #8B1538;
  font-weight: 600;
  text-decoration: underline;
  font-size: 1rem;
}

.upload-btn:hover {
  background-color: rgba(139, 21, 56, 0.05);
}

/* Custom input styling */
:deep(.v-input__details) {
  padding-top: 4px;
  min-height: 0;
}

:deep(.v-messages) {
  min-height: 0;
}
</style>