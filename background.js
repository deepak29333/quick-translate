// Background service worker for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: "translateText",
    title: "Translate to Hindi",
    contexts: ["selection"]
  });

  // Set default language to Hindi
  chrome.storage.sync.set({
    targetLanguage: 'hi',
    targetLanguageName: 'Hindi'
  });
  
  console.log('Chrome Text Translator Extension installed successfully!');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateText" && info.selectionText) {
    translateText(info.selectionText, tab.id);
  }
});

// Translation function using MyMemory API (free translation service)
async function translateText(text, tabId) {
  try {
    const result = await chrome.storage.sync.get(['targetLanguage', 'targetLanguageName']);
    const targetLang = result.targetLanguage || 'hi';
    const targetLangName = result.targetLanguageName || 'Hindi';
    
    console.log(`Translating "${text}" to ${targetLangName}`);
    
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      const translatedText = data.responseData.translatedText;
      
      // Send translation to content script
      chrome.tabs.sendMessage(tabId, {
        action: "showTranslation",
        originalText: text,
        translatedText: translatedText,
        targetLanguage: targetLangName
      });
      
      console.log(`Translation successful: ${translatedText}`);
    } else {
      throw new Error('Translation API returned error status');
    }
    
  } catch (error) {
    console.error('Translation error:', error);
    chrome.tabs.sendMessage(tabId, {
      action: "showError",
      message: "Translation failed. Please check your internet connection and try again."
    });
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateLanguage") {
    chrome.contextMenus.update("translateText", {
      title: `Translate to ${request.languageName}`
    });
    console.log(`Context menu updated to: Translate to ${request.languageName}`);
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Chrome Text Translator Extension started');
});