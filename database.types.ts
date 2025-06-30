export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_us: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name?: string
          subject?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      guest_book: {
        Row: {
          created_at: string | null
          entry: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          entry: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          entry?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string | null
          email: string | null
          guest_1_first_name: string
          guest_1_last_name: string
          guest_2_first_name: string | null
          guest_2_last_name: string | null
          guest_3_first_name: string | null
          guest_3_last_name: string | null
          guest_4_first_name: string | null
          guest_4_last_name: string | null
          id: string
          is_rehearsal_dinner_invited: boolean | null
          is_welcome_party_invited: boolean | null
          party_size: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          guest_1_first_name: string
          guest_1_last_name: string
          guest_2_first_name?: string | null
          guest_2_last_name?: string | null
          guest_3_first_name?: string | null
          guest_3_last_name?: string | null
          guest_4_first_name?: string | null
          guest_4_last_name?: string | null
          id?: string
          is_rehearsal_dinner_invited?: boolean | null
          is_welcome_party_invited?: boolean | null
          party_size?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          guest_1_first_name?: string
          guest_1_last_name?: string
          guest_2_first_name?: string | null
          guest_2_last_name?: string | null
          guest_3_first_name?: string | null
          guest_3_last_name?: string | null
          guest_4_first_name?: string | null
          guest_4_last_name?: string | null
          id?: string
          is_rehearsal_dinner_invited?: boolean | null
          is_welcome_party_invited?: boolean | null
          party_size?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      guests_backup: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_rehearsal_dinner_invited: boolean | null
          is_welcome_party_invited: boolean | null
          last_name: string | null
          party_size: number | null
          phone: string | null
          plus_one_first_name: string | null
          plus_one_last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          is_rehearsal_dinner_invited?: boolean | null
          is_welcome_party_invited?: boolean | null
          last_name?: string | null
          party_size?: number | null
          phone?: string | null
          plus_one_first_name?: string | null
          plus_one_last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          is_rehearsal_dinner_invited?: boolean | null
          is_welcome_party_invited?: boolean | null
          last_name?: string | null
          party_size?: number | null
          phone?: string | null
          plus_one_first_name?: string | null
          plus_one_last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attending: boolean
          created_at: string | null
          dietary_restrictions: string | null
          email: string | null
          guest_first_name: string
          guest_id: string
          guest_last_name: string
          id: string
          message: string | null
          rehearsal_dinner_attending: boolean | null
          updated_at: string | null
          welcome_party_attending: boolean | null
        }
        Insert: {
          attending?: boolean
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          guest_first_name: string
          guest_id: string
          guest_last_name: string
          id?: string
          message?: string | null
          rehearsal_dinner_attending?: boolean | null
          updated_at?: string | null
          welcome_party_attending?: boolean | null
        }
        Update: {
          attending?: boolean
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          guest_first_name?: string
          guest_id?: string
          guest_last_name?: string
          id?: string
          message?: string | null
          rehearsal_dinner_attending?: boolean | null
          updated_at?: string | null
          welcome_party_attending?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps_backup: {
        Row: {
          attending: boolean | null
          created_at: string | null
          dietary_restrictions: string | null
          email: string | null
          guest_count_ceremony: number | null
          guest_count_rehearsal: number | null
          guest_count_welcome: number | null
          guest_id: string | null
          id: string | null
          message: string | null
          name: string | null
          plus_one_first_name: string | null
          plus_one_last_name: string | null
          rehearsal_dinner_attending: boolean | null
          updated_at: string | null
          welcome_party_attending: boolean | null
        }
        Insert: {
          attending?: boolean | null
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          guest_count_ceremony?: number | null
          guest_count_rehearsal?: number | null
          guest_count_welcome?: number | null
          guest_id?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
          plus_one_first_name?: string | null
          plus_one_last_name?: string | null
          rehearsal_dinner_attending?: boolean | null
          updated_at?: string | null
          welcome_party_attending?: boolean | null
        }
        Update: {
          attending?: boolean | null
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          guest_count_ceremony?: number | null
          guest_count_rehearsal?: number | null
          guest_count_welcome?: number | null
          guest_id?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
          plus_one_first_name?: string | null
          plus_one_last_name?: string | null
          rehearsal_dinner_attending?: boolean | null
          updated_at?: string | null
          welcome_party_attending?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      migrate_existing_rsvps_to_guests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_guests_by_name: {
        Args: { search_term?: string }
        Returns: {
          id: string
          guest_1_first_name: string
          guest_1_last_name: string
          guest_2_first_name: string
          guest_2_last_name: string
          guest_3_first_name: string
          guest_3_last_name: string
          guest_4_first_name: string
          guest_4_last_name: string
          party_size: number
          is_welcome_party_invited: boolean
          is_rehearsal_dinner_invited: boolean
          email: string
          phone: string
          similarity_score: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
