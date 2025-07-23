// Popup script for Chrome extension
document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('languageSelect');
  const statusDiv = document.getElementById('status');
  
  // Language mapping
  const languages = {
    'hi': 'Hindi',
    'es': 'Spanish', 
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
    'pl': 'Polish',
    'cs': 'Czech',
    'hu': 'Hungarian'
  };
  
  // Load saved language preference
  chrome.storage.sync.get(['targetLanguage'], (result) => {
    if (result.targetLanguage) {
      languageSelect.value = result.targetLanguage;
    }
    updateStatus();
  });
  
  // Handle language selection change
  languageSelect.addEventListener('change', () => {
    const selectedLang = languageSelect.value;
    const selectedLangName = languages[selectedLang];
    
    // Save to storage
    chrome.storage.sync.set({
      targetLanguage: selectedLang,
      targetLanguageName: selectedLangName
    }, () => {
      // Update status
      statusDiv.textContent = `✅ Language changed to ${selectedLangName}`;
      statusDiv.className = 'status updated';
      
      // Update context menu
      chrome.runtime.sendMessage({
        action: 'updateLanguage',
        languageCode: selectedLang,
        languageName: selectedLangName
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        updateStatus();
      }, 3000);
    });
  });
  
  function updateStatus() {
    const currentLang = languages[languageSelect.value] || 'Hindi';
    statusDiv.textContent = `🚀 Ready to translate to ${currentLang}!`;
    statusDiv.className = 'status success';
  }
  
  // Add some interactive feedback
  languageSelect.addEventListener('focus', () => {
    statusDiv.textContent = '🎯 Choose your preferred language';
    statusDiv.className = 'status updated';
  });
  
  languageSelect.addEventListener('blur', () => {
    setTimeout(updateStatus, 500);
  });
});