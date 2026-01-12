/**
 * Gamification Initializer Service
 * Handles initialization and state management for the gamification system
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

class GamificationService {
  private stats: UserStats | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Simulate loading from local storage or API
    const savedStats = localStorage.getItem('ff_gamification_stats');
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    } else {
      // Initialize with default stats for new user
      this.stats = {
        user_id: 'user_' + Date.now(),
        level: 1,
        current_xp: 0,
        total_xp: 0,
        next_level_xp: 100,
        streak_days: 1,
        last_active: new Date().toISOString()
      };
      this.saveStats();
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

    this.saveStats();
    return this.stats;
  }

  private saveStats() {
    if (this.stats) {
      localStorage.setItem('ff_gamification_stats', JSON.stringify(this.stats));
    }
  }
}

export const GamificationInitializer = new GamificationService();
