import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PostsService {
  private readonly supabase: SupabaseClient;
  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.getClient();
  }

  async create(dto: CreatePostDto, userId: string) {
    const payload = { ...dto, user_id: userId };

    const { data, error } = await this.supabase.from('posts').insert([payload]).select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('posts')
      .select(`*, author:users (id, email, name)`)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('posts')
      .select(`*, author:users (id, email, name)`)
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const { data: existing, error: findErr } = await this.supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (findErr || !existing) throw new ForbiddenException('投稿が見つかりません');
    if (existing.author_id !== userId) throw new ForbiddenException('他人の投稿は編集できません');

    const { data, error } = await this.supabase.from('posts').update(dto).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async remove(id: string, userId: string) {
    const { data: existing, error: findErr } = await this.supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (findErr || !existing) throw new ForbiddenException('投稿が見つかりません');
    if (existing.author_id !== userId) throw new ForbiddenException('他人の投稿は削除できません');

    const { error } = await this.supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Deleted successfully' };
  }
}
