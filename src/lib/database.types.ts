export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      completions: {
        Row: {
          completed_on: string
          created_at: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_on: string
          created_at?: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_on?: string
          created_at?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'completions_habit_id_fkey'
            columns: ['habit_id']
            isOneToOne: false
            referencedRelation: 'habits'
            referencedColumns: ['id']
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          name: string
          scheduled_days: number[] | null
          sort_order: number
          time_label: string | null
          type: Database['public']['Enums']['habit_type']
          updated_at: string
          user_id: string
          weekly_target: number | null
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          name?: string
          scheduled_days?: number[] | null
          sort_order?: number
          time_label?: string | null
          type: Database['public']['Enums']['habit_type']
          updated_at?: string
          user_id: string
          weekly_target?: number | null
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          name?: string
          scheduled_days?: number[] | null
          sort_order?: number
          time_label?: string | null
          type?: Database['public']['Enums']['habit_type']
          updated_at?: string
          user_id?: string
          weekly_target?: number | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          emoji: string | null
          horizon: Database['public']['Enums']['goal_horizon']
          id: string
          sort_order: number
          status: Database['public']['Enums']['goal_status']
          target_steps: number | null
          title: string
          updated_at: string
          user_id: string
          why: string | null
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          horizon: Database['public']['Enums']['goal_horizon']
          id?: string
          sort_order?: number
          status?: Database['public']['Enums']['goal_status']
          target_steps?: number | null
          title: string
          updated_at?: string
          user_id: string
          why?: string | null
        }
        Update: {
          created_at?: string
          emoji?: string | null
          horizon?: Database['public']['Enums']['goal_horizon']
          id?: string
          sort_order?: number
          status?: Database['public']['Enums']['goal_status']
          target_steps?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          why?: string | null
        }
        Relationships: []
      }
      goal_steps: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          logged_on: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          logged_on?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          logged_on?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'goal_steps_goal_id_fkey'
            columns: ['goal_id']
            isOneToOne: false
            referencedRelation: 'goals'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      habit_type: 'daily' | 'scheduled' | 'weekly_target'
      goal_horizon: 'short' | 'long'
      goal_status: 'active' | 'reached'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
