<div align="center">
  <h1>AquaLink Kenya</h1>
  <p>A comprehensive platform connecting fishers and buyers in Kenya's seafood industry, promoting sustainable fishing practices and efficient trade.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2FVincent-Ojiambo%2FAquaLink)](https://twitter.com/intent/tweet?text=Check%20out%20AquaLink%20Kenya%21%20A%20platform%20connecting%20fishers%20and%20buyers%20in%20Kenya%27s%20seafood%20industry.&url=https%3A%2F%2Fgithub.com%2FVincent-Ojiambo%2FAquaLink)

  <img src="/public/Aqua_Link.png" alt="AquaLink Kenya Logo" width="200"/>
</div>

## 🌟 Features

### For Fishers
- 🎣 Create and manage your professional fisher profile
- 📱 List your daily catch with real-time updates
- 📍 Show your location and fishing zones
- 💳 Secure payment processing
- 🚨 Emergency safety features and alerts

### For Buyers
- 🛒 Browse fresh catch from local fishers
- 🔍 Advanced search and filtering
- 📅 Schedule pickups or deliveries
- ⭐ Rate and review fishers
- 🔄 Real-time inventory updates

### Safety Features
- 🆘 Emergency alert system
- 📍 Live location sharing
- 🚨 Quick access to emergency contacts
- 🛟 Safety guidelines and resources

## 🚀 Tech Stack

### Frontend
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS + Shadcn UI
- 🚀 Vite for fast development
- 📱 Fully responsive design

### Backend
- 🔐 Supabase Authentication
- 🗄️ PostgreSQL Database
- 📦 Supabase Storage for media
- 🔄 Real-time updates with Supabase

### Development Tools
- 🧪 React Query for server state
- 📝 React Hook Form for forms
- 🎯 ESLint + Prettier
- 🐳 Docker support

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vincent-Ojiambo/AquaLink.git
   cd AquaLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`

## 📱 Mobile App

AquaLink also has a companion mobile app (coming soon) with additional features:
- 📍 Offline access to critical information
- 🚨 Push notifications for alerts
- 📸 Direct image capture for catch listings
- 🗺️ Offline maps for remote areas

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kenyan fishing communities for their invaluable input
- Open source contributors
- The React and Supabase communities

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel project settings
4. Deploy!

### Other Platforms
This project can be deployed to any platform that supports Node.js applications, including:
- Netlify
- Heroku
- AWS Amplify
- Render

## 🧩 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── types/         # TypeScript type definitions
├── contexts/      # React context providers
└── assets/        # Static assets (images, icons, etc.)
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🌐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_TITLE="AquaLink Kenya"
VITE_APP_DESCRIPTION="Connecting fishers and buyers in Kenya"
```

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)
- [Supabase Documentation](https://supabase.com/docs)
