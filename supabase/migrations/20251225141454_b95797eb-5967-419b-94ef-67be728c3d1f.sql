-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'guardian', 'creator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    granted_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create decision_records table for DEKATEOTL governance
CREATE TABLE public.decision_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'low',
    status TEXT NOT NULL DEFAULT 'pending',
    actor_id UUID REFERENCES auth.users(id),
    affected_entity TEXT,
    details JSONB DEFAULT '{}',
    ethical_score NUMERIC(5,2),
    hash TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.decision_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guardians can view decision records"
ON public.decision_records
FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'guardian') OR
    public.has_role(auth.uid(), 'moderator')
);

CREATE POLICY "Guardians can create decision records"
ON public.decision_records
FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'guardian')
);

CREATE POLICY "Guardians can update decision records"
ON public.decision_records
FOR UPDATE
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'guardian')
);

-- Create consent_entries table for privacy ledger
CREATE TABLE public.consent_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    consent_type TEXT NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT false,
    purpose TEXT,
    data_categories TEXT[],
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consent_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consent"
ON public.consent_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consent"
ON public.consent_entries
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consent"
ON public.consent_entries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create audit_logs table for BookPI
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    action TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id),
    target_entity TEXT,
    target_id UUID,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    hash TEXT,
    verified BOOLEAN DEFAULT false,
    severity TEXT DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and auditors can view logs"
ON public.audit_logs
FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'guardian')
);

CREATE POLICY "System can insert logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create tamv_credits_ledger for economic transactions
CREATE TABLE public.tamv_credits_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    transaction_type TEXT NOT NULL,
    amount NUMERIC(18,8) NOT NULL,
    balance_before NUMERIC(18,8),
    balance_after NUMERIC(18,8),
    description TEXT,
    reference_id UUID,
    reference_type TEXT,
    hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tamv_credits_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
ON public.tamv_credits_ledger
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
ON public.tamv_credits_ledger
FOR INSERT
WITH CHECK (true);

-- Create dao_proposals table
CREATE TABLE public.dao_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    quorum INTEGER DEFAULT 100,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE,
    execution_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dao_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view proposals"
ON public.dao_proposals
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create proposals"
ON public.dao_proposals
FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their proposals"
ON public.dao_proposals
FOR UPDATE
USING (auth.uid() = author_id AND status = 'active');

-- Create dao_votes table
CREATE TABLE public.dao_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES public.dao_proposals(id) ON DELETE CASCADE NOT NULL,
    voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vote_type TEXT NOT NULL,
    voting_power INTEGER DEFAULT 1,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (proposal_id, voter_id)
);

ALTER TABLE public.dao_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
ON public.dao_votes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON public.dao_votes
FOR INSERT
WITH CHECK (auth.uid() = voter_id);

-- Create storage bucket for avatars and assets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('dreamspaces', 'dreamspaces', true);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Creators can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "DreamSpaces content is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'dreamspaces');

CREATE POLICY "Users can upload to their DreamSpaces"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dreamspaces' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantum_id TEXT,
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reputation_score NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_transactions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_contributions INTEGER DEFAULT 0;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_decision_records_updated_at
BEFORE UPDATE ON public.decision_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consent_entries_updated_at
BEFORE UPDATE ON public.consent_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dao_proposals_updated_at
BEFORE UPDATE ON public.dao_proposals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Assign default user role on profile creation
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profile_created_assign_role
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.assign_default_role();