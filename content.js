// Content script to handle text selection and display translations
let translationPopup = null;
let selectedText = '';
let isTranslating = false;

// Listen for text selection changes
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);

function handleTextSelection() {
  const selection = window.getSelection();
  const newSelectedText = selection.toString().trim();
  
  // Only process if text is actually selected and different from previous
  if (newSelectedText && newSelectedText !== selectedText && newSelectedText.length > 1) {
    selectedText = newSelectedText;
    
    // Hide any existing popup
    if (translationPopup) {
      hideTranslationPopup();
    }
    
    // Show loading indicator and start translation
    showLoadingPopup(selectedText);
    translateSelectedText(selectedText);
  } else if (!newSelectedText) {
    // Clear selection
    selectedText = '';
    hideTranslationPopup();
  }
}

async function translateSelectedText(text) {
  if (isTranslating) return;
  
  isTranslating = true;
  
  try {
    // Get target language from storage (default to Hindi)
    const result = await chrome.storage.sync.get(['targetLanguage', 'targetLanguageName']);
    const targetLang = result.targetLanguage || 'hi';
    const targetLangName = result.targetLanguageName || 'Hindi';
    
    // Call translation API
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    
    if (!response.ok) {
      throw new Error('Translation service unavailable');
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      const translatedText = data.responseData.translatedText;
      showTranslationPopup(text, translatedText, targetLangName);
    } else {
      throw new Error('Translation failed');
    }
    
  } catch (error) {
    console.error('Translation error:', error);
    showErrorPopup('Translation failed. Please try again.');
  } finally {
    isTranslating = false;
  }
}

function showLoadingPopup(originalText) {
  hideTranslationPopup();
  
  translationPopup = document.createElement('div');
  translationPopup.className = 'translation-popup loading';
  translationPopup.innerHTML = `
    <div class="translation-header">
      <span class="translation-title">🔄 Translating...</span>
      <button class="translation-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="translation-content">
      <div class="original-text">
        <strong>Selected Text:</strong>
        <p>${originalText}</p>
      </div>
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>Converting to Hindi...</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(translationPopup);
  positionPopup();
}

function showTranslationPopup(originalText, translatedText, targetLanguage) {
  hideTranslationPopup();
  
  translationPopup = document.createElement('div');
  translationPopup.className = 'translation-popup';
  translationPopup.innerHTML = `
    <div class="translation-header">
      <span class="translation-title">🌐 Translation</span>
      <button class="translation-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="translation-content">
      <div class="original-text">
        <strong>Original (English):</strong>
        <p>${originalText}</p>
      </div>
      <div class="translated-text">
        <strong>Translated (${targetLanguage}):</strong>
        <p>${translatedText}</p>
      </div>
    </div>
    <div class="translation-actions">
      <button class="copy-btn" onclick="copyToClipboard('${translatedText.replace(/'/g, "\\'")}')">📋 Copy Translation</button>
      <button class="speak-btn" onclick="speakText('${translatedText.replace(/'/g, "\\'")}')">🔊 Listen</button>
    </div>
  `;
  
  document.body.appendChild(translationPopup);
  positionPopup();
  
  // Auto-hide after 15 seconds
  setTimeout(() => {
    hideTranslationPopup();
  }, 15000);
}

function showErrorPopup(message) {
  hideTranslationPopup();
  
  translationPopup = document.createElement('div');
  translationPopup.className = 'translation-popup error';
  translationPopup.innerHTML = `
    <div class="translation-header">
      <span class="translation-title">❌ Error</span>
      <button class="translation-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="translation-content">
      <p>${message}</p>
    </div>
  `;
  
  document.body.appendChild(translationPopup);
  positionPopup();
  
  setTimeout(() => {
    hideTranslationPopup();
  }, 5000);
}

function positionPopup() {
  if (!translationPopup) return;
  
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const popupRect = translationPopup.getBoundingClientRect();
    
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 10;
    
    // Adjust if popup goes off screen
    if (left + popupRect.width > window.innerWidth) {
      left = window.innerWidth - popupRect.width - 20;
    }
    
    if (top + popupRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - popupRect.height - 10;
    }
    
    translationPopup.style.left = `${Math.max(10, left)}px`;
    translationPopup.style.top = `${Math.max(10, top)}px`;
  }
}

function hideTranslationPopup() {
  if (translationPopup && translationPopup.parentNode) {
    translationPopup.parentNode.removeChild(translationPopup);
    translationPopup = null;
  }
}

// Global functions for popup buttons
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show brief success message
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✅ Copied!';
      copyBtn.style.background = '#28a745';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#007bff';
      }, 1500);
    }
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};

window.speakText = function(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Hindi language code
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    
    // Visual feedback
    const speakBtn = document.querySelector('.speak-btn');
    if (speakBtn) {
      const originalText = speakBtn.textContent;
      speakBtn.textContent = '🔊 Speaking...';
      speakBtn.style.background = '#28a745';
      setTimeout(() => {
        speakBtn.textContent = originalText;
        speakBtn.style.background = '#6c757d';
      }, 2000);
    }
  }
};

// Handle click outside popup to close it
document.addEventListener('click', (e) => {
  if (translationPopup && !translationPopup.contains(e.target)) {
    // Don't close if user is selecting text
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
      hideTranslationPopup();
    }
  }
});

// Listen for messages from background script (for context menu translations)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showTranslation") {
    showTranslationPopup(request.originalText, request.translatedText, request.targetLanguage);
  } else if (request.action === "showError") {
    showErrorPopup(request.message);
  }
});

// Handle escape key to close popup
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && translationPopup) {
    hideTranslationPopup();
  }
});