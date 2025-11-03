-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for tournament status
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'live', 'completed');

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- Create news table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  prize TEXT NOT NULL,
  status tournament_status NOT NULL DEFAULT 'upcoming',
  registration_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT NOT NULL,
  team TEXT NOT NULL,
  image TEXT NOT NULL,
  wins INTEGER NOT NULL DEFAULT 0,
  kd TEXT NOT NULL,
  tournaments INTEGER NOT NULL DEFAULT 0,
  pr INTEGER NOT NULL DEFAULT 0,
  earnings TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Create prediction_campaigns table
CREATE TABLE public.prediction_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  fields JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.prediction_campaigns ENABLE ROW LEVEL SECURITY;

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.prediction_campaigns(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  twitch_id TEXT NOT NULL,
  responses JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for news (public read, admin write)
CREATE POLICY "Anyone can view news"
  ON public.news FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert news"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news"
  ON public.news FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tournaments (public read, admin write)
CREATE POLICY "Anyone can view tournaments"
  ON public.tournaments FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert tournaments"
  ON public.tournaments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tournaments"
  ON public.tournaments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tournaments"
  ON public.tournaments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for players (public read, admin write)
CREATE POLICY "Anyone can view players"
  ON public.players FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert players"
  ON public.players FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update players"
  ON public.players FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete players"
  ON public.players FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for prediction_campaigns (public read, admin write)
CREATE POLICY "Anyone can view prediction campaigns"
  ON public.prediction_campaigns FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert prediction campaigns"
  ON public.prediction_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update prediction campaigns"
  ON public.prediction_campaigns FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete prediction campaigns"
  ON public.prediction_campaigns FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for predictions (public read for all, anyone can submit)
CREATE POLICY "Anyone can view predictions"
  ON public.predictions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can insert predictions"
  ON public.predictions FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins can delete predictions"
  ON public.predictions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prediction_campaigns_updated_at
  BEFORE UPDATE ON public.prediction_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();