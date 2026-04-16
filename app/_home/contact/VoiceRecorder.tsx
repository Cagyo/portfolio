"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { MicrophoneIcon } from "../../../assets/icons/MicrophoneIcon";
import { StopIcon } from "../../../assets/icons/StopIcon";
import { PlayIcon } from "../../../assets/icons/PlayIcon";
import { PauseIcon } from "../../../assets/icons/PauseIcon";
import { TrashIcon } from "../../../assets/icons/TrashIcon";
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

  return (
    <div className={styles.recordingItem}>
      <div className={styles.itemHeader}>
        <span className={styles.itemLabel}>
          {t("recordingNLabel", { n: index + 1 })}
        </span>
        <div className={styles.itemActions}>
          <span className={styles.itemTime}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            type="button"
            onClick={onDelete}
            className={styles.deleteBtn}
            aria-label={`${t("deleteBtn")} ${index + 1}`}
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className={styles.itemPlayRow}>
        <button
          type="button"
          onClick={onTogglePlay}
          className={styles.playBtn}
          aria-label={isPlaying ? t("pauseBtn") : t("playBtn")}
        >
          {isPlaying ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </button>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
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
    <div className={styles.recorder}>

      {/* ── Completed recordings list ── */}
      {recordings.length > 0 && (
        <div className={styles.recordingList}>
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
        <div className={styles.recordingState}>
          <div className={styles.recordingHeader}>
            <span className={styles.recordingDot} aria-hidden="true" />
            <span className={styles.recordingLabel}>{t("recordingLabel")}</span>
            <span className={styles.timer}>{formatTime(elapsed)}</span>
          </div>

          <div className={styles.waveform} aria-hidden="true">
            {waveBars.map((barIndex) => (
              <span
                key={barIndex}
                className={styles.waveBar}
                style={{ animationDelay: `${(barIndex * 40) % 600}ms` }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className={styles.stopBtn}
            aria-label={t("stopBtn")}
          >
            <StopIcon className="w-5 h-5" />
            <span>{t("stopBtn")}</span>
          </button>
        </div>
      )}

      {/* ── Idle: no recordings yet → big centered mic ── */}
      {!isRecording && recordings.length === 0 && (
        <div className={styles.idleState}>
          <p className={styles.hint}>{t("hint")}</p>
          <button
            type="button"
            onClick={startRecording}
            className={styles.recordBtn}
            aria-label={t("recordBtn")}
          >
            <span className={styles.recordBtnRing} aria-hidden="true" />
            <MicrophoneIcon className="w-7 h-7" />
          </button>
          <span className={styles.idleLabel}>{t("readyLabel")}</span>
        </div>
      )}

      {/* ── Add another recording button ── */}
      {!isRecording && recordings.length > 0 && canAddMore && (
        <button
          type="button"
          onClick={startRecording}
          className={styles.addAnotherBtn}
          aria-label={t("addAnotherBtn")}
        >
          <MicrophoneIcon className="w-4 h-4" />
          <span>{t("addAnotherBtn")}</span>
        </button>
      )}

      {/* ── Max recordings reached ── */}
      {!isRecording && !canAddMore && (
        <p className={styles.maxReachedLabel}>
          {t("maxReachedLabel", { max: MAX_RECORDINGS })}
        </p>
      )}

      {error && (
        <p className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
