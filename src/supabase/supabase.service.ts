import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      configService.get<string>('SUPABASE_API_URL') as string,
      configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') as string,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
