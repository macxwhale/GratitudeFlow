# GratitudeFlow

Welcome to **GratitudeFlow**, your AI-powered companion for daily gratitude journaling and self-reflection. This application helps you cultivate a positive mindset by providing insightful analysis of your journal entries, personalized affirmations, and a beautiful interface to track your emotional well-being over time.

Built with a modern tech stack, this project serves as an excellent example of a full-stack, serverless web application.

---

## ✨ Key Features

*   **AI-Powered Insights**: Leverages Google's Gemini model via Genkit to analyze reflections, identify emotional themes, and provide empathetic summaries.
*   **Personalized Gratitude & Affirmations**: Generates custom-crafted gratitude messages and positive affirmations tailored to your unique entries.
*   **Secure User Accounts**: Firebase Authentication provides secure email/password sign-up and login.
*   **Persistent Data Storage**: Reflections are securely stored per-user in Firestore, allowing you to access your journey from any device.
*   **Track Your Growth**: Visualize your journaling consistency with an interactive calendar and track your current and longest reflection streaks.
*   **Full History**: Review your entire gratitude journey on the history page, complete with summaries of your most common emotional themes.
*   **Account Management**: Easily manage your account, send a password reset email, or permanently delete your account and all associated data.
*   **Modern, Responsive UI**: A beautiful, calming user interface built with Next.js, Tailwind CSS, and ShadCN UI components, designed to work seamlessly on desktop and mobile.

---

## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini Pro model
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore for database, Firebase Authentication for users)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) for client-side data fetching and caching.

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
*   A Google Cloud project with the **AI Platform API** enabled.
*   A Firebase project with **Firestore** and **Firebase Authentication** (Email/Password provider) enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gratitudeflow.git
    cd gratitudeflow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Firebase and Google Cloud credentials:
    ```env
    # Genkit/Google AI Credentials
    GOOGLE_API_KEY="your_google_cloud_api_key"

    # Firebase Client SDK Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
    ```

### Running the Development Server

1.  **Start the Genkit development server:**
    The AI flows run on a separate server during development.
    ```bash
    npm run genkit:dev
    ```

2.  **Start the Next.js development server:**
    In a separate terminal, run the following command:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 📂 Project Structure

A brief overview of the key files and directories in the project.

```
/
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── ai/                 # Genkit AI flows and configuration
│   ├── app/                # Next.js App Router pages and layouts
│   ├── components/         # Reusable React components (UI, layout, ads)
│   ├── firebase/           # Firebase configuration and custom hooks
│   ├── hooks/              # Custom React hooks (e.g., use-toast)
│   ├── lib/                # Utility functions and services
│   └── types/              # TypeScript type definitions
├── .env.local              # Local environment variables
├── next.config.ts          # Next.js configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

This project provides a solid foundation for building modern, AI-integrated web applications with a serverless backend.