export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      districts: {
        Row: {
          city: string | null
          created_at: string
          id: number
          name: string
          tour: boolean | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: number
          name: string
          tour?: boolean | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: number
          name?: string
          tour?: boolean | null
        }
        Relationships: []
      }
      log_entries: {
        Row: {
          comments: string | null
          created_at: string
          date: string | null
          id: number
          production_id: number | null
          rating: number | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          date?: string | null
          id?: never
          production_id?: number | null
          rating?: number | null
          user_id?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          date?: string | null
          id?: never
          production_id?: number | null
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "log_entries_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      playwrights: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      productions: {
        Row: {
          created_at: string
          district: string | null
          id: number
          show: number | null
          tour: boolean | null
          tour_name: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          id?: number
          show?: number | null
          tour?: boolean | null
          tour_name?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          id?: number
          show?: number | null
          tour?: boolean | null
          tour_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productions_district_fkey"
            columns: ["district"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "productions_show_fkey"
            columns: ["show"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          last_name: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          last_name?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          last_name?: string | null
          username?: string | null
        }
        Relationships: []
      }
      shows: {
        Row: {
          created_at: string
          featured: boolean
          id: number
          image_url: string | null
          name: string
          playwright: number | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          featured?: boolean
          id?: number
          image_url?: string | null
          name: string
          playwright?: number | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          featured?: boolean
          id?: number
          image_url?: string | null
          name?: string
          playwright?: number | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "shows_playwright_fkey"
            columns: ["playwright"]
            isOneToOne: false
            referencedRelation: "playwrights"
            referencedColumns: ["id"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never