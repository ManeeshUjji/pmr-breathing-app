'use client';

import { TTSSettings } from '@/types';

const defaultSettings: TTSSettings = {
  voice: '',
  rate: 0.85,
  pitch: 1.0,
  volume: 1.0,
};

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private settings: TTSSettings = defaultSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isReady = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synth) return;

    // Voices might not be loaded immediately
    const loadVoicesHandler = () => {
      this.voices = this.synth!.getVoices();
      // Prefer English voices with a calm/natural sound
      const preferredVoice = this.voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Daniel') ||
            v.name.includes('Google'))
      );
      if (preferredVoice) {
        this.settings.voice = preferredVoice.name;
      } else if (this.voices.length > 0) {
        const englishVoice = this.voices.find((v) => v.lang.startsWith('en'));
        this.settings.voice = englishVoice?.name || this.voices[0].name;
      }
      this.isReady = true;
    };

    if (this.synth.getVoices().length > 0) {
      loadVoicesHandler();
    } else {
      this.synth.addEventListener('voiceschanged', loadVoicesHandler);
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  setSettings(settings: Partial<TTSSettings>) {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): TTSSettings {
    return { ...this.settings };
  }

  speak(text: string, onEnd?: () => void): void {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    // Set voice
    const voice = this.voices.find((v) => v.name === this.settings.voice);
    if (voice) {
      utterance.voice = voice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  speakSequence(texts: string[], delayMs = 500): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;

      const speakNext = () => {
        if (index >= texts.length) {
          resolve();
          return;
        }

        this.speak(texts[index], () => {
          index++;
          setTimeout(speakNext, delayMs);
        });
      };

      speakNext();
    });
  }

  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  isPaused(): boolean {
    return this.synth?.paused || false;
  }

  isAvailable(): boolean {
    return this.isReady && this.synth !== null;
  }
}

// Singleton instance
let speechService: SpeechService | null = null;

export function getSpeechService(): SpeechService {
  if (!speechService) {
    speechService = new SpeechService();
  }
  return speechService;
}

export type { SpeechService };


