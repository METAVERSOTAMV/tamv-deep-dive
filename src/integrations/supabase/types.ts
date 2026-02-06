export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          points: number | null
          rarity: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points?: number | null
          rarity?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          event_type: string
          hash: string | null
          id: string
          ip_address: string | null
          severity: string | null
          target_entity: string | null
          target_id: string | null
          user_agent: string | null
          verified: boolean | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          hash?: string | null
          id?: string
          ip_address?: string | null
          severity?: string | null
          target_entity?: string | null
          target_id?: string | null
          user_agent?: string | null
          verified?: boolean | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          hash?: string | null
          id?: string
          ip_address?: string | null
          severity?: string | null
          target_entity?: string | null
          target_id?: string | null
          user_agent?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      bookpi_events: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          hash: string
          id: string
          ip_address: string | null
          payload: Json | null
          prev_hash: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          hash: string
          id?: string
          ip_address?: string | null
          payload?: Json | null
          prev_hash?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          hash?: string
          id?: string
          ip_address?: string | null
          payload?: Json | null
          prev_hash?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookpi_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          bookpi_hash: string | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bookpi_hash?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bookpi_hash?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_entries: {
        Row: {
          consent_type: string
          created_at: string
          data_categories: string[] | null
          expires_at: string | null
          granted: boolean
          hash: string | null
          id: string
          purpose: string | null
          revoked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          data_categories?: string[] | null
          expires_at?: string | null
          granted?: boolean
          hash?: string | null
          id?: string
          purpose?: string | null
          revoked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          data_categories?: string[] | null
          expires_at?: string | null
          granted?: boolean
          hash?: string | null
          id?: string
          purpose?: string | null
          revoked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dao_proposals: {
        Row: {
          author_id: string
          category: string
          created_at: string
          deadline: string
          description: string
          executed_at: string | null
          execution_hash: string | null
          id: string
          quorum: number | null
          status: string
          title: string
          updated_at: string
          votes_against: number | null
          votes_for: number | null
        }
        Insert: {
          author_id: string
          category: string
          created_at?: string
          deadline: string
          description: string
          executed_at?: string | null
          execution_hash?: string | null
          id?: string
          quorum?: number | null
          status?: string
          title: string
          updated_at?: string
          votes_against?: number | null
          votes_for?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          created_at?: string
          deadline?: string
          description?: string
          executed_at?: string | null
          execution_hash?: string | null
          id?: string
          quorum?: number | null
          status?: string
          title?: string
          updated_at?: string
          votes_against?: number | null
          votes_for?: number | null
        }
        Relationships: []
      }
      dao_votes: {
        Row: {
          created_at: string
          id: string
          proposal_id: string
          reason: string | null
          vote_type: string
          voter_id: string
          voting_power: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id: string
          reason?: string | null
          vote_type: string
          voter_id: string
          voting_power?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string
          reason?: string | null
          vote_type?: string
          voter_id?: string
          voting_power?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dao_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "dao_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_records: {
        Row: {
          actor_id: string | null
          affected_entity: string | null
          created_at: string
          decision_type: string
          details: Json | null
          ethical_score: number | null
          hash: string | null
          id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          actor_id?: string | null
          affected_entity?: string | null
          created_at?: string
          decision_type: string
          details?: Json | null
          ethical_score?: number | null
          hash?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          actor_id?: string | null
          affected_entity?: string | null
          created_at?: string
          decision_type?: string
          details?: Json | null
          ethical_score?: number | null
          hash?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dreamweave_spaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          scene_data: Json
          updated_at: string | null
          user_id: string | null
          visit_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          scene_data?: Json
          updated_at?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          scene_data?: Json
          updated_at?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dreamweave_spaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_events: {
        Row: {
          created_at: string | null
          event_type: string
          hash: string
          id: string
          ip_address: string | null
          metadata: Json | null
          prev_hash: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          hash: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          prev_hash?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          hash?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          prev_hash?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      isabella_events: {
        Row: {
          bookpi_hash: string | null
          content: string | null
          conversation_id: string | null
          created_at: string | null
          ethics_score: number | null
          event_type: string
          hitl_notes: string | null
          hitl_resolved_at: string | null
          hitl_resolved_by: string | null
          hitl_status: string | null
          id: string
          metadata: Json | null
          requires_hitl: boolean | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          bookpi_hash?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          ethics_score?: number | null
          event_type: string
          hitl_notes?: string | null
          hitl_resolved_at?: string | null
          hitl_resolved_by?: string | null
          hitl_status?: string | null
          id?: string
          metadata?: Json | null
          requires_hitl?: boolean | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          bookpi_hash?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          ethics_score?: number | null
          event_type?: string
          hitl_notes?: string | null
          hitl_resolved_at?: string | null
          hitl_resolved_by?: string | null
          hitl_status?: string | null
          id?: string
          metadata?: Json | null
          requires_hitl?: boolean | null
          severity?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "isabella_events_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "isabella_events_hitl_resolved_by_fkey"
            columns: ["hitl_resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "isabella_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_library: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          file_size: number | null
          filename: string
          height: number | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          mime_type: string | null
          thumbnail_url: string | null
          type: string
          url: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          filename: string
          height?: number | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          thumbnail_url?: string | null
          type: string
          url: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          filename?: string
          height?: number | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          thumbnail_url?: string | null
          type?: string
          url?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          emotional_state: Json | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          emotional_state?: Json | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          emotional_state?: Json | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          content: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          read: boolean | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          bookpi_hash: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          media_type: string | null
          media_url: string | null
          shares_count: number | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          bookpi_hash?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          bookpi_hash?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          quantum_id: string | null
          reputation_score: number | null
          tamv_credits: number | null
          total_contributions: number | null
          total_transactions: number | null
          updated_at: string | null
          username: string | null
          verification_level: number | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          quantum_id?: string | null
          reputation_score?: number | null
          tamv_credits?: number | null
          total_contributions?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          username?: string | null
          verification_level?: number | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          quantum_id?: string | null
          reputation_score?: number | null
          tamv_credits?: number | null
          total_contributions?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          username?: string | null
          verification_level?: number | null
        }
        Relationships: []
      }
      tamv_credits_ledger: {
        Row: {
          amount: number
          balance_after: number | null
          balance_before: number | null
          created_at: string
          description: string | null
          hash: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          description?: string | null
          hash?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          description?: string | null
          hash?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      tutorial_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress_percent: number | null
          tutorial_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          tutorial_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          tutorial_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_progress_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorials: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_seconds: number | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "guardian" | "creator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "guardian", "creator", "user"],
    },
  },
} as const
