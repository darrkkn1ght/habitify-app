# 🚀 Habitify - Build Better Habits

A beautiful, modern habit tracking app built with React Native and Expo. Track your daily habits, visualize your progress, and build lasting positive changes in your life.

![Habitify Logo](./assets/images/logo.png)

## 📱 Features

### ✨ Core Functionality
- **📋 Habit Management**: Create, edit, and delete custom habits
- **📊 Progress Tracking**: Visual progress bars and streak counters
- **📈 Analytics**: Detailed habit statistics and completion rates
- **🎯 Daily Dashboard**: Quick overview of today's habits
- **🔄 Flexible Frequencies**: Daily habits or custom weekly goals
- **📱 Intuitive UI**: Clean, modern interface with smooth animations

### 🎨 User Experience
- **🌟 Onboarding**: Beautiful introduction to the app
- **👤 User Profiles**: Customizable user accounts
- **⚙️ Settings**: Comprehensive app preferences
- **💾 Data Export**: Backup and share your progress data
- **🎨 Categories**: Organize habits by type (Health, Fitness, Learning, etc.)
- **📱 Responsive Design**: Works perfectly on all screen sizes

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Storage**: AsyncStorage for data persistence
- **UI Components**: Custom components with consistent styling
- **Icons**: Expo Vector Icons (Ionicons)
- **Platform**: iOS, Android, and Web ready

## 🏗️ Project Structure

```
habitify-app/
├── assets/                    # Images, fonts, and static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CustomButton.js
│   │   ├── InputField.js
│   │   ├── HabitCard.js
│   │   ├── ProgressBar.js
│   │   └── Header.js
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.js
│   │   ├── AuthStack.js
│   │   └── MainTabs.js
│   ├── screens/            # App screens
│   │   ├── onboarding/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── habits/
│   │   └── settings/
│   ├── context/           # Global state management
│   │   └── HabitsContext.js
│   ├── utils/            # Utility functions
│   │   ├── storage.js
│   │   └── validation.js
│   └── data/            # Sample data and constants
│       └── dummyHabits.js
├── App.js              # Root component
├── app.json           # Expo configuration
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habitify-app.git
   cd habitify-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator, `a` for Android emulator

### Building for Production

1. **Create production build**
   ```bash
   expo build:android
   expo build:ios
   ```

2. **Publish to Expo**
   ```bash
   expo publish
   ```

## 📖 Usage Guide

### Getting Started
1. **Onboarding**: Learn about Habitify's features
2. **Sign Up**: Create your account
3. **Create Habits**: Add your first habits with categories
4. **Track Progress**: Mark habits as complete daily
5. **View Analytics**: Check your progress and streaks

### Creating Habits
- Choose from predefined categories or create custom ones
- Set daily or weekly frequency goals
- Add descriptions to track specific details
- Customize with colors and icons

### Tracking Progress
- Mark habits complete from the home dashboard
- View detailed analytics in habit detail screens
- Track streaks and completion rates
- Export data for backup or analysis

## 🎨 Customization

### Adding New Categories
Edit `src/data/dummyHabits.js` to add new habit categories:

```javascript
const categories = [
  'Health', 'Fitness', 'Learning', 'Productivity', 
  'Mindfulness', 'Social', 'Your Custom Category'
];
```

### Theming
Modify colors in component stylesheets or create a central theme file:

```javascript
const theme = {
  primary: '#3498DB',
  secondary: '#2ECC71',
  danger: '#E74C3C',
  // Add your custom colors
};
```

## 📦 Dependencies

### Core Dependencies
- `expo`: ~49.0.0
- `react`: 18.2.0
- `react-native`: 0.72.6
- `@react-navigation/native`: ^6.0.0
- `@react-navigation/bottom-tabs`: ^6.0.0
- `@react-navigation/stack`: ^6.0.0
- `@react-native-async-storage/async-storage`: ^1.19.0

### Development Dependencies
- `@babel/core`: ^7.20.0
- `babel-preset-expo`: ~9.5.0

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test on both iOS and Android
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@habitify.app
- **Issues**: [GitHub Issues](https://github.com/yourusername/habitify-app/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/habitify-app/wiki)

## 🙏 Acknowledgments

- **React Native Community** for excellent documentation
- **Expo Team** for the amazing development platform
- **Ionicons** for beautiful, consistent icons
- **Contributors** who helped make this project better

## 🔄 Changelog

### Version 1.0.0 (2025-06-25)
- ✅ Initial release
- ✅ Complete habit tracking functionality
- ✅ User authentication and profiles
- ✅ Data export and import
- ✅ Beautiful, responsive UI
- ✅ Cross-platform support (iOS, Android, Web)

---

**Built with ❤️ by the Habitify Team**

*Start building better habits today! 🌟*