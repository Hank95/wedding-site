// Enhanced RSVP notification function that handles multiple events
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GuestResponse {
  firstName: string
  lastName: string
  ceremony_reception_attending: boolean
  welcome_party_attending?: boolean
  rehearsal_dinner_attending?: boolean
  dietary_restrictions?: string
  message?: string
}

interface Invitation {
  id: string
  guests: Array<{
    firstName: string
    lastName: string
    position: number
  }>
  party_size: number
  is_welcome_party_invited: boolean
  is_rehearsal_dinner_invited: boolean
  email?: string | null
  phone?: string | null
}

interface RequestData {
  invitation: Invitation
  guestResponses: GuestResponse[]
  email: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { invitation, guestResponses, email }: RequestData = await req.json()
    
    // Get your Resend API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    const domainEmail = '<noreply@mail.nobskaandhenry.com>'

    // Build event attendance summary
    const eventSummary = []
    
    // Count attendance for each event
    const ceremonyAttending = guestResponses.filter(r => r.ceremony_reception_attending).length
    const ceremonyTotal = guestResponses.length
    
    if (ceremonyAttending > 0) {
      eventSummary.push(`✅ Ceremony & Reception: ${ceremonyAttending} of ${ceremonyTotal} guest(s)`)
    } else {
      eventSummary.push(`❌ Ceremony & Reception: No one attending`)
    }

    if (invitation.is_welcome_party_invited) {
      const welcomeAttending = guestResponses.filter(r => r.welcome_party_attending).length
      if (welcomeAttending > 0) {
        eventSummary.push(`✅ Welcome Party: ${welcomeAttending} of ${ceremonyTotal} guest(s)`)
      } else {
        eventSummary.push(`❌ Welcome Party: No one attending`)
      }
    }

    if (invitation.is_rehearsal_dinner_invited) {
      const rehearsalAttending = guestResponses.filter(r => r.rehearsal_dinner_attending).length
      if (rehearsalAttending > 0) {
        eventSummary.push(`✅ Rehearsal Dinner: ${rehearsalAttending} of ${ceremonyTotal} guest(s)`)
      } else {
        eventSummary.push(`❌ Rehearsal Dinner: No one attending`)
      }
    }

    // Determine if anyone is attending any event
    const isAttendingAny = guestResponses.some(r => 
      r.ceremony_reception_attending || r.welcome_party_attending || r.rehearsal_dinner_attending
    )

    // Get guest names for subject
    const guestNames = invitation.guests.map(g => `${g.firstName} ${g.lastName}`).join(' & ')
    
    // Email to couple (notification)
    const notificationEmail = {
      from: `Wedding RSVP ${domainEmail}`,
      to: ['nobskaandhenry2025@gmail.com'],
      subject: `New Wedding RSVP from ${guestNames}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background-color: #f1f4ed;">
          <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); padding: 30px; text-align: center;">
            <h1 style="color: #fefef9; margin: 0; font-size: 28px; font-weight: 300;">New RSVP Received! 💌</h1>
          </div>
          
          <div style="background: #fefef9; padding: 30px; margin: 0;">
            <div style="background: #f1f4ed; border-left: 4px solid #7c9264; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
              <h2 style="color: #3f5c22; margin: 0 0 15px 0; font-size: 20px;">${guestNames}</h2>
              <p style="color: #5d7743; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #5d7743; margin: 5px 0;"><strong>Party Size:</strong> ${invitation.party_size}</p>
              <div style="color: #5d7743; margin: 5px 0;">
                <strong>Guests:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                  ${invitation.guests.map(guest => `<li>${guest.firstName} ${guest.lastName}</li>`).join('')}
                </ul>
              </div>
            </div>
            
            <div style="background: #e3e9db; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <h3 style="color: #3f5c22; margin: 0 0 10px 0; font-size: 16px;">Event Responses:</h3>
              ${eventSummary.map(event => `<p style="margin: 5px 0; color: #5d7743;">${event}</p>`).join('')}
            </div>
            
            ${guestResponses.some(r => r.dietary_restrictions) ? `
              <div style="background: #fcfced; border: 1px solid #fafae1; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <strong style="color: #7c9264;">🍽️ Dietary Restrictions:</strong>
                ${guestResponses.filter(r => r.dietary_restrictions).map(r => 
                  `<p style="margin: 5px 0 0 0; color: #5d7743;"><strong>${r.firstName} ${r.lastName}:</strong> ${r.dietary_restrictions}</p>`
                ).join('')}
              </div>
            ` : ''}
            
            ${guestResponses.some(r => r.message) ? `
              <div style="background: #e3e9db; border: 1px solid #c7d3b8; border-radius: 8px; padding: 15px;">
                <strong style="color: #3f5c22;">💬 Messages:</strong>
                ${guestResponses.filter(r => r.message).map(r => 
                  `<p style="margin: 5px 0 0 0; color: #5d7743; font-style: italic;"><strong>${r.firstName} ${r.lastName}:</strong> "${r.message}"</p>`
                ).join('')}
              </div>
            ` : ''}
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #d5deca; text-align: center;">
              <p style="color: #7c9264; font-size: 14px; margin: 0;">
                📅 Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Email to the guest (confirmation)
    const confirmationEmail = {
      from: `Nobska & Henry ${domainEmail}`,
      to: [email],
      subject: isAttendingAny ? 'We can\'t wait to celebrate with you! 🎉' : 'Thank you for letting us know ❤️',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background-color: #f1f4ed;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #fefef9; margin: 0 0 10px 0; font-size: 32px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${isAttendingAny ? '🎉 You\'re Coming!' : '💕 Thank You'}
            </h1>
            <p style="color: #fefef9; margin: 0; font-size: 18px; opacity: 0.9;">
              ${isAttendingAny ? 'We\'re so excited to celebrate with you!' : 'We appreciate you letting us know'}
            </p>
          </div>

          <!-- Main Content -->
          <div style="background: #fefef9; padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #3f5c22; margin: 0 0 10px 0; font-size: 24px;">
                Hello ${invitation.guests.map(g => g.firstName).join(' & ')}! 👋
              </h2>
              <p style="color: #5d7743; font-size: 16px; line-height: 1.6; margin: 0;">
                ${isAttendingAny 
                  ? 'Thank you for your RSVP! Here\'s a summary of your response.' 
                  : 'Thank you for taking the time to respond to our invitation. We\'ll miss you at our celebration.'
                }
              </p>
            </div>

            <!-- RSVP Details Card -->
            <div style="background: #f1f4ed; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #d5deca;">
              <h3 style="color: #3f5c22; margin: 0 0 20px 0; font-size: 18px; text-align: center;">
                📋 Your RSVP Summary
              </h3>
              
              <div style="display: grid; gap: 12px;">
                ${eventSummary.map(event => `
                  <div style="background: ${event.includes('✅') ? '#e3e9db' : '#fcfced'}; border-radius: 8px; padding: 15px;">
                    <span style="color: #5d7743;">${event}</span>
                  </div>
                `).join('')}
                
                ${guestResponses.some(r => r.dietary_restrictions) ? `
                  <div style="background: #fcfced; border-radius: 8px; padding: 15px;">
                    <strong style="color: #7c9264; display: block; margin-bottom: 5px;">🍽️ Dietary Restrictions:</strong>
                    ${guestResponses.filter(r => r.dietary_restrictions).map(r => 
                      `<div style="margin: 5px 0;"><strong>${r.firstName} ${r.lastName}:</strong> ${r.dietary_restrictions}</div>`
                    ).join('')}
                  </div>
                ` : ''}
                
                ${guestResponses.some(r => r.message) ? `
                  <div style="background: #e3e9db; border-radius: 8px; padding: 15px;">
                    <strong style="color: #3f5c22; display: block; margin-bottom: 5px;">💬 Your Messages:</strong>
                    ${guestResponses.filter(r => r.message).map(r => 
                      `<div style="margin: 5px 0;"><strong>${r.firstName} ${r.lastName}:</strong> <em>"${r.message}"</em></div>`
                    ).join('')}
                  </div>
                ` : ''}
              </div>
            </div>

            ${isAttendingAny ? `
              <!-- Event Details -->
              <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); border-radius: 12px; padding: 25px; color: #fefef9; margin: 25px 0;">
                <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">📅 Event Details</h3>
                
                ${invitation.is_rehearsal_dinner_invited && guestResponses.some(r => r.rehearsal_dinner_attending) ? `
                  <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">🍽️ Rehearsal Dinner</h4>
                    <p style="margin: 0; opacity: 0.9;">
                      Friday, October 25th, 2025 at 5:00 PM<br>
                      The Oyster House<br>
                      66 State St, Charleston, SC 29401
                    </p>
                  </div>
                ` : ''}
                
                ${invitation.is_welcome_party_invited && guestResponses.some(r => r.welcome_party_attending) ? `
                  <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">🥂 Welcome Party</h4>
                    <p style="margin: 0; opacity: 0.9;">
                      Friday, October 25th, 2025 at 8:00 PM<br>
                      The Oyster House<br>
                      66 State St, Charleston, SC 29401
                    </p>
                  </div>
                ` : ''}
                
                ${guestResponses.some(r => r.ceremony_reception_attending) ? `
                  <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">💒 Wedding Ceremony & Reception</h4>
                    <p style="margin: 0; opacity: 0.9;">
                      Saturday, October 26th, 2025 at 5:00 PM<br>
                      Legare Waring House<br>
                      1500 Old Towne Rd, Charleston, SC 29407<br>
                      <em>Black Tie Optional</em>
                    </p>
                  </div>
                ` : ''}
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 25px 0;">
                <div style="display: inline-block; margin: 10px;">
                  <a href="https://nobskaandhenry.com" style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); color: #fefef9; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(124, 146, 100, 0.3);">
                    🌐 Wedding Website
                  </a>
                </div>
                <div style="display: inline-block; margin: 10px;">
                  <a href="https://nobskaandhenry.com/registry" style="background: linear-gradient(135deg, #9aad85 0%, #7c9264 100%); color: #fefef9; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(154, 173, 133, 0.3);">
                    🎁 Gift Registry
                  </a>
                </div>
              </div>

              <!-- Calendar Links -->
              <div style="background: #e3e9db; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #c7d3b8;">
                <h4 style="color: #3f5c22; margin: 0 0 15px 0; font-size: 16px;">📅 Add to Calendar</h4>
                <p style="color: #5d7743; margin: 0 0 15px 0; font-size: 14px;">
                  Save the date and never miss our events!
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

            <!-- Footer Message -->
            <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #d5deca;">
              <div style="background: #f1f4ed; border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid #e3e9db;">
                <p style="color: #5d7743; margin: 0; font-size: 14px;">
                  💡 <strong>Need to update your RSVP?</strong> Just reply to this email and we'll take care of it!
                </p>
              </div>
              <p style="color: #5d7743; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                ${isAttendingAny 
                  ? 'We\'re counting down the days until we can celebrate with you!' 
                  : 'Even though you can\'t be there in person, you\'ll be in our thoughts on our special day.'
                }
              </p>
              <p style="color: #3f5c22; font-size: 18px; margin: 0; font-style: italic;">
                With love,<br>
                <strong style="color: #7c9264;">Nobska & Henry</strong> 💕
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Send notification email to couple
    const notificationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationEmail),
    })

    // Send confirmation email to guest
    let confirmationResult = null
    if (email) {
      const confirmationResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmationEmail),
      })
      
      if (confirmationResponse.ok) {
        confirmationResult = await confirmationResponse.json()
      }
    }

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.text()
      throw new Error(`Resend API error: ${errorData}`)
    }

    const result = await notificationResponse.json()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationId: result.id,
        confirmationId: confirmationResult?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
    
  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})