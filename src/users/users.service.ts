import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async createUser(user: { id: string; email: string; name?: string }) {
    const { error } = await this.supabaseService.getClient().from('users').insert(user);

    if (error) throw new BadRequestException(error.message);
    return { message: 'User created' };
  }
}
