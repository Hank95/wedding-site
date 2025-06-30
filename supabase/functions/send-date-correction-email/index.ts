// Function to send date correction emails to users who received incorrect dates
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CorrectionEmailData {
  email: string
  firstName: string
  lastName?: string
  additionalGuests?: string[]
  isWelcomePartyInvited: boolean
  isRehearsalDinnerInvited: boolean
  ceremonyAttending: boolean
  welcomePartyAttending?: boolean
  rehearsalDinnerAttending?: boolean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const data: CorrectionEmailData = await req.json()
    
    // Get your Resend API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    const domainEmail = '<noreply@mail.nobskaandhenry.com>'

    // Build guest names
    const allGuests = data.additionalGuests 
      ? [data.firstName + (data.lastName ? ` ${data.lastName}` : ''), ...data.additionalGuests]
      : [data.firstName + (data.lastName ? ` ${data.lastName}` : '')]
    
    const guestNames = allGuests.join(' & ')
    const firstNames = allGuests.map(name => name.split(' ')[0]).join(' & ')

    // Determine which events they're attending
    const attendingEvents = []
    if (data.ceremonyAttending) attendingEvents.push('Wedding Ceremony & Reception')
    if (data.welcomePartyAttending) attendingEvents.push('Welcome Party')
    if (data.rehearsalDinnerAttending) attendingEvents.push('Rehearsal Dinner')

    const isAttendingAny = attendingEvents.length > 0

    // Date correction email
    const correctionEmail = {
      from: `Nobska & Henry ${domainEmail}`,
      to: [data.email],
      subject: '📅 Important Date & Address Correction for Our Wedding Events',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background-color: #f1f4ed;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #fefef9; margin: 0 0 10px 0; font-size: 32px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              📅 Date & Address Correction
            </h1>
            <p style="color: #fefef9; margin: 0; font-size: 18px; opacity: 0.9;">
              Important updates about our wedding events
            </p>
          </div>

          <!-- Main Content -->
          <div style="background: #fefef9; padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #3f5c22; margin: 0 0 10px 0; font-size: 24px;">
                Hello ${firstNames}! 👋
              </h2>
              <p style="color: #5d7743; font-size: 16px; line-height: 1.6; margin: 0;">
                We wanted to reach out with an important correction about the days of our wedding events.
              </p>
            </div>

            <!-- Correction Notice -->
            <div style="background: linear-gradient(135deg, #fcfced 0%, #fafae1 100%); border: 2px solid #f0e68c; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
              <h3 style="color: #b8860b; margin: 0 0 15px 0; font-size: 20px;">
                ⚠️ Correction Notice
              </h3>
              <p style="color: #8b7355; margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
                We discovered errors in our previous email. 
                Please note the <strong>corrected information</strong> below:
              </p>
              
              <!-- Date Correction -->
              <div style="background: #fff; border: 1px solid #e6d8a6; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: #b8860b; margin: 0 0 10px 0; font-size: 16px;">📅 Days of the Week</h4>
                <p style="color: #8b4513; margin: 0; font-size: 14px; text-decoration: line-through;">
                  <strong>Previous (Incorrect):</strong> Friday, Oct 25th & Saturday, Oct 26th
                </p>
                <p style="color: #2d5016; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">
                  <strong>✅ Correct:</strong> Saturday, Oct 25th & Sunday, Oct 26th
                </p>
              </div>
              
              <!-- Address Correction -->
              <div style="background: #fff; border: 1px solid #e6d8a6; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: #b8860b; margin: 0 0 10px 0; font-size: 16px;">📍 The Oyster House Address</h4>
                <p style="color: #8b4513; margin: 0; font-size: 14px; text-decoration: line-through;">
                  <strong>Previous (Incorrect):</strong> 66 State St, Charleston, SC 29401
                </p>
                <p style="color: #2d5016; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">
                  <strong>✅ Correct:</strong> 35 S Market St, Charleston, SC 29401
                </p>
              </div>
            </div>

            ${isAttendingAny ? `
              <!-- Corrected Event Details -->
              <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); border-radius: 12px; padding: 25px; color: #fefef9; margin: 25px 0;">
                <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">📅 Corrected Event Details</h3>
                
                ${data.isRehearsalDinnerInvited && data.rehearsalDinnerAttending ? `
                  <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">🍽️ Rehearsal Dinner</h4>
                    <p style="margin: 0; opacity: 0.9;">
                      <strong>Saturday, October 25th, 2025 at 5:00 PM</strong><br>
                      The Oyster House<br>
                      35 S Market St, Charleston, SC 29401
                    </p>
                  </div>
                ` : ''}
                
                ${data.isWelcomePartyInvited && data.welcomePartyAttending ? `
                  <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">🥂 Welcome Party</h4>
                    <p style="margin: 0; opacity: 0.9;">
                      <strong>Saturday, October 25th, 2025 at 8:00 PM</strong><br>
                      The Oyster House<br>
                      35 S Market St, Charleston, SC 29401
                    </p>
                  </div>
                ` : ''}
                
                ${data.ceremonyAttending ? `
                  <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">💒 Wedding Ceremony & Reception</h4>
                    <p style="margin: 0; opacity: 0.9;">
                      <strong>Sunday, October 26th, 2025 at 5:00 PM</strong><br>
                      Legare Waring House<br>
                      1500 Old Towne Rd, Charleston, SC 29407<br>
                      <em>Black Tie Optional</em>
                    </p>
                  </div>
                ` : ''}
              </div>

              <!-- Updated Calendar Links -->
              <div style="background: #e3e9db; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #c7d3b8;">
                <h4 style="color: #3f5c22; margin: 0 0 15px 0; font-size: 16px;">📅 Update Your Calendar</h4>
                <p style="color: #5d7743; margin: 0 0 15px 0; font-size: 14px;">
                  Please update your calendar with the corrected dates!
                </p>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                  <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nobska%20%26%20Henry%27s%20Wedding&dates=20251026T170000/20251026T230000&details=Join%20us%20for%20our%20wedding%20celebration!&location=Legare%20Waring%20House%2C%201500%20Old%20Towne%20Rd%2C%20Charleston%2C%20SC%2029407" target="_blank" style="background: #5d7743; color: #fefef9; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block;">
                    📅 Google Calendar
                  </a>
                  <a href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Nobska%20%26%20Henry%27s%20Wedding&startdt=2025-10-26T17%3A00%3A00&enddt=2025-10-26T23%3A00%3A00&body=Join%20us%20for%20our%20wedding%20celebration!&location=Legare%20Waring%20House%2C%201500%20Old%20Towne%20Rd%2C%20Charleston%2C%20SC%2029407" target="_blank" style="background: #7c9264; color: #fefef9; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block;">
                    📅 Outlook
                  </a>
                  <a href="https://nobskaandhenry.com/calendar/wedding.ics" target="_blank" style="background: #9aad85; color: #fefef9; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 12px; display: inline-block;">
                    📅 Download .ics
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- Apology and Next Steps -->
            <div style="background: #f1f4ed; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e3e9db; text-align: center;">
              <h4 style="color: #3f5c22; margin: 0 0 15px 0; font-size: 16px;">🙏 Our Sincere Apologies</h4>
              <p style="color: #5d7743; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                We apologize for any confusion these errors may have caused. The event dates (October 25th & 26th) 
                remain the same, but the days of the week and The Oyster House address were incorrect in our previous email.
              </p>
              <p style="color: #5d7743; margin: 0; font-size: 14px;">
                💡 <strong>Questions or concerns?</strong> Just reply to this email and we'll help clarify anything!
              </p>
            </div>

            <!-- Footer Message -->
            <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #d5deca;">
              <p style="color: #5d7743; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                ${isAttendingAny 
                  ? 'Thank you for understanding, and we can\'t wait to celebrate with you on the correct dates!' 
                  : 'Thank you for your understanding regarding this correction.'
                }
              </p>
              <p style="color: #3f5c22; font-size: 18px; margin: 0; font-style: italic;">
                With love and apologies,<br>
                <strong style="color: #7c9264;">Nobska & Henry</strong> 💕
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Send the correction email
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(correctionEmail),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Resend API error: ${errorData}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: result.id,
        sentTo: data.email,
        guestNames: guestNames
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
    
  } catch (error) {
    console.error('Error sending correction email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})