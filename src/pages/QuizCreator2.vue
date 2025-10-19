<template>
  <v-container fluid class="pa-6 bg-grey-lighten-3">
    <!-- Quiz Header Card -->
    <v-card class="mb-4" elevation="1" rounded="lg">
      <div class="header-accent"></div>
      <v-card-text class="pa-4">
        <v-text-field
          v-model="quiz.title"
          placeholder="Untitled Form"
          variant="plain"
          class="title-input mb-2 pa-0"
          density="comfortable"
          hide-details
        />
        <v-text-field
          v-model="quiz.description"
          placeholder="Form Description"
          variant="plain"
          class=""
          density="comfortable"
        />
      </v-card-text>
    </v-card>

    <!-- Questions -->
    <template v-for="(question, index) in quiz.questions" :key="question.id">
      <v-card class="mb-4" elevation="1" rounded="lg">
        <v-card-text class="pa-6">
          <!-- Question Header -->
          <v-row align="center" no-gutters class="">
            <v-col>
              <v-text-field
                v-model="question.text"
                placeholder="Untitled Question"
                variant="plain"
                class="text-h6 question-input"
                density="comfortable"
                hide-details
              />
            </v-col>
            
            <v-col cols="auto" class="d-flex">
              <v-btn icon variant="text" class="mr-2">
                <v-icon>mdi-image-outline</v-icon>
              </v-btn>
               <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :value="getQuestionLabel(question.type)"
                      variant="outlined"
                      readonly
                      density="comfortable"
                      hide-details
                      min-width="220"
                      :prepend-inner-icon="getQuestionIcon(question.type)"
                      />
                  </template>
                  <v-list density="compact" class="py-2">
                    <v-list-item 
                      v-for="type in questionTypes" 
                      :key="type.value"
                      @click="question.type = type.value"
                      class="px-4"
                      :class="{ 'bg-grey-lighten-2': question.type === type.value }"
                    >
                      <template v-slot:prepend>
                        <v-icon size="20" class="mr-3">{{ type.icon }}</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">{{ type.label }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

            </v-col>
          </v-row>

          <!-- Multiple Choice / Checkbox / Dropdown Options -->
          <div v-if="['multiple-choice', 'checkbox', 'dropdown'].includes(question.type)">
            <v-row
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              align="center"
              no-gutters
              class="mt-2"
            >
              <v-col cols="auto" class="mr-3">
                <v-radio
                  v-if="question.type === 'multiple-choice'"
                  :model-value="question.correctAnswer"
                  :value="optIndex"
                  color="grey"
                  readonly
                />
                <v-checkbox
                  v-else-if="question.type === 'checkbox'"
                  :model-value="question.correctAnswers?.includes(optIndex)"
                  color="grey"
                  readonly 
                  hide-details
                />
                <span v-else class="text-grey ml-2">{{ optIndex + 1 }}.</span>
              </v-col>
              
              <v-col>
                <v-text-field
                  v-model="option.text"
                  :placeholder="`Option ${optIndex + 1}`"
                  variant="plain"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <v-col cols="auto">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="removeOption(question, optIndex)"
                >
                  <v-icon size="small">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Add Option Row -->
            <v-row align="center" no-gutters class="mt-2">
              <v-col cols="auto" class="mr-3">
                <v-radio v-if="question.type === 'multiple-choice'" color="grey" readonly />
                <v-checkbox v-else-if="question.type === 'checkbox'" color="grey" readonly hide-details />
                <span v-else class="text-grey ml-2">{{ (question.options?.length || 0) + 1 }}.</span>
              </v-col>
              
              <v-col>
                <v-btn
                  variant="text"
                  class="text-none"
                  color="grey-darken-1"
                  @click="addOption(question)"
                >
                  Add option or Add <span class="text-primary">"Other"</span>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Short Answer -->
          <div v-else-if="question.type === 'short-answer'">
            <v-text-field
              placeholder="Short answer text"
              variant="plain"
              disabled
              class="text-body-2 mt-4"
            >
              <template #prepend>
                <v-divider class="border-opacity-50" style="width: 200px" />
              </template>
            </v-text-field>
          </div>

          <!-- Long Answer -->
          <div v-else-if="question.type === 'long-answer'">
            <v-textarea
              placeholder="Long answer text"
              variant="outlined"
              disabled
              class="text-body-2 mt-4"
              rows="3"
            />
          </div>

          <!-- File Upload -->
          <div v-else-if="question.type === 'file-upload'" class="mt-4">
            <v-chip color="grey-lighten-2" prepend-icon="mdi-cloud-upload">
              File upload
            </v-chip>
          </div>

          <!-- Linear Scale -->
          <div v-else-if="question.type === 'linear-scale'" class="mt-4">
            <v-row align="center">
              <v-col cols="auto">
                <v-text-field
                  v-model.number="question.scaleMin"
                  type="number"
                  label="Min"
                  variant="outlined"
                  density="compact"
                  style="width: 100px"
                  hide-details
                />
              </v-col>
              <v-col class="text-center">
                <span class="text-grey">to</span>
              </v-col>
              <v-col cols="auto">
                <v-text-field
                  v-model.number="question.scaleMax"
                  type="number"
                  label="Max"
                  variant="outlined"
                  density="compact"
                  style="width: 100px"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="6">
                <v-text-field
                  v-model="question.scaleMinLabel"
                  label="Label (optional)"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="question.scaleMaxLabel"
                  label="Label (optional)"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </div>

          <!-- Rating -->
          <div v-else-if="question.type === 'rating'" class="mt-4">
            <div class="d-flex align-center">
              <v-icon 
                v-for="i in (question.ratingMax || 5)" 
                :key="i" 
                class="mx-1" 
                color="grey-lighten-1"
              >
                mdi-star-outline
              </v-icon>
            </div>
            <v-text-field
              v-model.number="question.ratingMax"
              label="Number of stars"
              type="number"
              variant="outlined"
              density="compact"
              style="width: 150px"
              class="mt-2"
              hide-details
            />
          </div>

          <!-- Multiple Choice Grid -->
          <div v-else-if="question.type === 'multiple-choice-grid'" class="mt-4">
            <div class="mb-3">
              <p class="text-body-2 font-weight-medium mb-2">Rows</p>
              <v-chip 
                v-for="(row, idx) in question.gridRows" 
                :key="`row-${idx}`"
                closable
                class="ma-1"
                @click:close="removeGridRow(question, idx)"
              >
                {{ row }}
              </v-chip>
              <v-btn 
                variant="text" 
                size="small" 
                class="text-none"
                @click="addGridRow(question)"
              >
                Add row
              </v-btn>
            </div>
            <div>
              <p class="text-body-2 font-weight-medium mb-2">Columns</p>
              <v-chip 
                v-for="(col, idx) in question.gridColumns" 
                :key="`col-${idx}`"
                closable
                class="ma-1"
                @click:close="removeGridColumn(question, idx)"
              >
                {{ col }}
              </v-chip>
              <v-btn 
                variant="text" 
                size="small" 
                class="text-none"
                @click="addGridColumn(question)"
              >
                Add column
              </v-btn>
            </div>
          </div>

          <!-- Checkbox Grid -->
          <div v-else-if="question.type === 'checkbox-grid'" class="mt-4">
            <div class="mb-3">
              <p class="text-body-2 font-weight-medium mb-2">Rows</p>
              <v-chip 
                v-for="(row, idx) in question.gridRows" 
                :key="`row-${idx}`"
                closable
                class="ma-1"
                @click:close="removeGridRow(question, idx)"
              >
                {{ row }}
              </v-chip>
              <v-btn 
                variant="text" 
                size="small" 
                class="text-none"
                @click="addGridRow(question)"
              >
                Add row
              </v-btn>
            </div>
            <div>
              <p class="text-body-2 font-weight-medium mb-2">Columns</p>
              <v-chip 
                v-for="(col, idx) in question.gridColumns" 
                :key="`col-${idx}`"
                closable
                class="ma-1"
                @click:close="removeGridColumn(question, idx)"
              >
                {{ col }}
              </v-chip>
              <v-btn 
                variant="text" 
                size="small" 
                class="text-none"
                @click="addGridColumn(question)"
              >
                Add column
              </v-btn>
            </div>
          </div>

          <!-- Date -->
          <div v-else-if="question.type === 'date'" class="mt-4">
            <v-text-field
              placeholder="MM/DD/YYYY"
              variant="outlined"
              disabled
              prepend-inner-icon="mdi-calendar"
              density="comfortable"
            />
          </div>

          <!-- Time -->
          <div v-else-if="question.type === 'time'" class="mt-4">
            <v-text-field
              placeholder="HH:MM"
              variant="outlined"
              disabled
              prepend-inner-icon="mdi-clock-outline"
              density="comfortable"
            />
          </div>

          <!-- Question Footer -->
          <v-divider class="my-4 border-opacity-25" />
          
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-btn
                icon
                variant="text"
                size="small"
                color="primary"
                @click="toggleAnswerKey(question)"
              >
                <v-icon>{{ question.showAnswerKey ? 'mdi-check-circle' : 'mdi-check-circle-outline' }}</v-icon>
              </v-btn>
              <span class="text-body-2 ml-2">
                <span :class="question.showAnswerKey ? 'text-primary' : 'text-grey'">
                  Answer Key
                </span>
                <span class="text-grey ml-1">({{ question.points || 0 }} Points)</span>
              </span>
            </v-col>

            <v-spacer />

            <v-col cols="auto" class="d-flex align-center">
              <v-btn
                icon 
                variant="text"
                @click="duplicateQuestion(index)"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              
              <v-btn
                icon 
                variant="text"
                @click="deleteQuestion(index)"
              >
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>

              <v-divider vertical class="mx-2" />
              
              <v-switch
                v-model="question.required"
                color="primary"
                hide-details
                inset
                density="compact"
              />
              <span 
                class="text-body-2 mx-2" 
                :class="question.required ? 'text-primary' : 'text-grey'"
              >
                Required
              </span>
            </v-col>
          </v-row>

          <!-- Answer Key Section (Expandable) -->
          <v-expand-transition>
            <div v-if="question.showAnswerKey" class="mt-4 pt-4" style="border-top: 1px solid #e0e0e0">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="question.points"
                    label="Points"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </v-col>
              </v-row>

              <!-- Correct Answer Selection for Multiple Choice -->
              <div v-if="question.type === 'multiple-choice'" class="mt-4">
                <p class="text-body-2 text-grey-darken-1 mb-2">Select correct answer:</p>
                <v-radio-group v-model="question.correctAnswer" hide-details>
                  <v-radio
                    v-for="(option, optIndex) in question.options"
                    :key="optIndex"
                    :label="option.text"
                    :value="optIndex"
                    color="success"
                  />
                </v-radio-group>
              </div>

              <!-- Correct Answers Selection for Checkbox -->
              <div v-if="question.type === 'checkbox'" class="mt-4">
                <p class="text-body-2 text-grey-darken-1 mb-2">Select correct answers:</p>
                <v-checkbox
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  :label="option.text"
                  :model-value="question.correctAnswers?.includes(optIndex)"
                  color="success"
                  hide-details
                  @click="toggleCorrectAnswer(question, optIndex)"
                />
              </div>

              <!-- Correct Answer for Short Answer -->
              <div v-if="question.type === 'short-answer'" class="mt-4">
                <v-text-field
                  v-model="question.correctAnswer"
                  label="Correct Answer"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </div>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </template>

    <!-- Add Question Button -->
    <v-card class="mb-4" elevation="1" rounded="lg">
      <v-card-text class="pa-4">
        <v-btn
          block
          variant="text"
          size="large"
          class="text-none"
          @click="addQuestion"
        >
          <v-icon class="mr-2">mdi-plus-circle-outline</v-icon>
          Add Question
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface QuizOption {
  text: string
}

interface Question {
  id: string
  text: string
  type: string
  // type?: 'multiple-choice' | 'checkbox' | 'short-answer' | 'long-answer' | 'dropdown' | 'file-upload' | 'linear-scale' | 'rating' | 'multiple-choice-grid' | 'checkbox-grid' | 'date' | 'time'
  options?: QuizOption[]
  correctAnswer?: number | string
  correctAnswers?: number[]
  points: number
  required: boolean
  showAnswerKey: boolean
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  ratingMax?: number
  gridRows?: string[]
  gridColumns?: string[]
}

interface Quiz {
  title: string
  description: string
  questions: Question[]
}

const questionTypes = [
  { label: 'Short Answer', value: 'short-answer', icon: 'mdi-text-short' },
  { label: 'Paragraph', value: 'long-answer', icon: 'mdi-text-long' },
  { label: 'Multiple Choice', value: 'multiple-choice', icon: 'mdi-radiobox-marked' },
  { label: 'Checkboxes', value: 'checkbox', icon: 'mdi-checkbox-marked' },
  { label: 'Dropdown', value: 'dropdown', icon: 'mdi-arrow-down-drop-circle-outline' },
  { label: 'File Upload', value: 'file-upload', icon: 'mdi-cloud-upload-outline' },
  { label: 'Linear Scale', value: 'linear-scale', icon: 'mdi-ray-start-arrow' },
  { label: 'Rating', value: 'rating', icon: 'mdi-star-outline' },
  { label: 'Multiple Choice Grid', value: 'multiple-choice-grid', icon: 'mdi-table-large' },
  { label: 'Checkbox Grid', value: 'checkbox-grid', icon: 'mdi-table-large' },
  { label: 'Date', value: 'date', icon: 'mdi-calendar' },
  { label: 'Time', value: 'time', icon: 'mdi-clock-outline' }
]


const quiz = reactive<Quiz>({
  title: 'Untitled Form',
  description: '',
  questions: []
})

const getQuestionLabel = (type: any) => {
  return questionTypes.find((q) => q.value === type)?.label
}
const getQuestionIcon = (type: any) => {
  return questionTypes.find((q) => q.value === type)?.icon
}

const selectQuestionType = (type: string) => {
  console.log('Selected question type:', type);
};


const addQuestion = () => {
  const newQuestion: Question = {
    id: `q-${Date.now()}`,
    text: '',
    type: 'multiple-choice',
    options: [{ text: 'Option 1' }],
    correctAnswer: undefined,
    points: 0,
    required: false,
    showAnswerKey: false,
    scaleMin: 1,
    scaleMax: 5,
    ratingMax: 5,
    gridRows: ['Row 1'],
    gridColumns: ['Column 1']
  }
  quiz.questions.push(newQuestion)
}

const deleteQuestion = (index: number) => {
  quiz.questions.splice(index, 1)
}

const duplicateQuestion = (index: number) => {
  const original = quiz.questions[index]
  const duplicate = JSON.parse(JSON.stringify(original))
  duplicate.id = `q-${Date.now()}`
  quiz.questions.splice(index + 1, 0, duplicate)
}

const addOption = (question: Question) => {
  if (!question.options) question.options = []
  question.options.push({ text: `Option ${question.options.length + 1}` })
}

const removeOption = (question: Question, index: number) => {
  if (question.options && question.options.length > 1) {
    question.options.splice(index, 1)
  }
}

const toggleCorrectAnswer = (question: Question, index: number) => {
  if (!question.correctAnswers) question.correctAnswers = []
  const idx = question.correctAnswers.indexOf(index)
  if (idx > -1) {
    question.correctAnswers.splice(idx, 1)
  } else {
    question.correctAnswers.push(index)
  }
}

const toggleAnswerKey = (question: Question) => {
  question.showAnswerKey = !question.showAnswerKey
}

const addGridRow = (question: Question) => {
  if (!question.gridRows) question.gridRows = []
  question.gridRows.push(`Row ${question.gridRows.length + 1}`)
}

const removeGridRow = (question: Question, index: number) => {
  if (question.gridRows && question.gridRows.length > 1) {
    question.gridRows.splice(index, 1)
  }
}

const addGridColumn = (question: Question) => {
  if (!question.gridColumns) question.gridColumns = []
  question.gridColumns.push(`Column ${question.gridColumns.length + 1}`)
}

const removeGridColumn = (question: Question, index: number) => {
  if (question.gridColumns && question.gridColumns.length > 1) {
    question.gridColumns.splice(index, 1)
  }
}
</script>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 24px !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #c5c5c5;
}

.question-input :deep(.v-field__input) {
  border-bottom: 1px solid #c5c5c5;
}

.header-accent {
  height: 10px;
  background: linear-gradient(90deg, #673ab7 0%, #512da8 100%);
  border-radius: 8px 8px 0 0;
}

:deep(.v-field--variant-plain) {
  --v-field-padding-start: 0;
}
</style>