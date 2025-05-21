import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_API_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
