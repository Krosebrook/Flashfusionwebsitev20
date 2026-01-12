import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * Gamification Initializer Service
 * Handles initialization and state management for the gamification system
 * Now integrated with Supabase KV Store
 */

export interface UserStats {
  user_id: string;
  level: number;
  current_xp: number;
  total_xp: number;
  next_level_xp: number;
  streak_days: number;
  last_active: string;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-88829a40`;

class GamificationService {
  private stats: UserStats | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Get user ID from local storage or generate one
    let userId = localStorage.getItem('ff_user_id');
    if (!userId) {
      userId = 'user_' + Date.now();
      localStorage.setItem('ff_user_id', userId);
    }

    try {
      const response = await fetch(`${API_URL}/gamification/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();

      if (data.success && data.stats) {
        this.stats = data.stats;
      } else {
        // Initialize with default stats if no data on server
        this.stats = {
          user_id: userId,
          level: 1,
          current_xp: 0,
          total_xp: 0,
          next_level_xp: 100,
          streak_days: 1,
          last_active: new Date().toISOString()
        };
        await this.saveStats();
      }
    } catch (error) {
      console.error('Failed to initialize gamification:', error);
      // Fallback to minimal state if API fails
      this.stats = {
        user_id: userId,
        level: 1,
        current_xp: 0,
        total_xp: 0,
        next_level_xp: 100,
        streak_days: 1,
        last_active: new Date().toISOString()
      };
    }
    
    this.initialized = true;
  }

  async getCurrentStats(): Promise<UserStats | null> {
    if (!this.initialized) await this.initialize();
    return this.stats;
  }

  async awardXP(amount: number, reason: string): Promise<UserStats> {
    if (!this.initialized) await this.initialize();
    if (!this.stats) throw new Error('Gamification not initialized');

    this.stats.current_xp += amount;
    this.stats.total_xp += amount;

    // Check for level up
    if (this.stats.current_xp >= this.stats.next_level_xp) {
      this.stats.level += 1;
      this.stats.current_xp -= this.stats.next_level_xp;
      this.stats.next_level_xp = Math.floor(this.stats.next_level_xp * 1.5);
      // Trigger level up event/toast here if needed
    }

    await this.saveStats();
    return this.stats;
  }

  private async saveStats() {
    if (this.stats) {
      try {
        await fetch(`${API_URL}/gamification/${this.stats.user_id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.stats)
        });
      } catch (error) {
        console.error('Failed to save gamification stats:', error);
      }
    }
  }
}

export const GamificationInitializer = new GamificationService();
export const awardXP = (amount: number, reason: string) => GamificationInitializer.awardXP(amount, reason);
export const getCurrentStats = () => GamificationInitializer.getCurrentStats();
