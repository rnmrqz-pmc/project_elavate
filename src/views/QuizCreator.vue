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
    <!-- <draggable
      v-model="quiz.questions"
      item-key="id"
      handle=".drag-handle"
      :animation="200"
    > -->
      <template v-for="(question,index) in quiz.questions" :key="question.id">
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
                >
                  <!-- <template #prepend>
                    <v-icon 
                      class="drag-handle mr-2" 
                      style="cursor: move"
                      color="grey"
                    >
                      mdi-drag-vertical
                    </v-icon>
                  </template> -->
                </v-text-field>
              </v-col>
              
              <v-col cols="auto" class="d-flex">
                <v-btn icon variant="text"
                  class="mr-2">
                  <v-icon>mdi-image-outline</v-icon>
                </v-btn>
                
                <v-select v-model="question.type"
                  :items="questionTypes"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  style="min-width: 200px"
                >
                  <template #prepend-inner>
                    <v-icon size="small">{{ getQuestionIcon(question.type) }}</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- Multiple Choice / Checkbox Options -->
            <div v-if="question.type === 'multiple-choice' || question.type === 'checkbox'">
              <v-row
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                align="center"
                no-gutters
                class=""
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
                    v-else
                    :model-value="question.correctAnswers?.includes(optIndex)"
                    color="grey"
                    readonly hide-details
                  />
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
              <v-row align="center" no-gutters class="">
                <v-col cols="auto" class="">
                  <v-radio v-if="question.type === 'multiple-choice'" color="grey" readonly />
                  <v-checkbox v-else color="grey" readonly hide-details />
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
                class="text-body-2"
              >
                <template #prepend>
                  <v-divider class="border-opacity-50" style="width: 200px" />
                </template>
              </v-text-field>
            </div>

            <!-- Long Answer -->
            <div v-else-if="question.type === 'long-answer'">
              <v-text-field
                placeholder="Long answer text"
                variant="plain"
                disabled
                class="text-body-2"
              >
                <template #prepend>
                  <v-divider class="border-opacity-50" style="width: 100%" />
                </template>
              </v-text-field>
            </div>

            <!-- Question Footer -->
            <v-divider class="my-1 border-opacity-25" color="primary" />
            
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

              <v-col cols="auto" class="d-flex">
                <v-btn
                  icon variant="text"
                  @click="duplicateQuestion(index)"
                >
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
                
                <v-btn
                  icon variant="text"
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
                />
                <span class="text-body-2 text-grey mx-2 align-self-center" :class="question.required ? 'text-primary' : ''">Required</span>
               
              </v-col>
            </v-row>

            <!-- Answer Key Section (Expandable) -->
            <v-expand-transition>
              <div v-if="question.showAnswerKey" class="mt-1 pt-4" style="border-top: 1px solid #e0e0e0">
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
    <!-- </draggable> -->

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
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Add Question
        </v-btn>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import draggable from 'vuedraggable/src/vuedraggable'

interface QuizOption {
  text: string
}

interface Question {
  id: string
  text: string
  type: 'multiple-choice' | 'checkbox' | 'short-answer' | 'long-answer'
  options?: QuizOption[]
  correctAnswer?: number | string
  correctAnswers?: number[]
  points: number
  required: boolean
  showAnswerKey: boolean
}

interface Quiz {
  title: string
  description: string
  questions: Question[]
}

const questionTypes = [
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'Checkboxes', value: 'checkbox' },
  { label: 'Short Answer', value: 'short-answer' },
  { label: 'Paragraph', value: 'long-answer' }
]

const quiz = reactive<Quiz>({
  title: 'Untitled Form',
  description: '',
  questions: []
})

const getQuestionIcon = (type: string) => {
  const icons: Record<string, string> = {
    'multiple-choice': 'mdi-radiobox-marked',
    'checkbox': 'mdi-checkbox-marked',
    'short-answer': 'mdi-form-textbox',
    'long-answer': 'mdi-text-box-outline'
  }
  return icons[type] || 'mdi-help-circle-outline'
}

const addQuestion = () => {
  const newQuestion: Question = {
    id: `q-${Date.now()}`,
    text: '',
    type: 'multiple-choice',
    options: [{ text: 'Option 1' }],
    correctAnswer: undefined,
    points: 0,
    required: false,
    showAnswerKey: false
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

const saveQuiz = () => {
  console.log('Saving quiz:', quiz)
  alert('Quiz saved successfully!')
}

const previewQuiz = () => {
  console.log('Preview quiz:', quiz)
}

const exportQuiz = () => {
  const dataStr = JSON.stringify(quiz, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${quiz.title.replace(/\s+/g, '-')}.json`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style>
.title-input div div div input{
    font-size: 24px !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #c5c5c5;
}
.question-input div div div input{
    /* font-size: 24px !important; */
    /* font-weight: 600 !important; */
    border-bottom: 1px solid #c5c5c5;
}

.header-accent {
  height: 10px;
  background: linear-gradient(90deg, #673ab7 0%, #512da8 100%);
  border-radius: 8px 8px 0 0;
}

.drag-handle {
  opacity: 0.3;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 0.7;
}

:deep(.v-field--variant-plain) {
  --v-field-padding-start: 0;
}

:deep(.v-input--horizontal .v-input__control) {
  flex-direction: row;
  align-items: center;
}
</style>