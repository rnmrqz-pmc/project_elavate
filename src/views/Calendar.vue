<template>
  <v-container fluid class="training-calendar pa-8">
    <h1 class="text-h3 font-weight-bold mb-8" style="color: #8B1538;">
      Training Calendar
    </h1>

    <!-- Filter Row -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedTraining"
          :items="trainingTypes"
          label="Training"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Month"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedTrainer"
          :items="trainers"
          label="Trainer"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="9">
        <v-card elevation="0" class="calendar-card">
          <!-- Month Navigation -->
          <v-card-title class="d-flex justify-center align-center py-6">
            <v-btn
              icon
              variant="text"
              @click="changeMonth(-1)"
              size="large"
            >
              <v-icon color="#8B1538" size="40">mdi-chevron-left</v-icon>
            </v-btn>
            <h2 class="text-h4 mx-8" style="color: #8B1538;">{{ currentMonthYear }}</h2>
            <v-btn
              icon
              variant="text"
              @click="changeMonth(1)"
              size="large"
            >
              <v-icon color="#8B1538" size="40">mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Calendar Grid -->
          <v-card-text>
            <div class="calendar-grid">
              <!-- Day Headers -->
              <div
                v-for="day in dayNames"
                :key="day"
                class="calendar-header text-center font-weight-bold py-3"
                style="border: 2px solid #8B1538;"
              >
                {{ day }}
              </div>

              <!-- Calendar Days -->
              <div
                v-for="(cell, index) in calendarCells"
                :key="index"
                class="calendar-cell"
                :style="cellStyle"
              >
                <div v-if="cell.day" class="pa-2">
                  <div class="text-body-1 font-weight-medium mb-2">{{ cell.day }}</div>
                  
                  <!-- Training Event -->
                  <v-card
                    v-if="cell.training"
                    :color="cell.training.color"
                    class="training-event pa-3 text-center"
                    elevation="0"
                    @click="selectBatch(cell.training)"
                    style="cursor: pointer;"
                  >
                    <div class="text-white font-weight-bold text-caption">
                      {{ cell.training.batch }}
                    </div>
                    <div class="text-white text-caption">
                      {{ cell.training.type }}
                    </div>
                  </v-card>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Participants Panel -->
      <v-col cols="12" lg="3">
        <v-card elevation="2" class="participants-card">
          <v-card-title class="text-h5 font-weight-bold text-center py-6">
            {{ selectedBatch?.batch || 'Batch 18' }}
          </v-card-title>
          <v-card-subtitle class="text-center pb-4">
            {{ selectedBatch?.type || 'Orientation Training' }}
          </v-card-subtitle>

          <v-divider class="mx-4 mb-4"></v-divider>

          <v-card-text>
            <h3 class="text-h6 font-weight-bold mb-4">List of Participants</h3>
            <v-list density="compact">
              <v-list-item
                v-for="(participant, index) in currentParticipants"
                :key="index"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-icon size="8" class="mr-3">mdi-circle</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ participant }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="#8B1538"
              size="large"
              rounded="pill"
              class="px-8"
              elevation="2"
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Training {
  id: number;
  batch: string;
  type: string;
  date: Date;
  color: string;
}

interface CalendarCell {
  day: number | null;
  training: Training | null;
}

// State
const selectedTraining = ref('All Trainings');
const selectedMonth = ref('June 2025');
const selectedTrainer = ref('All Trainers');
const selectedBatch = ref<Training | null>(null);
const currentDate = ref(new Date(2025, 5, 1)); // June 2025

// Data
const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const trainingTypes = [
  'All Trainings',
  'Orientation Training',
  'Official Deployment'
];

const months = [
  'January 2025', 'February 2025', 'March 2025', 'April 2025',
  'May 2025', 'June 2025', 'July 2025', 'August 2025',
  'September 2025', 'October 2025', 'November 2025', 'December 2025'
];

const trainers = ['All Trainers', 'John Smith', 'Jane Doe', 'Mike Johnson'];

const trainings = ref<Training[]>([
  {
    id: 1,
    batch: 'Batch 18',
    type: 'Orientation Training',
    date: new Date(2025, 5, 15),
    color: '#C47A7A'
  },
  {
    id: 2,
    batch: 'Batch 19',
    type: 'Orientation Training',
    date: new Date(2025, 5, 19),
    color: '#C47A7A'
  },
  {
    id: 3,
    batch: 'Batch 18',
    type: 'Official Deployment',
    date: new Date(2025, 5, 22),
    color: '#C47A7A'
  },
  {
    id: 4,
    batch: 'Batch 19',
    type: 'Official Deployment',
    date: new Date(2025, 5, 26),
    color: '#C47A7A'
  }
]);

const participants: Record<string, string[]> = {
  'Batch 18': [
    'Juan Dela Cruz',
    'Jessica Sanchez',
    'Jade M',
    'Carlo A',
    'Jelle Z',
    'MJ DC',
    'Aira C'
  ],
  'Batch 19': [
    'Maria Santos',
    'Pedro Reyes',
    'Ana Lopez',
    'Miguel Torres',
    'Rosa Martinez',
    'Carlos Ramos'
  ]
};

// Computed
const currentMonthYear = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  return currentDate.value.toLocaleDateString('en-US', options);
});

const calendarCells = computed((): CalendarCell[] => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Adjust for Monday start (getDay() returns 0 for Sunday)
  let startingDayOfWeek = firstDay.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;
  
  const cells: CalendarCell[] = [];
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    cells.push({ day: null, training: null });
  }
  
  // Days with potential trainings
  for (let day = 1; day <= daysInMonth; day++) {
    const training = trainings.value.find(t => 
      t.date.getDate() === day &&
      t.date.getMonth() === month &&
      t.date.getFullYear() === year
    );
    cells.push({ day, training: training || null });
  }
  
  // Fill remaining cells to complete the grid
  const totalCells = Math.ceil(cells.length / 7) * 7;
  while (cells.length < totalCells) {
    cells.push({ day: null, training: null });
  }
  
  return cells;
});

const currentParticipants = computed(() => {
  const batch = selectedBatch.value?.batch || 'Batch 18';
  return participants[batch] || [];
});

const cellStyle = computed(() => ({
  border: '2px solid #8B1538',
  minHeight: '120px',
  backgroundColor: 'white'
}));

// Methods
const changeMonth = (direction: number) => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + direction);
  currentDate.value = newDate;
  selectedMonth.value = currentMonthYear.value;
};

const selectBatch = (training: Training) => {
  selectedBatch.value = training;
};

// Initialize with Batch 18
selectedBatch.value = trainings.value[0];
</script>

<style scoped>
.training-calendar {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}

.calendar-header {
  background-color: white;
  font-size: 1rem;
}

.calendar-cell {
  position: relative;
  background-color: white;
}

.training-event {
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.training-event:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.participants-card {
  border: 2px solid #e0e0e0;
  height: 100%;
}

.v-list-item {
  min-height: 32px !important;
}
</style>