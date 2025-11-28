<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Email Template Builder</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="saveTemplate" variant="text">
        <v-icon start>mdi-content-save</v-icon>
        Save Template
      </v-btn>
      <v-btn @click="exportHTML" variant="text">
        <v-icon start>mdi-code-tags</v-icon>
        Export HTML
      </v-btn>
      <v-btn @click="previewEmail" variant="text">
        <v-icon start>mdi-eye</v-icon>
        Preview
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-0">
        <!-- Email Builder Container -->
        <div id="email-builder" style="height: calc(100vh - 64px);"></div>
      </v-container>
    </v-main>

    <!-- Preview Dialog -->
    <v-dialog v-model="showPreview" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Email Preview</span>
          <v-btn icon variant="text" @click="showPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-html="previewHTML" style="border: 1px solid #ddd; padding: 20px;"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="sendTestEmail">
            <v-icon start>mdi-email-send</v-icon>
            Send Test Email
          </v-btn>
          <v-btn @click="showPreview = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Save Template Dialog -->
    <v-dialog v-model="showSaveDialog" max-width="500px">
      <v-card>
        <v-card-title>Save Email Template</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="templateName"
            label="Template Name"
            placeholder="e.g., Welcome Email, Newsletter"
            variant="outlined"
          ></v-text-field>
          <v-textarea
            v-model="templateDescription"
            label="Description (Optional)"
            placeholder="Describe the purpose of this template"
            variant="outlined"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showSaveDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Unlayer Email Editor instance
let emailEditor: any = null;

// Component state
const showPreview = ref(false);
const showSaveDialog = ref(false);
const previewHTML = ref('');
const templateName = ref('');
const templateDescription = ref('');
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// Load Unlayer script
const loadUnlayerScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).unlayer) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://editor.unlayer.com/embed.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Unlayer'));
    document.head.appendChild(script);
  });
};

// Initialize Email Editor
const initializeEditor = () => {
  const unlayer = (window as any).unlayer;
  
  emailEditor = unlayer.createEditor({
    id: 'email-builder',
    projectId: 1234, // Replace with your project ID if you have one
    displayMode: 'email',
    appearance: {
      theme: 'light',
      panels: {
        tools: {
          dock: 'left'
        }
      }
    },
    tools: {
      image: {
        enabled: true
      },
      button: {
        enabled: true
      },
      divider: {
        enabled: true
      },
      text: {
        enabled: true
      },
      heading: {
        enabled: true
      }
    },
    mergeTags: {
      first_name: {
        name: 'First Name',
        value: '{{first_name}}'
      },
      last_name: {
        name: 'Last Name',
        value: '{{last_name}}'
      },
      email: {
        name: 'Email',
        value: '{{email}}'
      },
      company: {
        name: 'Company',
        value: '{{company}}'
      }
    }
  });

  // Load a sample template (optional)
  loadSampleTemplate();
};

// Load sample template
const loadSampleTemplate = () => {
  const sampleTemplate = {
    body: {
      rows: [
        {
          cells: [1],
          columns: [
            {
              contents: [
                {
                  type: 'text',
                  values: {
                    text: '<h1 style="text-align: center;">Welcome to PMCIE!</h1>'
                  }
                }
              ]
            }
          ]
        },
        {
          cells: [1],
          columns: [
            {
              contents: [
                {
                  type: 'text',
                  values: {
                    text: '<p>Start designing your email template by dragging and dropping elements from the left panel.</p>'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  };

  emailEditor.loadDesign(sampleTemplate);
};

// Save template
const saveTemplate = () => {
  showSaveDialog.value = true;
};

// Confirm save
const confirmSave = () => {
  emailEditor.exportHtml((data: any) => {
    const { design, html } = data;
    
    // Here you would save to your backend
    const templateData = {
      name: templateName.value,
      description: templateDescription.value,
      design: design, // Save this to load later
      html: html,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving template:', templateData);
    
    // Simulate API call
    setTimeout(() => {
      showSaveDialog.value = false;
      showSnackbar('Template saved successfully!', 'success');
      templateName.value = '';
      templateDescription.value = '';
    }, 500);
  });
};

// Export HTML
const exportHTML = () => {
  emailEditor.exportHtml((data: any) => {
    const { html } = data;
    
    // Create download link
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'email-template.html';
    link.click();
    URL.revokeObjectURL(url);
    
    showSnackbar('HTML exported successfully!', 'success');
  });
};

// Preview email
const previewEmail = () => {
  emailEditor.exportHtml((data: any) => {
    const { html } = data;
    previewHTML.value = html;
    showPreview.value = true;
  });
};

// Send test email
const sendTestEmail = () => {
  // Here you would call your backend API to send test email
  console.log('Sending test email with HTML:', previewHTML.value);
  
  showSnackbar('Test email sent!', 'success');
  showPreview.value = false;
};

// Show snackbar
const showSnackbar = (message: string, color: string = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

// Load existing template (for editing)
const loadExistingTemplate = (design: any) => {
  if (emailEditor) {
    emailEditor.loadDesign(design);
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await loadUnlayerScript();
    initializeEditor();
  } catch (error) {
    console.error('Failed to initialize email editor:', error);
    showSnackbar('Failed to load email editor', 'error');
  }
});

onUnmounted(() => {
  // Cleanup
  if (emailEditor) {
    emailEditor = null;
  }
});

// Expose methods for parent component
defineExpose({
  loadExistingTemplate
});
</script>

<style scoped>
#email-builder {
  width: 100%;
}

:deep(.v-toolbar-title) {
  font-family: 'Circular Std', sans-serif;
}
</style>