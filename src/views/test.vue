<template>
  <v-app>
    <v-main class="bg-purple-lighten-5">
      <v-container class="py-8">
        <!-- Header Card -->
        <v-card class="mb-3 border-t-purple" elevation="1">
          <div class="purple-accent-4 header-border"></div>
          <v-card-text class="pa-6">
            <h1 class="text-h4 mb-2">Title Feedback</h1>
            <p class="text-body-1 mb-3">
              Thank you for participating in our event. We hope you had as much fun attending as we did organizing it.
            </p>
            <p class="text-body-1 text-grey-darken-1 mb-0">
              We want to hear your feedback so we can keep improving our logistics and content. Please fill this quick survey and let us know your thoughts (your answers will be anonymous).
            </p>
          </v-card-text>
        </v-card>

        <!-- Question Card -->
        <v-card 
          class="mb-3 question-card" 
          :class="{ 'question-focused': isFocused }"
          elevation="1"
          @click="handleCardClick"
        >
          <div v-if="isFocused" class="focus-border"></div>
          <v-card-text class="pa-6">
            <!-- Question Title with Image Icon -->
            <v-row class="mb-4">
              <v-col cols="12" md="10">
                <v-text-field
                  v-model="questionTitle"
                  variant="underlined"
                  hide-details
                  placeholder="Question"
                  class="question-input text-body-1"
                  @focus="isFocused = true"
                />
              </v-col>
              <v-col cols="12" md="2" class="text-right">
                <v-btn icon variant="text" size="small">
                  <v-icon>mdi-image-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Linear Scale Controls -->
            <v-row align="center" class="mb-6">
              <v-col cols="auto">
                <v-select
                  v-model="scaleStart"
                  :items="[0, 1]"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="width: 70px"
                />
              </v-col>
              <v-col cols="auto" class="px-2">
                <span class="text-body-2 text-grey-darken-1">to</span>
              </v-col>
              <v-col cols="auto">
                <v-select
                  v-model="scaleEnd"
                  :items="[2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="width: 70px"
                />
              </v-col>
            </v-row>

            <!-- Scale Labels -->
            <v-row class="mb-0">
              <v-col cols="6">
                <div class="d-flex align-center">
                  <span class="text-body-1 font-weight-medium mr-3" style="min-width: 20px">{{ scaleStart }}</span>
                  <v-text-field
                    v-model="labelStart"
                    variant="plain"
                    hide-details
                    density="compact"
                    placeholder="Label (optional)"
                    class="scale-label-input"
                  />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex align-center">
                  <span class="text-body-1 font-weight-medium mr-3" style="min-width: 20px">{{ scaleEnd }}</span>
                  <v-text-field
                    v-model="labelEnd"
                    variant="plain"
                    hide-details
                    density="compact"
                    placeholder="Label (optional)"
                    class="scale-label-input"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Footer Actions -->
          <v-divider />
          <v-card-actions class="px-6 py-3">
            <v-spacer />
            <v-btn icon variant="text" size="small">
              <v-icon size="20">mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="small">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
            <v-divider vertical class="mx-2" style="height: 24px" />
            <v-switch
              v-model="isRequired"
              hide-details
              density="compact"
              color="purple"
              class="required-switch"
            >
              <template v-slot:label>
                <span class="text-body-2">Required</span>
              </template>
            </v-switch>
            <v-btn icon variant="text" size="small">
              <v-icon size="20">mdi-dots-vertical</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Add Question Button -->
        <v-card class="mb-3 add-question-card" elevation="1">
          <v-card-text class="pa-4 d-flex justify-center align-center">
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="large"
                  variant="text"
                >
                  <v-icon size="28">mdi-plus-circle-outline</v-icon>
                </v-btn>
              </template>
              <v-list density="compact" class="py-2">
                <v-list-item 
                  v-for="type in questionTypes" 
                  :key="type.value"
                  @click="selectQuestionType(type.value)"
                  class="px-4"
                >
                  <template v-slot:prepend>
                    <v-icon size="20" class="mr-3">{{ type.icon }}</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">{{ type.title }}</v-list-item-title>
                  <template v-slot:append v-if="type.badge">
                    <v-chip size="x-small" color="purple" variant="flat">{{ type.badge }}</v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn icon variant="text" size="large" class="ml-2">
              <v-icon size="28">mdi-text-box-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="large" class="ml-2">
              <v-icon size="28">mdi-format-title</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="large" class="ml-2">
              <v-icon size="28">mdi-image-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="large" class="ml-2">
              <v-icon size="28">mdi-play-box-outline</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Floating Action Menu -->
      <div class="floating-menu">
        <v-tooltip text="Question type" location="left">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              class="mb-2"
            >
              <v-menu activator="parent" offset-x location="left">
                <v-list density="compact" class="py-2">
                  <v-list-item 
                    v-for="type in questionTypes" 
                    :key="type.value"
                    @click="selectQuestionType(type.value)"
                    class="px-4"
                  >
                    <template v-slot:prepend>
                      <v-icon size="20" class="mr-3">{{ type.icon }}</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">{{ type.title }}</v-list-item-title>
                    <template v-slot:append v-if="type.badge">
                      <v-chip size="x-small" color="purple" variant="flat">{{ type.badge }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-icon>mdi-playlist-plus</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface QuestionType {
  value: string;
  title: string;
  icon: string;
  badge?: string;
}

const questionTitle = ref('How satisfied were you with the event?');
const scaleStart = ref(1);
const scaleEnd = ref(5);
const labelStart = ref('Not very');
const labelEnd = ref('Very much');
const isRequired = ref(false);
const isFocused = ref(false);

const questionTypes: QuestionType[] = [
  { value: 'short', title: 'Short answer', icon: 'mdi-minus' },
  { value: 'paragraph', title: 'Paragraph', icon: 'mdi-menu' },
  { value: 'multiple', title: 'Multiple choice', icon: 'mdi-radiobox-marked' },
  { value: 'checkboxes', title: 'Checkboxes', icon: 'mdi-checkbox-marked' },
  { value: 'dropdown', title: 'Dropdown', icon: 'mdi-arrow-down-drop-circle-outline' },
  { value: 'file', title: 'File upload', icon: 'mdi-cloud-upload-outline' },
  { value: 'linear', title: 'Linear scale', icon: 'mdi-ray-start-arrow' },
  { value: 'rating', title: 'Rating', icon: 'mdi-star-outline', badge: 'New' },
  { value: 'grid-multiple', title: 'Multiple choice grid', icon: 'mdi-table-large' },
  { value: 'grid-checkbox', title: 'Checkbox grid', icon: 'mdi-table-large' },
  { value: 'date', title: 'Date', icon: 'mdi-calendar-blank' },
  { value: 'time', title: 'Time', icon: 'mdi-clock-time-four-outline' },
];

const selectQuestionType = (type: string) => {
  console.log('Selected question type:', type);
};

const handleCardClick = () => {
  isFocused.value = true;
};
</script>

<style scoped>
.bg-purple-lighten-5 {
  background-color: #f3e5f5;
}

.header-border {
  height: 10px;
  background-color: #673ab7;
  border-radius: 8px 8px 0 0;
}

.border-t-purple {
  border-top: 10px solid #673ab7;
  border-radius: 8px;
}

.question-card {
  position: relative;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.question-focused {
  border-left: 6px solid #673ab7;
}

.focus-border {
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  background-color: #673ab7;
  border-radius: 8px 0 0 8px;
}

.question-input :deep(.v-field__input) {
  font-size: 1rem;
  padding: 8px 0;
}

.question-input :deep(.v-field__underlay) {
  display: none;
}

.question-input :deep(.v-field--focused .v-field__outline) {
  border-color: #673ab7;
}

.scale-label-input :deep(.v-field__input) {
  font-size: 0.875rem;
  padding: 4px 0;
  min-height: auto;
}

.required-switch {
  flex: 0 0 auto;
}

.required-switch :deep(.v-label) {
  font-size: 0.875rem;
  opacity: 1;
}

.add-question-card {
  border-radius: 8px;
  background-color: white;
}

.floating-menu {
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 24px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15);
}

.v-card {
  border-radius: 8px !important;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

/* Remove default vuetify margins */
.v-container {
  max-width: 770px;
}
</style>