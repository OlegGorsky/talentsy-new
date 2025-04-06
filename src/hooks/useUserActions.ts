import { supabase } from '../lib/supabase';

interface UserActions {
  addUser: (user: { telegram_id: string; first_name: string; username?: string; points: number }, tableName: string) => Promise<void>;
  deleteUsers: (userIds: string[], tableName: string) => Promise<void>;
  updatePoints: (userId: string, newPoints: number, tableName: string) => Promise<void>;
  deleteUser: (userId: string, tableName: string) => Promise<void>;
}

export function useUserActions(): UserActions {
  const addUser = async (user: { telegram_id: string; first_name: string; username?: string; points: number }, tableName: string) => {
    const { error } = await supabase
      .from(tableName)
      .insert([user])
      .select()
      .single();

    if (error) throw error;
  };

  const deleteUsers = async (userIds: string[], tableName: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .in('telegram_id', userIds);

    if (error) throw error;
  };

  const updatePoints = async (userId: string, newPoints: number, tableName: string) => {
    const { error } = await supabase
      .from(tableName)
      .update({ points: newPoints })
      .eq('telegram_id', userId);

    if (error) throw error;
  };

  const deleteUser = async (userId: string, tableName: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('telegram_id', userId);

    if (error) throw error;
  };

  return {
    addUser,
    deleteUsers,
    updatePoints,
    deleteUser
  };
}