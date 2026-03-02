import { useState, useRef, useCallback, useEffect } from "react";

type RecorderState = "idle" | "previewing" | "countdown" | "recording" | "review";

export function useVideoRecorder(maxDurationSec = 120) {
  const [state, setState] = useState<RecorderState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // The video preview element — set by the component via a callback ref
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  /** Call this when the <video> element mounts so we can assign srcObject */
  const attachVideoEl = useCallback((el: HTMLVideoElement | null) => {
    videoElRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => { });
    }
  }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startPreview = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;

      // If the video element is already in the DOM (e.g. re-enable), assign now
      if (videoElRef.current) {
        videoElRef.current.srcObject = stream;
        videoElRef.current.play().catch(() => { });
      }
      // Either way, set state — the component will attach via callback ref
      setState("previewing");
    } catch {
      setError("Camera access denied. Please allow camera and microphone permissions.");
    }
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    setState("countdown");
    let c = 3;
    countdownTimerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        beginRecording();
      }
    }, 1000);
  }, []);

  const beginRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setState("review");
    };

    recorder.start(1000);
    setElapsed(0);
    setState("recording");

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= maxDurationSec) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  }, [maxDurationSec]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const retake = useCallback(async () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoBlob(null);
    setVideoUrl(null);
    setElapsed(0);

    // Re-open camera
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoElRef.current) {
        videoElRef.current.srcObject = stream;
        videoElRef.current.play().catch(() => { });
      }
      setState("previewing");
    } catch {
      setError("Camera access denied.");
      setState("idle");
    }
  }, [videoUrl]);

  const reset = useCallback(() => {
    cleanup();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoBlob(null);
    setVideoUrl(null);
    setElapsed(0);
    setError(null);
    setState("idle");
  }, [cleanup, videoUrl]);

  return {
    state,
    countdown,
    elapsed,
    videoBlob,
    videoUrl,
    error,
    attachVideoEl,   // ← use this as callback ref on <video>
    startPreview,
    startCountdown,
    stopRecording,
    retake,
    reset,
    maxDurationSec,
  };
}
