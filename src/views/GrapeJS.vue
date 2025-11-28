<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="1">
      <v-toolbar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-email-edit</v-icon>
        Email Template Builder
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn @click="loadTemplate" variant="text" class="mr-2">
        <v-icon start>mdi-folder-open</v-icon>
        Load
      </v-btn>
      
      <v-btn @click="saveTemplate" variant="text" class="mr-2">
        <v-icon start>mdi-content-save</v-icon>
        Save
      </v-btn>
      
      <v-btn @click="exportHTML" variant="text" class="mr-2">
        <v-icon start>mdi-code-tags</v-icon>
        Export HTML
      </v-btn>
      
      <v-btn @click="previewEmail" variant="text" class="mr-2">
        <v-icon start>mdi-eye</v-icon>
        Preview
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text">
            <v-icon start>mdi-cog</v-icon>
            Settings
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="clearCanvas">
            <v-list-item-title>
              <v-icon start>mdi-delete</v-icon>
              Clear Canvas
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="undoAction">
            <v-list-item-title>
              <v-icon start>mdi-undo</v-icon>
              Undo
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="redoAction">
            <v-list-item-title>
              <v-icon start>mdi-redo</v-icon>
              Redo
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="pa-0">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">Loading Email Builder...</p>
      </div>
      
      <!-- GrapeJS Editor Container -->
      <div v-show="!loading" id="gjs"></div>
    </v-main>

    <!-- Preview Dialog -->
    <v-dialog v-model="showPreview" max-width="900px" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center bg-primary">
          <span class="text-white">Email Preview</span>
          <div>
            <v-btn-toggle v-model="previewDevice" mandatory density="compact" class="mr-2">
              <v-btn value="desktop" size="small">
                <v-icon>mdi-monitor</v-icon>
              </v-btn>
              <v-btn value="tablet" size="small">
                <v-icon>mdi-tablet</v-icon>
              </v-btn>
              <v-btn value="mobile" size="small">
                <v-icon>mdi-cellphone</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn icon variant="text" @click="showPreview = false" color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text class="pa-0" style="height: 600px;">
          <div class="preview-container" :class="`device-${previewDevice}`">
            <iframe 
              ref="previewFrame"
              :srcdoc="previewHTML" 
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-text-field
            v-model="testEmail"
            label="Test Email Address"
            placeholder="email@example.com"
            density="compact"
            hide-details
            class="mr-2"
          ></v-text-field>
          <v-btn color="primary" @click="sendTestEmail">
            <v-icon start>mdi-email-send</v-icon>
            Send Test
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Save Template Dialog -->
    <v-dialog v-model="showSaveDialog" max-width="600px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          Save Email Template
        </v-card-title>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="templateName"
            label="Template Name *"
            placeholder="e.g., Welcome Email, Weekly Newsletter"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Template name is required']"
          ></v-text-field>
          
          <v-select
            v-model="templateCategory"
            label="Category"
            :items="categories"
            variant="outlined"
            density="comfortable"
          ></v-select>
          
          <v-textarea
            v-model="templateDescription"
            label="Description"
            placeholder="Describe the purpose of this template"
            variant="outlined"
            density="comfortable"
            rows="3"
          ></v-textarea>

          <v-text-field
            v-model="templateSubject"
            label="Email Subject"
            placeholder="e.g., Welcome to {{company_name}}!"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showSaveDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSave" :disabled="!templateName">
            Save Template
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Load Template Dialog -->
    <v-dialog v-model="showLoadDialog" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="bg-primary text-white">
          Load Email Template
        </v-card-title>
        <v-card-text style="height: 500px;">
          <v-text-field
            v-model="searchQuery"
            label="Search templates"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="my-4"
            hide-details
          ></v-text-field>

          <v-row>
            <v-col 
              v-for="template in filteredTemplates" 
              :key="template.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card 
                @click="selectTemplate(template)"
                hover
                class="template-card"
              >
                <div class="template-thumbnail">
                  <v-icon size="64" color="grey">mdi-email-outline</v-icon>
                </div>
                <v-card-title class="text-body-2">
                  {{ template.name }}
                </v-card-title>
                <v-card-subtitle class="text-caption">
                  {{ template.category }}
                </v-card-subtitle>
                <v-card-text class="text-caption">
                  {{ template.description }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showLoadDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

// GrapeJS Editor instance
let editor: any = null;

// Component state
const loading = ref(true);
const showPreview = ref(false);
const showSaveDialog = ref(false);
const showLoadDialog = ref(false);
const previewHTML = ref('');
const previewDevice = ref('desktop');
const templateName = ref('');
const templateCategory = ref('General');
const templateDescription = ref('');
const templateSubject = ref('');
const testEmail = ref('');
const searchQuery = ref('');
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const categories = [
  'General',
  'Welcome',
  'Newsletter',
  'Announcement',
  'Notification',
  'Marketing',
  'Transactional'
];

// Mock saved templates (replace with API call)
const savedTemplates = ref([
  {
    id: '1',
    name: 'Welcome Email',
    category: 'Welcome',
    description: 'Welcome new users to the platform',
    html: '',
    css: '',
    components: null
  },
  {
    id: '2',
    name: 'Weekly Newsletter',
    category: 'Newsletter',
    description: 'Weekly updates and news',
    html: '',
    css: '',
    components: null
  },
  {
    id: '3',
    name: 'Product Launch',
    category: 'Marketing',
    description: 'Announce new products',
    html: '',
    css: '',
    components: null
  }
]);

const filteredTemplates = computed(() => {
  if (!searchQuery.value) return savedTemplates.value;
  
  const query = searchQuery.value.toLowerCase();
  return savedTemplates.value.filter(t => 
    t.name.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query)
  );
});

// Load script helper
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
};

// Load CSS helper
const loadCSS = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(link);
  });
};

// Load GrapeJS via CDN
const loadGrapeJSScripts = async (): Promise<void> => {
  try {
    // Load CSS first
    await Promise.all([
      loadCSS('https://unpkg.com/grapesjs/dist/css/grapes.min.css'),
      loadCSS('https://unpkg.com/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css')
    ]);

    // Then load scripts
    await loadScript('https://unpkg.com/grapesjs');
    await loadScript('https://unpkg.com/grapesjs-preset-newsletter');
  } catch (error) {
    throw new Error('Failed to load GrapeJS resources');
  }
};

// Initialize GrapeJS Editor
const initializeEditor = () => {
  const grapesjs = (window as any).grapesjs;

  editor = grapesjs.init({
    container: '#gjs',
    height: 'calc(100vh - 64px)',
    width: 'auto',
    plugins: ['gjs-preset-newsletter'],
    pluginsOpts: {
      'gjs-preset-newsletter': {
        modalTitleImport: 'Import template',
        modalLabelImport: 'Paste your HTML/CSS here',
        modalLabelExport: 'Copy the code below',
        codeViewerTheme: 'hopscotch',
        importPlaceholder: '<table><tr><td>Your HTML here</td></tr></table>',
        cellStyle: {
          'font-size': '14px',
          'font-weight': 300,
          'vertical-align': 'top',
          color: 'rgb(111, 119, 125)',
          margin: 0,
          padding: 0,
        }
      }
    },
    storageManager: {
      type: 'local',
      autosave: true,
      autoload: false,
      stepsBeforeSave: 1,
    },
    assetManager: {
      upload: false,
      uploadText: 'Drop files here or click to upload',
    },
    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Circular+Std:wght@300;400;500;600;700&display=swap'
      ]
    },
    deviceManager: {
      devices: [
        {
          name: 'Desktop',
          width: '',
        },
        {
          name: 'Tablet',
          width: '768px',
          widthMedia: '768px',
        },
        {
          name: 'Mobile',
          width: '320px',
          widthMedia: '480px',
        }
      ]
    }
  });

  // Add device commands
  editor.Commands.add('set-device-desktop', {
    run: (ed: any) => ed.setDevice('Desktop')
  });
  editor.Commands.add('set-device-tablet', {
    run: (ed: any) => ed.setDevice('Tablet')
  });
  editor.Commands.add('set-device-mobile', {
    run: (ed: any) => ed.setDevice('Mobile')
  });

  // Load initial template
  loadInitialTemplate();
  
  loading.value = false;
};

// Load initial welcome template
const loadInitialTemplate = () => {
  const initialHTML = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; font-family: 'Circular Std', Arial, sans-serif;">
      <tr>
        <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #8B1538 0%, #B91C43 100%);">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 500;">Welcome to PMCIE!</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px;">
          <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Start Building Your Email</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #666666; margin-bottom: 20px;">
            Use the blocks on the left to drag and drop elements into your email template.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #666666; margin-bottom: 30px;">
            You can add text, images, buttons, dividers, and more!
          </p>
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td style="background: #8B1538; padding: 15px 30px; border-radius: 5px; text-align: center;">
                <a href="#" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500;">Get Started</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; text-align: center; background: #f8f8f8; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 14px; color: #999999; margin: 0 0 10px 0;">
            Power Mac Center Inc. - Institute for Excellence
          </p>
          <p style="font-size: 12px; color: #999999; margin: 0;">
            © 2025 PMCIE. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  `;

  editor.setComponents(initialHTML);
};

// Save template
const saveTemplate = () => {
  showSaveDialog.value = true;
};

// Confirm save
const confirmSave = () => {
  const html = editor.getHtml();
  const css = editor.getCss();
  const components = editor.getComponents();

  const templateData = {
    id: Date.now().toString(),
    name: templateName.value,
    category: templateCategory.value,
    description: templateDescription.value,
    subject: templateSubject.value,
    html: html,
    css: css,
    components: JSON.stringify(components),
    createdAt: new Date().toISOString()
  };

  console.log('Saving template:', templateData);

  // TODO: Call your API here
  // await fetch('/api/email-templates', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(templateData)
  // });

  savedTemplates.value.push(templateData);
  
  showSaveDialog.value = false;
  showSnackbar('Template saved successfully!', 'success');
  
  // Reset form
  templateName.value = '';
  templateCategory.value = 'General';
  templateDescription.value = '';
  templateSubject.value = '';
};

// Load template
const loadTemplate = () => {
  showLoadDialog.value = true;
};

// Select template
const selectTemplate = (template: any) => {
  if (template.components) {
    try {
      editor.setComponents(JSON.parse(template.components));
    } catch (e) {
      editor.setComponents(template.html);
    }
  } else if (template.html) {
    editor.setComponents(template.html);
  }
  
  if (template.css) {
    editor.setStyle(template.css);
  }
  
  showLoadDialog.value = false;
  showSnackbar(`Template "${template.name}" loaded successfully!`, 'success');
};

// Export HTML
const exportHTML = () => {
  const html = editor.getHtml();
  const css = editor.getCss();
  
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email Template</title>
  <style>
    ${css}
    body {
      margin: 0;
      padding: 0;
      font-family: 'Circular Std', Arial, sans-serif;
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `email-template-${Date.now()}.html`;
  link.click();
  URL.revokeObjectURL(url);
  
  showSnackbar('HTML exported successfully!', 'success');
};

// Preview email
const previewEmail = () => {
  const html = editor.getHtml();
  const css = editor.getCss();
  
  previewHTML.value = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${css}
    body {
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      font-family: 'Circular Std', Arial, sans-serif;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  
  showPreview.value = true;
};

// Send test email
const sendTestEmail = () => {
  if (!testEmail.value) {
    showSnackbar('Please enter an email address', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(testEmail.value)) {
    showSnackbar('Please enter a valid email address', 'error');
    return;
  }

  console.log('Sending test email to:', testEmail.value);
  console.log('HTML:', previewHTML.value);

  // TODO: Call your backend API
  // await fetch('/api/email-templates/send-test', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     recipient: testEmail.value,
  //     subject: templateSubject.value || 'Test Email',
  //     html: previewHTML.value
  //   })
  // });

  showSnackbar(`Test email sent to ${testEmail.value}!`, 'success');
};

// Clear canvas
const clearCanvas = () => {
  if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
    editor.setComponents('');
    editor.setStyle('');
    showSnackbar('Canvas cleared', 'info');
  }
};

// Undo action
const undoAction = () => {
  editor.UndoManager.undo();
};

// Redo action
const redoAction = () => {
  editor.UndoManager.redo();
};

// Show snackbar
const showSnackbar = (message: string, color: string = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await loadGrapeJSScripts();
    // Small delay to ensure CSS is loaded
    setTimeout(() => {
      initializeEditor();
    }, 100);
  } catch (error) {
    console.error('Failed to initialize email editor:', error);
    showSnackbar('Failed to load email editor. Please refresh the page.', 'error');
    loading.value = false;
  }
});

onUnmounted(() => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  background: #f5f5f5;
}

#gjs {
  border: none;
  background: #f5f5f5;
}

.preview-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
  transition: all 0.3s ease;
}

.preview-container.device-desktop iframe {
  max-width: 100%;
}

.preview-container.device-tablet iframe {
  max-width: 768px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preview-container.device-mobile iframe {
  max-width: 375px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.template-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.template-thumbnail {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

/* Override GrapeJS default styles */
:deep(.gjs-cv-canvas) {
  background: #f5f5f5;
}

:deep(.gjs-frame) {
  border: none;
}

:deep(.gjs-frame-wrapper) {
  background: #ffffff;
}
</style>