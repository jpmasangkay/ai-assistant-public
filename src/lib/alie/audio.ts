/** Microphone capture (Web Audio -> WAV) and a serial playback queue. */

export interface RecorderHandle {
  stop: () => Promise<Blob>;
  cancel: () => void;
  /** 0..1 instantaneous input level. */
  level: () => number;
}

function encodeWav(chunks: Float32Array[], sampleRate: number): Blob {
  let length = 0;
  for (const c of chunks) length += c.length;
  const samples = new Float32Array(length);
  let offset = 0;
  for (const c of chunks) {
    samples.set(c, offset);
    offset += c.length;
  }

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let pos = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    pos += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export async function startRecording(): Promise<RecorderHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true },
  });

  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  const processor = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let recording = true;

  processor.onaudioprocess = (e) => {
    if (!recording) return;
    chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  };

  source.connect(analyser);
  source.connect(processor);
  processor.connect(ctx.destination);

  const levelData = new Uint8Array(analyser.frequencyBinCount);

  const teardown = () => {
    recording = false;
    processor.disconnect();
    analyser.disconnect();
    source.disconnect();
    stream.getTracks().forEach((t) => t.stop());
  };

  return {
    level: () => {
      analyser.getByteTimeDomainData(levelData);
      let peak = 0;
      for (let i = 0; i < levelData.length; i++) {
        peak = Math.max(peak, Math.abs((levelData[i] ?? 128) - 128) / 128);
      }
      return Math.min(1, peak * 1.6);
    },
    cancel: () => {
      teardown();
      void ctx.close();
    },
    stop: async () => {
      const rate = ctx.sampleRate;
      teardown();
      await ctx.close();
      return encodeWav(chunks, rate);
    },
  };
}

/** Plays incoming assistant audio one clip at a time. */
export class AudioQueue {
  private queue: string[] = [];
  private current: HTMLAudioElement | null = null;
  private playing = false;
  muted = false;

  constructor(private onChange?: (playing: boolean) => void) {}

  push(url: string) {
    this.queue.push(url);
    void this.drain();
  }

  clear() {
    this.queue = [];
    this.current?.pause();
    this.current = null;
    this.playing = false;
    this.onChange?.(false);
  }

  private async drain() {
    if (this.playing) return;
    const next = this.queue.shift();
    if (!next) return;
    if (this.muted) {
      void this.drain();
      return;
    }
    this.playing = true;
    this.onChange?.(true);
    try {
      const audio = new Audio(next);
      this.current = audio;
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        void audio.play().catch(() => resolve());
      });
    } finally {
      this.current = null;
      this.playing = false;
      this.onChange?.(false);
      if (this.queue.length) void this.drain();
    }
  }
}
