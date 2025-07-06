import { api } from '../services/api';

const randomGeneratorInstance = new (class RandomGeneratorClass {
  private static instance: RandomGeneratorClass | null = null;
  private static recentCombinations: Array<{ characterIndex: number; actionIndex: number }> = [];
  private characters: string[] = [];
  private actions: string[] = [];
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    if (RandomGeneratorClass.instance) {
      throw new Error('RandomGeneratorClass is a singleton and cannot be instantiated multiple times.');
    }
    RandomGeneratorClass.instance = this;
    // Store the initialization promise
    this.initializationPromise = this.initializeGameData();
  }

  private async initializeGameData() {
    try {
      const gameData = await api.getGameData();
      this.characters = gameData.characters;
      this.actions = gameData.actions;
    } catch (error) {
      console.error('Failed to initialize game data:', error);
      // Fallback to default values
      this.characters = ['DefaultCharacter1', 'DefaultCharacter2']; 
      this.actions = ['DefaultAction1', 'DefaultAction2']; 
    }
  }

  public async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  // Get a random combination that hasn't been used recently
  public async getRandomCombination(): Promise<{ character: string; action: string }> {
    await this.waitForInitialization();

    const maxAttempts = 100; // Prevent infinite loop in case we run out of options
    let attempts = 0;

    while (attempts < maxAttempts) {
      const characterIndex = Math.floor(Math.random() * this.characters.length);
      const actionIndex = Math.floor(Math.random() * this.actions.length);

      // Check if this combination was used recently
      const isRecent = RandomGeneratorClass.recentCombinations.some(
        (combo) => combo.characterIndex === characterIndex || combo.actionIndex === actionIndex
      );
      
      if (!isRecent) {
        // Add to recent combinations (keep only last 10)
        RandomGeneratorClass.recentCombinations.push({ characterIndex, actionIndex });
        if (RandomGeneratorClass.recentCombinations.length > 10) {
          RandomGeneratorClass.recentCombinations.shift();
        }

        return {
          character: this.characters[characterIndex],
          action: this.actions[actionIndex]
        };
      }
      attempts++;
    }

    // If we run out of attempts, just return a random combination
    const characterIndex = Math.floor(Math.random() * this.characters.length);
    const actionIndex = Math.floor(Math.random() * this.actions.length);
    return {
      character: this.characters[characterIndex],
      action: this.actions[actionIndex]
    };
  }

  // Reset the recent combinations
  public reset() {
    RandomGeneratorClass.recentCombinations = [];
  }

  // Get the recent combinations for debugging
  public getRecentCombinations() {
    return RandomGeneratorClass.recentCombinations;
  }

  public cleanupStatic() {
    RandomGeneratorClass.instance = null;
    RandomGeneratorClass.recentCombinations = [];
  }
})();

export { randomGeneratorInstance as RandomGenerator };
