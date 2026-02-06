-- ========================================
-- TAMV PRODUCTION SECURITY & FEATURES
-- ========================================

-- Sistema de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'system', 'achievement', 'transaction')),
    title TEXT NOT NULL,
    content TEXT,
    read BOOLEAN DEFAULT FALSE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reference_type TEXT,
    reference_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users mark own notifications read"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Sistema de tutoriales/onboarding
CREATE TABLE IF NOT EXISTS public.tutorials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('getting_started', 'economy', 'social', 'xr', 'security', 'governance', 'isabella')),
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutorials publicly readable"
ON public.tutorials FOR SELECT
USING (is_active = true);

-- Tutorial progress por usuario
CREATE TABLE IF NOT EXISTS public.tutorial_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tutorial_id UUID NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    progress_percent INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tutorial_id)
);

ALTER TABLE public.tutorial_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own progress"
ON public.tutorial_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users create own progress"
ON public.tutorial_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
ON public.tutorial_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Sistema de medios (fotos, videos, audios)
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    filename TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    duration_seconds INTEGER,
    width INTEGER,
    height INTEGER,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own media"
ON public.media_library FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users create own media"
ON public.media_library FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own media"
ON public.media_library FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_media_user ON public.media_library(user_id, type);

-- Logros y achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('social', 'economy', 'governance', 'xr', 'creator', 'special')),
    points INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements publicly readable"
ON public.achievements FOR SELECT
USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user achievements"
ON public.user_achievements FOR SELECT
USING (true);

CREATE POLICY "System inserts achievements"
ON public.user_achievements FOR INSERT
WITH CHECK (true);

-- Activar realtime para notificaciones
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Insertar tutoriales base
INSERT INTO public.tutorials (title, description, category, difficulty, sort_order) VALUES
('Bienvenido a TAMV', 'Introducción al metaverso de creadores', 'getting_started', 'beginner', 1),
('Tu Identidad ID-NVIDA', 'Configura tu identidad soberana', 'security', 'beginner', 2),
('Conversa con Isabella', 'Aprende a usar la IA emocional', 'isabella', 'beginner', 3),
('TAMV Credits Básico', 'Entendiendo la economía TAU', 'economy', 'beginner', 4),
('Crea tu primer espacio 3D', 'Introducción a DreamSpaces', 'xr', 'intermediate', 5),
('Gobernanza DAO', 'Participa en decisiones comunitarias', 'governance', 'intermediate', 6),
('Seguridad Avanzada', 'Protocolos ANUBIS y DEKATEOTL', 'security', 'advanced', 7)
ON CONFLICT DO NOTHING;

-- Insertar achievements base
INSERT INTO public.achievements (code, name, description, category, points, rarity) VALUES
('first_login', 'Bienvenido', 'Primer acceso al TAMV', 'social', 10, 'common'),
('first_post', 'Creador Inicial', 'Publicaste tu primer contenido', 'creator', 25, 'common'),
('first_like', 'Apoyador', 'Diste tu primer like', 'social', 5, 'common'),
('first_comment', 'Conversador', 'Tu primer comentario', 'social', 10, 'common'),
('isabella_chat', 'Amigo de Isabella', 'Conversaste con Isabella AI', 'special', 50, 'uncommon'),
('earn_100tc', 'Economista', 'Ganaste 100 TAMV Credits', 'economy', 100, 'uncommon'),
('guardian_approved', 'Ciudadano Verificado', 'Un guardián aprobó tu acción', 'governance', 200, 'rare'),
('dreamspace_creator', 'Arquitecto Digital', 'Creaste un espacio 3D', 'xr', 150, 'rare'),
('founder_member', 'Fundador', 'Miembro desde el lanzamiento', 'special', 500, 'legendary')
ON CONFLICT (code) DO NOTHING;