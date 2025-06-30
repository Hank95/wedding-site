// Script to send date correction emails to affected users
// Run this script to send corrected date information to users who RSVPed before the date fix

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'
import { readFileSync } from 'fs'

// Load environment variables from .env file
function loadEnvVars() {
  try {
    const envFile = readFileSync('.env', 'utf8')
    const lines = envFile.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=')
        }
      }
    }
  } catch (error) {
    console.error('❌ Could not read .env file')
  }
}

loadEnvVars()

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // You'll need the service role key for this

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is not set in .env file')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set')
  console.error('💡 You need to add this to your .env file. Get it from your Supabase dashboard under Settings > API')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

interface AffectedUser {
  rsvp_id: string
  guest_id: string
  email: string
  guest_first_name: string
  guest_last_name: string
  attending: boolean
  welcome_party_attending: boolean | null
  rehearsal_dinner_attending: boolean | null
  additional_guests: string[]
  is_welcome_party_invited: boolean
  is_rehearsal_dinner_invited: boolean
  rsvp_date: string
}

async function getAffectedUsers(): Promise<AffectedUser[]> {
  console.log('🔍 Querying for users who received emails with incorrect dates...')
  
  const { data, error } = await supabase
    .from('rsvps')
    .select(`
      id,
      guest_id,
      guest_first_name,
      guest_last_name,
      attending,
      welcome_party_attending,
      rehearsal_dinner_attending,
      created_at,
      guests!inner (
        email,
        guest_1_first_name,
        guest_1_last_name,
        guest_2_first_name,
        guest_2_last_name,
        guest_3_first_name,
        guest_3_last_name,
        guest_4_first_name,
        guest_4_last_name,
        is_welcome_party_invited,
        is_rehearsal_dinner_invited
      )
    `)
    .lt('created_at', '2025-06-29T00:00:00+00:00')
    .not('guests.email', 'is', null)
    .neq('guests.email', '')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching affected users:', error)
    throw error
  }

  if (!data || data.length === 0) {
    console.log('✅ No affected users found (all RSVPs were after the date fix)')
    return []
  }

  console.log(`📊 Found ${data.length} affected RSVP(s)`)

  // Transform the data
  const affectedUsers: AffectedUser[] = data.map((rsvp: any) => {
    const guest = rsvp.guests
    
    // Build list of additional guests (excluding the primary guest who already has their name in the RSVP)
    const additionalGuests: string[] = []
    if (guest.guest_2_first_name) {
      additionalGuests.push(`${guest.guest_2_first_name} ${guest.guest_2_last_name || ''}`.trim())
    }
    if (guest.guest_3_first_name) {
      additionalGuests.push(`${guest.guest_3_first_name} ${guest.guest_3_last_name || ''}`.trim())
    }
    if (guest.guest_4_first_name) {
      additionalGuests.push(`${guest.guest_4_first_name} ${guest.guest_4_last_name || ''}`.trim())
    }

    return {
      rsvp_id: rsvp.id,
      guest_id: rsvp.guest_id,
      email: guest.email,
      guest_first_name: rsvp.guest_first_name,
      guest_last_name: rsvp.guest_last_name,
      attending: rsvp.attending,
      welcome_party_attending: rsvp.welcome_party_attending,
      rehearsal_dinner_attending: rsvp.rehearsal_dinner_attending,
      additional_guests: additionalGuests,
      is_welcome_party_invited: guest.is_welcome_party_invited || false,
      is_rehearsal_dinner_invited: guest.is_rehearsal_dinner_invited || false,
      rsvp_date: rsvp.created_at
    }
  })

  return affectedUsers
}

async function sendCorrectionEmail(user: AffectedUser): Promise<boolean> {
  try {
    console.log(`📧 Sending correction email to ${user.email} (${user.guest_first_name} ${user.guest_last_name})...`)
    
    const response = await fetch(`${supabaseUrl}/functions/v1/send-date-correction-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        firstName: user.guest_first_name,
        lastName: user.guest_last_name,
        additionalGuests: user.additional_guests,
        isWelcomePartyInvited: user.is_welcome_party_invited,
        isRehearsalDinnerInvited: user.is_rehearsal_dinner_invited,
        ceremonyAttending: user.attending,
        welcomePartyAttending: user.welcome_party_attending,
        rehearsalDinnerAttending: user.rehearsal_dinner_attending,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to send email to ${user.email}:`, errorText)
      return false
    }

    const result = await response.json()
    console.log(`✅ Email sent successfully to ${user.email} (ID: ${result.emailId})`)
    return true
    
  } catch (error) {
    console.error(`❌ Error sending email to ${user.email}:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting date correction email process...\n')

  try {
    // Check environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }

    // Get affected users
    const affectedUsers = await getAffectedUsers()
    
    if (affectedUsers.length === 0) {
      console.log('🎉 No correction emails needed!')
      return
    }

    console.log(`\n📋 Found ${affectedUsers.length} user(s) who need correction emails:`)
    affectedUsers.forEach((user, index) => {
      const events = []
      if (user.attending) events.push('Ceremony')
      if (user.welcome_party_attending) events.push('Welcome Party')
      if (user.rehearsal_dinner_attending) events.push('Rehearsal Dinner')
      
      console.log(`  ${index + 1}. ${user.guest_first_name} ${user.guest_last_name} (${user.email})`)
      console.log(`     RSVPed: ${new Date(user.rsvp_date).toLocaleDateString()}`)
      console.log(`     Attending: ${events.join(', ') || 'None'}`)
      if (user.additional_guests.length > 0) {
        console.log(`     Additional guests: ${user.additional_guests.join(', ')}`)
      }
      console.log('')
    })

    // Confirm before sending
    console.log('⚠️  Ready to send correction emails to all affected users.')
    console.log('🛑 Make sure you have:')
    console.log('   1. Deployed the send-date-correction-email function to Supabase')
    console.log('   2. Set up the RESEND_API_KEY in your Supabase environment')
    console.log('   3. Verified the function is working')
    console.log('')
    
    // In a real implementation, you might want to add a confirmation prompt here
    // For now, we'll proceed automatically
    
    console.log('📤 Sending correction emails...\n')
    
    let successCount = 0
    let failureCount = 0
    
    for (const user of affectedUsers) {
      const success = await sendCorrectionEmail(user)
      if (success) {
        successCount++
      } else {
        failureCount++
      }
      
      // Add a small delay between emails to be nice to the email service
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log('\n📊 Summary:')
    console.log(`✅ Successfully sent: ${successCount} emails`)
    console.log(`❌ Failed to send: ${failureCount} emails`)
    console.log(`📧 Total processed: ${affectedUsers.length} users`)
    
    if (failureCount > 0) {
      console.log('\n⚠️  Some emails failed to send. Check the logs above for details.')
    } else {
      console.log('\n🎉 All correction emails sent successfully!')
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

if (import.meta.main) {
  main()
}