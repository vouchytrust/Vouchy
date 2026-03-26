import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from '@posthog/react'
import App from "./App.tsx";
import "./index.css";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-03-25',
} as const

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const isEmbed = window.location.pathname.startsWith("/embed/") || window.location.pathname.startsWith("/e/");

createRoot(document.getElementById("root")!).render(
  isEmbed ? (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ) : (
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN} options={options}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PostHogProvider>
  )
);
