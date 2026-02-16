import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://uikemwxbndwidqebeyre.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpa2Vtd3hibmR3aWRxZWJleXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDkwNzYsImV4cCI6MjA4NjM4NTA3Nn0.B8HtxqbdPd0eIoofzbKsKp-bEw8xOCfYO28QgV4iYGc',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  }
)
