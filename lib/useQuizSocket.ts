"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "./socket";

export type SocketRole = "participant" | "display" | "admin";

interface UseQuizSocketOptions {
  sessionId: string | null | undefined;
  role: SocketRole;
  participantId?: string | null;
  onEvent?: (event: string, payload: unknown) => void;
}

/**
 * Shared socket connection used by /waiting, /quiz, /results, /display/[id]
 * and /admin/sessions/[id]. Joins the session room with the given role.
 * Callers are responsible for re-fetching REST state on `reconnect` since
 * events may be missed while disconnected.
 */
export function useQuizSocket({ sessionId, role, participantId, onEvent }: UseQuizSocketOptions) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = getSocket();
    socketRef.current = socket;

    function join() {
      socket.emit("join", { sessionId, role, participantId });
    }

    function handleAny(event: string, payload: unknown) {
      onEvent?.(event, payload);
    }

    socket.on("connect", join);
    socket.on("reconnect", join);
    socket.onAny(handleAny);

    if (!socket.connected) {
      socket.connect();
    } else {
      join();
    }

    return () => {
      socket.off("connect", join);
      socket.off("reconnect", join);
      socket.offAny(handleAny);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, role, participantId]);

  return socketRef;
}
