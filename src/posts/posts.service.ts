import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreatePostDto, userId: string) {
    const supabase = this.supabaseService.getClient();
    const payload = { ...dto, user_id: userId };

    const { data, error } = await supabase.from('posts').insert([payload]).select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: existing, error: findErr } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (findErr || !existing) throw new ForbiddenException('投稿が見つかりません');
    if (existing.author_id !== userId) throw new ForbiddenException('他人の投稿は編集できません');

    const { data, error } = await supabase.from('posts').update(dto).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async remove(id: string, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: existing, error: findErr } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (findErr || !existing) throw new ForbiddenException('投稿が見つかりません');
    if (existing.author_id !== userId) throw new ForbiddenException('他人の投稿は削除できません');

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Deleted successfully' };
  }
}
