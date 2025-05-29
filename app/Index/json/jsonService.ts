import axios from 'axios';
import { DiaryPost } from '@/types';

// 获取日记列表
export const getDiaryPosts = async (): Promise<DiaryPost[]> => {
  try {
    const response = await axios.get('/api/proxy/json');
    const data = response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('获取日记列表失败:', error);
    return [];
  }
};

// 创建新日记
export const createDiaryPost = async (post: Omit<DiaryPost, 'id'>): Promise<DiaryPost> => {
  try {
    // 获取现有数据
    const existingPosts = await getDiaryPosts();
    
    // 创建新日记，生成新的ID
    const newPost: DiaryPost = {
      id: existingPosts.length > 0 ? Math.max(...existingPosts.map(p => p.id)) + 1 : 1,
      ...post
    };
    
    // 将新日记添加到列表开头
    const updatedPosts = [newPost, ...existingPosts];
    
    // 保存更新后的数据
    await axios.post('/api/proxy/json', updatedPosts);
    
    return newPost;
  } catch (error) {
    console.error('创建日记失败:', error);
    throw error;
  }
};