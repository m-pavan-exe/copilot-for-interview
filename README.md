# 🎤 Interview Copilot - AI-Powered Interview Assistant

A sophisticated web-based interview assistant that provides real-time AI-powered responses during job interviews. Built with React, TypeScript, and Google Gemini AI integration for seamless interview preparation and support.

## ✨ Features

- 🎙️ **Real-time Speech Recognition**: Continuous transcription using Web Speech API
- 🤖 **AI-Powered Responses**: Gemini 2.5 Pro generates contextual interview answers
- 👻 **Stealth Interface**: Minimal, hideable UI with hotkey controls (Ctrl+H)
- 📝 **Session Management**: Persistent interview sessions with transcript history
- 🌐 **Cross-Platform**: Works on any modern web browser
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- ⌨️ **Keyboard Shortcuts**: Quick controls for listening (Ctrl+L) and hiding (Ctrl+H)
- 🎨 **Modern UI**: Beautiful interface with dark/light mode support

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher) 📦
- **npm** (comes with Node.js) or **yarn** 🧶
- **Git** (for cloning the repository) 🔧
- **Google Gemini API Key** (for AI responses) 🔑

### Installing Node.js

If you don't have Node.js installed:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version for your operating system
3. Run the installer and follow the setup wizard
4. Verify installation by opening terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

## 📥 Getting Started

### Option 1: Clone the Repository (Recommended)

1. **Open your terminal/command prompt** 💻

2. **Navigate to your desired directory:**
   ```bash
   cd /path/to/your/projects
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/interview-copilot.git
   ```

4. **Navigate to the project directory:**
   ```bash
   cd interview-copilot
   ```

### Option 2: Download ZIP File

1. **Visit the GitHub repository page** 🌐
2. **Click the green "Code" button** 
3. **Select "Download ZIP"** 📁
4. **Extract the ZIP file** to your desired location
5. **Open terminal/command prompt** and navigate to the extracted folder:
   ```bash
   cd /path/to/extracted/interview-copilot
   ```

## ⚙️ Installation & Setup

### Step 1: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install all dependencies including:
- React & React DOM
- TypeScript
- Tailwind CSS
- Vite (build tool)
- UI components (Radix UI)
- And many more...

### Step 2: Get Your Gemini API Key 🔑

1. **Visit Google AI Studio:** https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click "Get API Key"** in the top navigation
4. **Create a new API key** or use an existing one
5. **Copy the API key** - you'll need it later

### Step 3: Environment Setup (Optional)

While the app can work without environment variables (API key can be entered in the UI), you can optionally create a `.env.local` file for convenience:

```bash
# Create .env.local file in the root directory
touch .env.local
```

Add your API key to the file:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**⚠️ Important:** Never commit your API key to version control!

## 🚀 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at: `http://localhost:8080` 🌐

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🎯 Usage Instructions

### Initial Setup

1. **Open the application** in your browser
2. **Grant microphone permission** when prompted 🎤
3. **Enter your Gemini API key** in the control panel
4. **Start a new interview session** by clicking "New Session"

### During an Interview

1. **Start listening** by clicking the microphone button or pressing `Ctrl+L` ⌨️
2. **Hide the interface** by pressing `Ctrl+H` for stealth mode 👻
3. **Speak naturally** - the app will transcribe your conversation
4. **AI responses** will appear automatically when questions are detected
5. **Review responses** in the AI Response panel

### Keyboard Shortcuts

- `Ctrl + L`: Toggle microphone listening 🎙️
- `Ctrl + H`: Toggle interface visibility 👁️

### Features Overview

#### 🎙️ Microphone Button
- Click to start/stop speech recognition
- Visual indicator shows listening status
- Automatic permission handling

#### 📝 Transcript Panel
- Real-time speech transcription
- Timestamp for each entry
- Clear transcripts option
- Interim results display

#### 🤖 AI Response Panel
- Automatic question detection
- Contextual response generation
- Response history
- Copy responses to clipboard

#### ⚙️ Control Panel
- API key management
- Session controls
- Settings and preferences
- Clear data options

#### 👻 Stealth Mode
- Minimize interface visibility
- Quick toggle with keyboard shortcut
- Maintain functionality while hidden

## 🏗️ Project Structure

```
interview-copilot/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── AIResponsePanel.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── InterviewCopilot.tsx
│   │   ├── MicrophoneButton.tsx
│   │   ├── StealthMode.tsx
│   │   └── TranscriptPanel.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useInterviewCopilot.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── services/
│   │   ├── geminiService.ts
│   │   └── speechService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── README.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuration

### Gemini AI Configuration

The app uses Google's Gemini 2.5 Pro model for generating responses. You can configure:

- **Model parameters** in `src/services/geminiService.ts`
- **Response prompts** and question detection logic
- **Generation settings** (temperature, max tokens, etc.)

### Speech Recognition Configuration

Modify speech recognition settings in `src/services/speechService.ts`:

- **Language settings** (default: 'en-US')
- **Continuous recognition** mode
- **Interim results** handling
- **Confidence thresholds**

### UI Customization

The app uses Tailwind CSS for styling. Customize:

- **Colors and themes** in `src/index.css`
- **Component variants** in `tailwind.config.ts`
- **Dark/light mode** settings

## 🐛 Troubleshooting

### Common Issues

#### Microphone Not Working
- ✅ Ensure browser permissions are granted
- ✅ Check if microphone is being used by other applications
- ✅ Try refreshing the page and granting permissions again
- ✅ Test in Chrome/Edge (best speech recognition support)

#### AI Responses Not Generating
- ✅ Verify your Gemini API key is correct
- ✅ Check browser console for error messages
- ✅ Ensure you have internet connection
- ✅ Try speaking more clearly or asking direct questions

#### App Not Loading
- ✅ Check if Node.js and npm are properly installed
- ✅ Run `npm install` to ensure all dependencies are installed
- ✅ Clear browser cache and refresh
- ✅ Check browser console for JavaScript errors

#### Speech Recognition Not Supported
- ✅ Use Chrome, Edge, or Safari (Firefox has limited support)
- ✅ Ensure you're using HTTPS or localhost
- ✅ Update your browser to the latest version

### Browser Compatibility

| Browser | Speech Recognition | AI Features | Recommended |
|---------|-------------------|-------------|-------------|
| Chrome  | ✅ Full Support    | ✅ Yes       | ⭐ Yes      |
| Edge    | ✅ Full Support    | ✅ Yes       | ⭐ Yes      |
| Safari  | ⚠️ Limited        | ✅ Yes       | ⚠️ Partial  |
| Firefox | ❌ No Support      | ✅ Yes       | ❌ No       |

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code** to GitHub
2. **Connect your GitHub repo** to Vercel
3. **Add environment variables** in Vercel dashboard
4. **Deploy automatically** on every push

### Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Drag and drop** the `dist` folder to Netlify
3. **Configure environment variables** if needed

### Deploy to GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```
2. **Add deploy script** to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
3. **Build and deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork the repository** 🍴
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** ✨
4. **Run tests and linting:**
   ```bash
   npm run lint
   npm run type-check
   ```
5. **Commit your changes:**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** 🚀

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **descriptive commit messages**
- Add **comments** for complex logic
- Update **documentation** for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent response generation 🤖
- **Web Speech API** for real-time transcription 🎙️
- **React** for the reactive frontend framework ⚛️
- **Tailwind CSS** for beautiful, responsive styling 🎨
- **Vite** for fast development and building ⚡
- **TypeScript** for type safety and developer experience 🔒

## 📞 Support & FAQ

### How does the AI detect questions?
The app uses natural language processing to identify question patterns in speech, including interrogative words and sentence structure.

### Is my data secure?
Yes! All speech processing happens in your browser, and API calls are made directly to Google's servers. No data is stored on intermediate servers.

### Can I use this for phone interviews?
Absolutely! The web app works on mobile devices, though desktop is recommended for better speech recognition accuracy.

### What languages are supported?
Currently, the app is optimized for English, but you can modify the language settings in the speech service configuration.

### How accurate is the speech recognition?
Accuracy depends on your microphone quality, speaking clarity, and background noise. Chrome typically provides the best results.

---

**⚠️ Disclaimer**: This tool is for educational and personal use. Ensure compliance with your organization's interview policies before use in professional settings.

**🌟 Star this repository** if you find it helpful!