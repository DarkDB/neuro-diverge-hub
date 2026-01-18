import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface ScreeningSession {
  id: string;
  edad: string;
  genero: string;
  destinatario: string;
  fase1_preguntas: Json | null;
  fase1_respuestas: Json | null;
  teaser_data: Json | null;
  fase2_preguntas: Json | null;
  fase2_respuestas: Json | null;
  analisis_preliminar: Json | null;
  informe_final: Json | null;
  status: string;
  paid: boolean;
  completed_at: string | null;
  created_at: string;
}

type SessionUpdate = {
  fase1_preguntas?: Json;
  fase1_respuestas?: Json;
  teaser_data?: Json;
  fase2_preguntas?: Json;
  fase2_respuestas?: Json;
  analisis_preliminar?: Json;
  informe_final?: Json;
  status?: string;
  paid?: boolean;
  completed_at?: string;
};

export function useScreeningSession() {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const createSession = useCallback(
    async (data: { edad: string; genero: string; destinatario: string }) => {
      if (!user) {
        toast.error("Debes iniciar sesión para continuar.");
        return null;
      }

      setIsSaving(true);
      try {
        const { data: session, error } = await supabase
          .from("screening_sessions")
          .insert({
            user_id: user.id,
            edad: data.edad,
            genero: data.genero,
            destinatario: data.destinatario,
            status: "fase1",
          })
          .select("id")
          .single();

        if (error) throw error;

        setSessionId(session.id);
        return session.id;
      } catch (error) {
        console.error("Error creating session:", error);
        toast.error("Error al guardar la sesión.");
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [user]
  );

  const updateSession = useCallback(
    async (updates: SessionUpdate) => {
      if (!sessionId) {
        console.warn("No session ID to update");
        return false;
      }

      setIsSaving(true);
      try {
        const { error } = await supabase
          .from("screening_sessions")
          .update(updates)
          .eq("id", sessionId);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Error updating session:", error);
        toast.error("Error al guardar el progreso.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [sessionId]
  );

  const savePhase1 = useCallback(
    async (
      preguntas: string[],
      respuestas: { pregunta: string; respuesta: string }[],
      teaserData?: Json
    ) => {
      return updateSession({
        fase1_preguntas: preguntas.map((p) => ({ pregunta: p })) as Json,
        fase1_respuestas: respuestas as unknown as Json,
        teaser_data: teaserData ?? null,
        status: teaserData ? "teaser" : "fase1",
      });
    },
    [updateSession]
  );

  const savePhase2 = useCallback(
    async (
      preguntas: string[],
      respuestas: { pregunta: string; respuesta: string }[],
      analisisPreliminar: Json
    ) => {
      return updateSession({
        fase2_preguntas: preguntas.map((p) => ({ pregunta: p })) as Json,
        fase2_respuestas: respuestas as unknown as Json,
        analisis_preliminar: analisisPreliminar,
        status: "fase2",
      });
    },
    [updateSession]
  );

  const completeSession = useCallback(
    async (informeFinal: Json) => {
      return updateSession({
        informe_final: informeFinal,
        status: "complete",
        completed_at: new Date().toISOString(),
      });
    },
    [updateSession]
  );

  const markAsPaid = useCallback(async () => {
    return updateSession({ paid: true });
  }, [updateSession]);

  const resetSession = useCallback(() => {
    setSessionId(null);
  }, []);

  const setSessionIdManual = useCallback((id: string) => {
    setSessionId(id);
  }, []);

  return {
    sessionId,
    isSaving,
    setSessionIdManual,
    createSession,
    updateSession,
    savePhase1,
    savePhase2,
    completeSession,
    markAsPaid,
    resetSession,
  };
}
