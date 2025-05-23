import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private readonly supabase: SupabaseClient;
  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.getClient();
  }

  async create(user: { id: string; email: string; name?: string }) {
    const { error } = await this.supabase.from('users').insert(user);
    if (error) throw new BadRequestException(error.message);
    return { message: 'User created' };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('users').select('*').eq('id', id).single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
