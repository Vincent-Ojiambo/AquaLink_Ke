# AquaLink Kenya

A platform connecting fishers and buyers in Kenya for efficient seafood trade.

## Features

- Fisher profiles and catch listings
- Real-time marketplace for fresh fish
- Secure authentication and user management
- Image uploads for product listings
- Responsive design for all devices

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI
- Supabase (Auth, Database, Storage)
- React Query
- React Hook Form

## Getting Started

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a26aeace-09ae-415d-879a-bee5f72669f1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_TITLE="AquaLink Kenya"
VITE_APP_DESCRIPTION="Connecting fishers and buyers in Kenya"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel

1. Push your code to a GitHub repository
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel project settings
4. Deploy!

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run `npm run dev`
5. Open [http://localhost:8080](http://localhost:8080) in your browser

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a26aeace-09ae-415d-879a-bee5f72669f1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
