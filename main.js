import axios from 'axios';

    const API_KEY = 'sk-fe06eae3ac1c441abf8ad2075d38fda5';
    const API_URL = 'https://api.deepseek.com/v3/translate';

    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;
    let translatedContent = null;

    // Initialize languages
    const languages = [
      { code: 'auto', name: 'Auto Detect' },
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic' },
      { code: 'zh', name: 'Chinese' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ru', name: 'Russian' },
      { code: 'es', name: 'Spanish' }
    ];

    function populateLanguages() {
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        sourceLang.appendChild(option.cloneNode(true));
        targetLang.appendChild(option);
      });
      sourceLang.value = 'auto';
      targetLang.value = 'en';
    }

    async function translateText(text, source, target) {
      try {
        const response = await axios.post(API_URL, {
          text,
          source_lang: source,
          target_lang: target
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data.translated_text;
      } catch (error) {
        console.error('Translation error:', error);
        return null;
      }
    }

    function handleFileUpload(file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        inputText.value = content;
        currentFile = file;
      };
      reader.readAsText(file);
    }

    function downloadTranslatedFile() {
      if (!translatedContent) return;
      
      const blob = new Blob([translatedContent], { type: currentFile.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translated_${currentFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Event Listeners
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file);
    });

    translateBtn.addEventListener('click', async () => {
      const text = inputText.value;
      if (!text) return;

      const source = sourceLang.value;
      const target = targetLang.value;

      const translatedText = await translateText(text, source, target);
      if (translatedText) {
        outputText.textContent = translatedText;
        translatedContent = translatedText;
        downloadBtn.disabled = false;
      }
    });

    downloadBtn.addEventListener('click', downloadTranslatedFile);

    // Initialize
    populateLanguages();
