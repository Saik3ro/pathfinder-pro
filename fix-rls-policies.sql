-- Fix RLS policies to resolve TypeScript errors
-- These policies need to be updated to allow proper database operations

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own milestone progress" ON public.milestone_progress;
DROP POLICY IF EXISTS "Users can update own milestone progress" ON public.milestone_progress;
DROP POLICY IF EXISTS "Users can insert own learning decks" ON public.learning_decks;
DROP POLICY IF EXISTS "Users can update own learning decks" ON public.learning_decks;

-- Recreate profiles policies with proper permissions
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Recreate milestone_progress policies with proper permissions
CREATE POLICY "Users can insert own milestone progress"
  ON public.milestone_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestone progress"
  ON public.milestone_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Recreate learning_decks policies with proper permissions
CREATE POLICY "Users can insert own learning decks"
  ON public.learning_decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning decks"
  ON public.learning_decks FOR UPDATE
  USING (auth.uid() = user_id);
