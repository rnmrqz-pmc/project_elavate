<template>
  <v-container fluid class="training-participants-page pa-8">
    <h1 class="text-h3 font-weight-bold mb-8" style="color: #8B1538;">
      Training Participants
    </h1>

    <v-card elevation="3" class="participants-card">
      <v-card-text class="pa-6">
        <!-- Filter Row -->
        <v-row class="mb-6" align="center">
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="selectedYear"
              :items="years"
              label="Select Year"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="filterParticipants"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="selectedMonth"
              :items="months"
              label="Select Month"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="filterParticipants"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="selectedBatch"
              :items="batches"
              label="Select batch"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="filterParticipants"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="d-flex justify-end">
            <v-btn
              color="#C75C6F"
              size="large"
              rounded="pill"
              class="px-8"
              elevation="2"
              @click="exportList"
            >
              Export List
            </v-btn>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredParticipants"
          :items-per-page="10"
          class="participants-table"
          hover
        >
          <!-- Names Column -->
          <template v-slot:item.name="{ item }">
            <div class="text-body-1 font-weight-medium" style="color: #5a5a5a;">
              {{ item.name }}
            </div>
          </template>

          <!-- Training Batch Column -->
          <template v-slot:item.batch="{ item }">
            <div class="text-body-1 font-weight-medium text-center" style="color: #5a5a5a;">
              {{ item.batch }}
            </div>
          </template>

          <!-- Email Column -->
          <template v-slot:item.email="{ item }">
            <div class="text-body-1" style="color: #5a5a5a;">
              {{ item.email }}
            </div>
          </template>

          <!-- Status Column -->
          <template v-slot:item.status="{ item }">
            <div class="d-flex justify-center">
              <v-chip
                :color="getStatusColor(item.status)"
                variant="flat"
                size="large"
                class="px-6 font-weight-bold"
                rounded="pill"
              >
                {{ item.status }}
              </v-chip>
            </div>
          </template>

          <!-- Action Column -->
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-center">
              <v-btn
                color="#C75C6F"
                size="large"
                rounded="pill"
                class="px-8"
                elevation="2"
                @click="viewParticipant(item)"
              >
                View
              </v-btn>
            </div>
          </template>

          <!-- Custom header styling -->
          <template v-slot:header="{ props }">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.key"
                class="table-header"
                :class="{ 'text-center': header.align === 'center' }"
              >
                {{ header.title }}
              </th>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- View Participant Dialog -->
    <v-dialog
      v-model="viewDialog"
      max-width="600px"
    >
      <v-card v-if="selectedParticipant">
        <v-card-title class="text-h5 pa-6" style="background-color: #8B1538; color: white;">
          Participant Details
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ selectedParticipant.name }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="detail-item">
                <span class="detail-label">Training Batch:</span>
                <span class="detail-value">{{ selectedParticipant.batch }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ selectedParticipant.email }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <v-chip
                  :color="getStatusColor(selectedParticipant.status)"
                  variant="flat"
                  size="small"
                  class="ml-2"
                >
                  {{ selectedParticipant.status }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="#8B1538"
            variant="flat"
            @click="viewDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, reactive } from 'vue';

interface Participant {
  id: number;
  name: string;
  batch: number;
  email: string;
  status: 'Active' | 'Fallout' | 'Resigned';
  year: number;
  month: string;
}

interface Snackbar {
  show: boolean;
  message: string;
  color: string;
}

// State
const selectedYear = ref<number | null>(null);
const selectedMonth = ref<string | null>(null);
const selectedBatch = ref<number | null>(null);
const viewDialog = ref(false);
const selectedParticipant = ref<Participant | null>(null);

const snackbar = reactive<Snackbar>({
  show: false,
  message: '',
  color: 'success'
});

// Data
const years = [2023, 2024, 2025];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const batches = [12, 15, 18, 19];

const headers = [
  { title: 'Names', key: 'name', align: 'start' as const, sortable: true },
  { title: 'Training Batch', key: 'batch', align: 'center' as const, sortable: true },
  { title: 'Email', key: 'email', align: 'start' as const, sortable: true },
  { title: 'Status', key: 'status', align: 'center' as const, sortable: true },
  { title: 'Action', key: 'action', align: 'center' as const, sortable: false }
];

const participants = ref<Participant[]>([
  {
    id: 1,
    name: 'Juan Dela Cruz',
    batch: 18,
    email: 'juan@gmail.com',
    status: 'Active',
    year: 2025,
    month: 'June'
  },
  {
    id: 2,
    name: 'Jessica Sanchez',
    batch: 18,
    email: 'jess.sac@gmail.com',
    status: 'Fallout',
    year: 2025,
    month: 'June'
  },
  {
    id: 3,
    name: 'Ariel Ob',
    batch: 12,
    email: 'an.o@gmail.com',
    status: 'Active',
    year: 2025,
    month: 'January'
  },
  {
    id: 4,
    name: 'Yna Uy',
    batch: 15,
    email: 'yna.uy@gmail.com',
    status: 'Resigned',
    year: 2025,
    month: 'March'
  },
  {
    id: 5,
    name: 'Rel Rey',
    batch: 15,
    email: 'sy.rys@gmail.com',
    status: 'Fallout',
    year: 2025,
    month: 'March'
  },
  {
    id: 6,
    name: 'Ai Cul',
    batch: 18,
    email: 'ai.ra@gmail.com',
    status: 'Active',
    year: 2025,
    month: 'June'
  },
  {
    id: 7,
    name: 'Maria Santos',
    batch: 19,
    email: 'maria.s@gmail.com',
    status: 'Active',
    year: 2025,
    month: 'July'
  },
  {
    id: 8,
    name: 'Pedro Reyes',
    batch: 19,
    email: 'pedro.r@gmail.com',
    status: 'Active',
    year: 2025,
    month: 'July'
  },
  {
    id: 9,
    name: 'Ana Lopez',
    batch: 12,
    email: 'ana.l@gmail.com',
    status: 'Resigned',
    year: 2025,
    month: 'January'
  },
  {
    id: 10,
    name: 'Carlos Ramos',
    batch: 15,
    email: 'carlos.r@gmail.com',
    status: 'Active',
    year: 2025,
    month: 'March'
  }
]);

// Computed
const filteredParticipants = computed(() => {
  let filtered = [...participants.value];

  if (selectedYear.value) {
    filtered = filtered.filter(p => p.year === selectedYear.value);
  }

  if (selectedMonth.value) {
    filtered = filtered.filter(p => p.month === selectedMonth.value);
  }

  if (selectedBatch.value) {
    filtered = filtered.filter(p => p.batch === selectedBatch.value);
  }

  return filtered;
});

// Methods
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Active': '#6CC24A',
    'Fallout': '#F9A03F',
    'Resigned': '#FF5733'
  };
  return statusColors[status] || 'grey';
};

const viewParticipant = (participant: Participant) => {
  selectedParticipant.value = participant;
  viewDialog.value = true;
};

const filterParticipants = () => {
  // Filter is reactive through computed property
  console.log('Filters applied:', {
    year: selectedYear.value,
    month: selectedMonth.value,
    batch: selectedBatch.value
  });
};

const exportList = () => {
  // Create CSV content
  const csvHeaders = ['Name', 'Training Batch', 'Email', 'Status', 'Year', 'Month'];
  const csvRows = filteredParticipants.value.map(p => [
    p.name,
    p.batch,
    p.email,
    p.status,
    p.year,
    p.month
  ]);

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');

  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `training_participants_${new Date().getTime()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showSnackbar('List exported successfully!', 'success');
};

const showSnackbar = (message: string, color: string) => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};
</script>

<style scoped>
.training-participants-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.participants-card {
  background-color: white;
  border-radius: 8px;
}

.participants-table {
  background-color: white;
}

/* Table header styling */
:deep(.v-data-table-header) {
  background-color: white;
}

.table-header {
  background-color: white !important;
  color: #8B1538 !important;
  font-weight: bold !important;
  font-size: 1.1rem !important;
  padding: 20px 16px !important;
  border-bottom: 2px solid #e0e0e0 !important;
}

/* Table row styling */
:deep(.v-data-table__tr) {
  border-bottom: 1px solid #e0e0e0;
}

:deep(.v-data-table__tr:hover) {
  background-color: #f8f8f8;
}

:deep(.v-data-table__td) {
  padding: 16px !important;
  font-size: 1rem !important;
}

/* Dialog detail styling */
.detail-item {
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: bold;
  color: #5a5a5a;
  min-width: 140px;
}

.detail-value {
  color: #333;
}

/* Status chip styling */
:deep(.v-chip) {
  font-weight: 600 !important;
  letter-spacing: 0.3px;
}

/* Select field styling */
:deep(.v-select .v-field) {
  background-color: white;
}
</style>