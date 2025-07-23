# Chrome Text Translator Extension

A Chrome extension that translates selected text to Hindi or your preferred language with a simple right-click context menu.

## Features

- 🌐 **Instant Translation**: Right-click on selected text to translate
- 🗣️ **20+ Languages**: Support for Hindi, Spanish, French, German, and more
- 📋 **Copy Feature**: Easy copy of translated text
- ⚡ **Fast & Lightweight**: Uses free MyMemory translation API
- 🎯 **Context Integration**: Seamless browser integration
- 🔄 **Auto-hide**: Translation popup disappears automatically
- ⚙️ **Customizable**: Change target language in popup settings

## How to Install

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this project folder
5. The extension will appear in your extensions list

### Method 2: Pack and Install

1. Pack the extension:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select this folder as root directory
   - Click "Pack Extension"
2. Install the generated `.crx` file

## How to Use

1. **Select Text**: Highlight any text on a webpage
2. **Right-click**: Open the context menu
3. **Translate**: Click "Translate to [Language]"
4. **View Result**: See translation in popup overlay
5. **Copy**: Click "Copy Translation" if needed

## Changing Target Language

1. Click the extension icon in Chrome toolbar
2. Select your preferred language from dropdown
3. The context menu will update automatically

## Supported Languages

- Hindi (हिन्दी)
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Italian (Italiano)
- Portuguese (Português)
- Russian (Русский)
- Japanese (日本語)
- Korean (한국어)
- Chinese (中文)
- Arabic (العربية)
- Turkish (Türkçe)
- Dutch (Nederlands)
- Swedish (Svenska)
- Danish (Dansk)
- Norwegian (Norsk)
- Finnish (Suomi)
- Polish (Polski)
- Czech (Čeština)
- Hungarian (Magyar)

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Translation API**: MyMemory (free, no API key required)
- **Permissions**: Active tab, context menus, storage
- **Architecture**: Service worker + Content script + Popup

## File Structure

```
chrome-translator/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Content script for text selection
├── content.css           # Styling for translation popup
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md             # Documentation
```

## Privacy & Security

- No data is stored or transmitted except for translation requests
- Uses HTTPS for all API calls
- No tracking or analytics
- Minimal permissions required

## Troubleshooting

- **Translation not working**: Check internet connection
- **Context menu missing**: Refresh the page after installing
- **Popup not showing**: Check if content scripts are blocked
- **Language not changing**: Restart Chrome after changing language

## Development

To modify or enhance the extension:

1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click refresh icon on the extension card
4. Test your changes

## Contributing

Feel free to submit issues or pull requests to improve the extension!