-- =============================================
-- TAMV MVP CIVILIZATORIO - MIGRACIÓN COMPLETA
-- Social Feed + BookPI Ledger + HITL System
-- =============================================

-- Extensión para UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- SOCIAL FEED: Posts, Comments, Likes, Follows
-- =============================================

-- Tabla de posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT, -- 'image', 'video', 'audio'
  visibility TEXT DEFAULT 'public', -- 'public', 'followers', 'private'
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  bookpi_hash TEXT, -- Hash de auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- Para respuestas anidadas
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  bookpi_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT likes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT unique_post_like UNIQUE (user_id, post_id),
  CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);

-- Tabla de follows
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- =============================================
-- BOOKPI LEDGER: Auditoría inmutable
-- =============================================

CREATE TABLE IF NOT EXISTS public.bookpi_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'REGISTER', 'LOGIN', 'LOGOUT', 'CREATE_POST', 'EDIT_PROFILE', 'HITL_ACTION'
  entity_type TEXT, -- 'post', 'comment', 'profile', 'vote', etc.
  entity_id UUID,
  prev_hash TEXT,
  hash TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por usuario y tipo
CREATE INDEX IF NOT EXISTS idx_bookpi_user ON public.bookpi_events(user_id);
CREATE INDEX IF NOT EXISTS idx_bookpi_type ON public.bookpi_events(event_type);
CREATE INDEX IF NOT EXISTS idx_bookpi_entity ON public.bookpi_events(entity_type, entity_id);

-- =============================================
-- ISABELLA GOVERNANCE: Eventos y HITL
-- =============================================

CREATE TABLE IF NOT EXISTS public.isabella_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'USER_MESSAGE', 'POLICY_EVALUATION', 'ASSISTANT_RESPONSE', 'PENDING_HITL', 'SYSTEM_ERROR'
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ethics_score NUMERIC,
  requires_hitl BOOLEAN DEFAULT FALSE,
  hitl_status TEXT DEFAULT 'none', -- 'none', 'pending', 'approved', 'edited', 'blocked'
  hitl_resolved_by UUID REFERENCES public.profiles(id),
  hitl_resolved_at TIMESTAMPTZ,
  hitl_notes TEXT,
  bookpi_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_isabella_hitl ON public.isabella_events(requires_hitl, hitl_status);
CREATE INDEX IF NOT EXISTS idx_isabella_user ON public.isabella_events(user_id);

-- =============================================
-- IDENTITY EVENTS: Registro de identidad
-- =============================================

CREATE TABLE IF NOT EXISTS public.identity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'REGISTER', 'LOGIN', 'LOGOUT', 'PROFILE_UPDATE', 'PASSWORD_CHANGE'
  prev_hash TEXT,
  hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_identity_user ON public.identity_events(user_id);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Posts RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts públicos visibles por todos"
  ON public.posts FOR SELECT
  USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Usuarios pueden crear posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Comments RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentarios visibles en posts públicos"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = comments.post_id 
      AND (posts.visibility = 'public' OR posts.user_id = auth.uid())
    )
  );

CREATE POLICY "Usuarios pueden crear comentarios"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus comentarios"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus comentarios"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Likes RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes visibles por todos"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden dar likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden quitar sus likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- Follows RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows visibles por todos"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden seguir"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Usuarios pueden dejar de seguir"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- BookPI Events RLS
ALTER TABLE public.bookpi_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus propios eventos"
  ON public.bookpi_events FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'guardian'));

CREATE POLICY "Sistema puede insertar eventos"
  ON public.bookpi_events FOR INSERT
  WITH CHECK (true);

-- Isabella Events RLS
ALTER TABLE public.isabella_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus eventos"
  ON public.isabella_events FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'guardian'));

CREATE POLICY "Sistema inserta eventos"
  ON public.isabella_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Guardianes pueden actualizar HITL"
  ON public.isabella_events FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'guardian'));

-- Identity Events RLS
ALTER TABLE public.identity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus eventos de identidad"
  ON public.identity_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Sistema inserta eventos de identidad"
  ON public.identity_events FOR INSERT
  WITH CHECK (true);

-- =============================================
-- TRIGGERS: Contadores automáticos
-- =============================================

-- Trigger para actualizar contador de likes en posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL THEN
    UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_post_likes
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Trigger para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_post_comments
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- =============================================
-- REALTIME: Habilitar para tablas clave
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.isabella_events;