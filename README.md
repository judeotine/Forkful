
<p align="center">
  <img src="https://i.imgur.com/YourLogoHere.png" alt="Forkful Logo" width="200"/>
</p>

# 🍴 Forkful

> A delightful mobile recipe assistant that helps you discover, save, and cook amazing meals with ease.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.x-53b9ff.svg)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### Core Features
- 🔍 **Smart Recipe Search** - Find recipes by name, ingredients, or dietary needs
- 💖 **Favorites Collection** - Save recipes you love for quick access
- 📱 **Offline Support** - View saved recipes even without internet
- 🍽️ **Meal Planning** - Plan your meals for the week with a drag-and-drop interface
- 🛒 **Auto Shopping Lists** - Generate grocery lists from your meal plans
- 👨‍🍳 **Step-by-Step Cooking** - Follow clear cooking instructions

### Advanced Features
- 🔔 **Push Notifications** - Get reminders and recipe suggestions
- ⏲️ **In-app Cooking Timer** - Time your cooking perfectly
- 🗣️ **Voice-Guided Mode** - Hands-free cooking instructions
- 🧠 **Smart Search History** - Quick access to previous searches
- 📏 **Measurement Converter** - Switch between metric and imperial units
- 🌍 **Global Cuisines** - Explore recipes from around the world
- 📰 **Daily Recipe Feed** - Discover new recipes every day
- 🚀 **Beautiful Onboarding** - Smooth, animated introduction to the app

## 📱 Screenshots

<p align="center">
  <img src="https://i.imgur.com/YourScreenshot1.png" alt="Home Screen" width="200"/>
  <img src="https://i.imgur.com/YourScreenshot2.png" alt="Recipe Detail" width="200"/>
  <img src="https://i.imgur.com/YourScreenshot3.png" alt="Meal Planner" width="200"/>
  <img src="https://i.imgur.com/YourScreenshot4.png" alt="Shopping List" width="200"/>
</p>

## 🛠️ Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - React Router
  - React Query (data fetching)

- **Mobile**
  - Capacitor 7
  - Native iOS/Android support

- **APIs & Services**
  - Spoonacular API (recipe data)
  - Local Storage (favorites, offline recipes)
  - Push Notifications

## 🚀 Installation & Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup & Run

```bash
# Clone the repository
git clone https://github.com/yourusername/forkful.git
cd forkful

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Add mobile platforms
npx cap add android
npx cap add ios

# Sync web code with native projects
npm run build
npx cap sync

# Open native IDEs
npx cap open android
npx cap open ios
```

## 🔑 Environment Setup

Create a `.env` file in the root directory with the following:

```ini
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Project Maintainer - [@YourGitHub](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/forkful](https://github.com/yourusername/forkful)

---

<p align="center">Made with ❤️ and good food</p>
