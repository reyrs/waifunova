// src/lib/supabase-client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    'https://pewhyndeytgaudpemikg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBld2h5bmRleXRnYXVkcGVtaWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjgwNTYsImV4cCI6MjA3ODk0NDA1Nn0.PFxT969twhZDqIaR_vAxHQRzQ4wzqGPJUABCuQWiqyw'
  )
}