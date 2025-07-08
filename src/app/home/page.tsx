"use client"

import PersonalDashboard from "@/components/dashboard"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonalDashboard />
    </QueryClientProvider>
  )
}
