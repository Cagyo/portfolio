"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { MicrophoneIcon } from "@/assets/icons/MicrophoneIcon";
import { StopIcon } from "@/assets/icons/StopIcon";
import { PlayIcon } from "@/assets/icons/PlayIcon";
import { PauseIcon } from "@/assets/icons/PauseIcon";
import { TrashIcon } from "@/assets/icons/TrashIcon";
import { cn } from "@/app/_lib/cn";
import styles from "./VoiceRecorder.module.css";

type RecordingEntry = {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
};

type VoiceRecorderProps = {
  onRecordingsChange: (blobs: Blob[]) => void;
};

const WAVE_BARS = 28;
const MAX_DURATION_SECONDS = 120;
const MAX_RECORDINGS = 5;

const touchButtonFocusClassName =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-amber";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// ─── RecordingItem ────────────────────────────────────────────────────────────

type RecordingItemProps = {
  index: number;
  duration: number;
  isPlaying: boolean;
  currentTime: number;
  onTogglePlay: () => void;
  onDelete: () => void;
};

function RecordingItem({
  index,
  duration,
  isPlaying,
  currentTime,
  onTogglePlay,
  onDelete,
}: RecordingItemProps) {
  const t = useTranslations("contact.form.voice");
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressScale = Math.min(Math.max(progress / 100, 0), 1);

  return (
    <div
      className={cn(
        styles.itemSlideIn,
        "grid grid-cols-[minmax(8rem,0.9fr)_minmax(10rem,1.3fr)] items-center gap-2 rounded-[0.625rem] border border-border bg-card px-3 py-2.5 max-[520px]:grid-cols-1",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium tracking-[0.02em] text-amber-foreground">
          {t("recordingNLabel", { n: index + 1 })}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs tabular-nums text-faint-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            type="button"
            onClick={onDelete}
            className="flex min-h-8 min-w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent text-ghost-foreground transition-[color,border-color,background-color] duration-200 hover:border-danger-shell-border hover:bg-danger-surface-muted hover:text-danger-foreground focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-danger"
            aria-label={`${t("deleteBtn")} ${index + 1}`}
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onTogglePlay}
          className={cn(
            "flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-amber/40 bg-amber/18 text-amber transition-colors duration-200 hover:bg-amber/28",
            touchButtonFocusClassName,
          )}
          aria-label={isPlaying ? t("pauseBtn") : t("playBtn")}
        >
          {isPlaying ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </button>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-amber/18">
          <div
            data-testid="progress-fill"
            className="h-full w-full origin-left rounded-full bg-amber transition-transform duration-200 ease-linear"
            style={{ transform: `scaleX(${progressScale})` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── VoiceRecorder ────────────────────────────────────────────────────────────

export function VoiceRecorder({ onRecordingsChange }: VoiceRecorderProps) {
  const t = useTranslations("contact.form.voice");
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const audioMapRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingsRef = useRef<RecordingEntry[]>([]);

  // Keep ref in sync for unmount cleanup
  useEffect(() => {
    recordingsRef.current = recordings;
  }, [recordings]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioMapRef.current.forEach((audio) => audio.pause());
      recordingsRef.current.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, [clearTimer]);

  // Notify parent whenever recordings list changes
  useEffect(() => {
    onRecordingsChange(recordings.map((entry) => entry.blob));
  }, [recordings, onRecordingsChange]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const id = crypto.randomUUID();

        const audio = new Audio(url);
        audioMapRef.current.set(id, audio);

        audio.onloadedmetadata = () => {
          const entry: RecordingEntry = { id, blob, url, duration: audio.duration };
          setRecordings((prev) => [...prev, entry]);
        };

        audio.ontimeupdate = () => {
          setPlayProgress((prev) => ({ ...prev, [id]: audio.currentTime }));
        };

        audio.onended = () => {
          setPlayingId((prev) => (prev === id ? null : prev));
          setPlayProgress((prev) => ({ ...prev, [id]: 0 }));
        };

        streamRef.current?.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      recorder.start(100);
      setElapsed(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= MAX_DURATION_SECONDS) {
            stopRecording();
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError(t("micPermissionError"));
    }
  }

  function stopRecording() {
    clearTimer();
    mediaRecorderRef.current?.stop();
  }

  function togglePlayback(id: string) {
    const audio = audioMapRef.current.get(id);
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause any other playing audio first
      if (playingId) {
        audioMapRef.current.get(playingId)?.pause();
      }
      audio.play();
      setPlayingId(id);
    }
  }

  function deleteRecording(id: string) {
    const audio = audioMapRef.current.get(id);
    if (audio) {
      audio.pause();
      audioMapRef.current.delete(id);
    }

    if (playingId === id) setPlayingId(null);

    setPlayProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setRecordings((prev) => {
      const entry = prev.find((recording) => recording.id === id);
      if (entry) URL.revokeObjectURL(entry.url);
      return prev.filter((recording) => recording.id !== id);
    });
  }

  const waveBars = Array.from({ length: WAVE_BARS }, (_, barIndex) => barIndex);
  const canAddMore = recordings.length < MAX_RECORDINGS;

  return (
    <div className="flex min-h-[108px] flex-col gap-3 rounded-2xl border border-border-amber bg-amber/5 p-4">

      {/* ── Completed recordings list ── */}
      {recordings.length > 0 && (
        <div className="flex flex-col gap-2">
          {recordings.map((entry, index) => (
            <RecordingItem
              key={entry.id}
              index={index}
              duration={entry.duration}
              isPlaying={playingId === entry.id}
              currentTime={playProgress[entry.id] ?? 0}
              onTogglePlay={() => togglePlayback(entry.id)}
              onDelete={() => deleteRecording(entry.id)}
            />
          ))}
        </div>
      )}

      {/* ── Active recording bar ── */}
      {isRecording && (
        <div
          className={cn(
            styles.itemSlideIn,
            "flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[0.625rem] border border-dashed border-danger-shell-border bg-danger-shell px-3 py-3.5",
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className={cn(styles.blink, "size-2 rounded-full bg-danger")} aria-hidden="true" />
            <span className="text-[0.8125rem] font-medium text-foreground-soft">{t("recordingLabel")}</span>
            <span className="text-[0.8125rem] font-medium tabular-nums text-amber-foreground">
              {formatTime(elapsed)}
            </span>
          </div>

          <div
            className={cn(styles.wave, "flex h-8 min-w-28 flex-[1_1_10rem] items-center gap-[3px]")}
            aria-hidden="true"
          >
            {waveBars.map((barIndex) => (
              <span
                key={barIndex}
                className="block w-[3px] rounded-sm bg-amber/70"
                style={{ animationDelay: `${(barIndex * 40) % 600}ms` }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-danger-border bg-danger-surface px-5 py-2 text-[0.8125rem] font-medium text-danger-foreground transition-colors duration-200 hover:bg-danger-surface-hover focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-danger"
            aria-label={t("stopBtn")}
          >
            <StopIcon className="w-5 h-5" />
            <span>{t("stopBtn")}</span>
          </button>
        </div>
      )}

      {/* ── Idle: no recordings yet → big centered mic ── */}
      {!isRecording && recordings.length === 0 && (
        <div className="flex flex-1 flex-wrap items-center gap-3.5 p-px text-left">
          <p className="max-w-[34ch] flex-1 text-[0.8125rem] leading-[1.6] text-faint-foreground">
            {t("hint")}
          </p>
          <button
            type="button"
            onClick={startRecording}
            className={cn(
              "relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-amber/34 bg-amber/11 text-amber transition-all duration-200 hover:scale-[1.06] hover:bg-amber/17",
              touchButtonFocusClassName,
            )}
            aria-label={t("recordBtn")}
          >
            <span className="absolute inset-[-5px] rounded-full border-[1.5px] border-amber/18" aria-hidden="true" />
            <MicrophoneIcon className="w-7 h-7" />
          </button>
          <span className="whitespace-nowrap text-xs font-medium tracking-[0.04em] text-ghost-foreground uppercase max-[520px]:basis-full">
            {t("readyLabel")}
          </span>
        </div>
      )}

      {/* ── Add another recording button ── */}
      {!isRecording && recordings.length > 0 && canAddMore && (
        <button
          type="button"
          onClick={startRecording}
          className={cn(
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[0.625rem] border-[1.5px] border-dashed border-amber/28 bg-transparent px-4 py-3 text-[0.8125rem] font-medium text-faint-foreground transition-[color,border-color,background-color] duration-200 hover:border-border-amber hover:bg-amber/6 hover:text-amber-foreground",
            touchButtonFocusClassName,
          )}
          aria-label={t("addAnotherBtn")}
        >
          <MicrophoneIcon className="w-4 h-4" />
          <span>{t("addAnotherBtn")}</span>
        </button>
      )}

      {/* ── Max recordings reached ── */}
      {!isRecording && !canAddMore && (
        <p className="px-0 py-1 text-center text-xs text-ghost-foreground">
          {t("maxReachedLabel", { max: MAX_RECORDINGS })}
        </p>
      )}

      {error && (
        <p className="text-center text-[0.8125rem] text-danger-foreground" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
