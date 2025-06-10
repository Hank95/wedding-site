// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    // Get your Resend API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    const domainEmail = '<onboarding@resend.dev>' // Replace with your domain email

    // Email to you (notification)
    const notificationEmail = {
      from: `Wedding RSVP ${domainEmail}`, // Replace with your domain
      to: ['hhpendleton@gmail.com'], // Replace with your email(s)
      subject: `New Wedding RSVP from ${record.name || 'Guest'}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background-color: #f1f4ed;">
          <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); padding: 30px; text-align: center;">
            <h1 style="color: #fefef9; margin: 0; font-size: 28px; font-weight: 300; font-family: 'Georgia', serif;">New RSVP Received! 💌</h1>
          </div>
          
          <div style="background: #fefef9; padding: 30px; margin: 0;">
            <div style="background: #f1f4ed; border-left: 4px solid #7c9264; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
              <h2 style="color: #3f5c22; margin: 0 0 15px 0; font-size: 20px; font-family: 'Georgia', serif;">${record.name || 'Anonymous Guest'}</h2>
              <p style="color: #5d7743; margin: 5px 0;"><strong>Email:</strong> ${record.email || 'Not provided'}</p>
            </div>
            
            <div style="display: grid; gap: 15px;">
              <div style="background: ${record.attending ? '#e3e9db' : '#f4f4b1'}; border: 1px solid ${record.attending ? '#b9c8a6' : '#f2f2a1'}; border-radius: 8px; padding: 15px;">
                <strong style="color: ${record.attending ? '#3f5c22' : '#856404'}; font-family: 'Georgia', serif;">
                  ${record.attending ? '✅ Attending' : '❌ Not Attending'}
                </strong>
              </div>
              
              ${record.dietary_restrictions ? `
                <div style="background: #fcfced; border: 1px solid #fafae1; border-radius: 8px; padding: 15px;">
                  <strong style="color: #7c9264; font-family: 'Georgia', serif;">🍽️ Dietary Restrictions:</strong>
                  <p style="margin: 5px 0 0 0; color: #5d7743;">${record.dietary_restrictions}</p>
                </div>
              ` : ''}
              
              ${record.message ? `
                <div style="background: #e3e9db; border: 1px solid #c7d3b8; border-radius: 8px; padding: 15px;">
                  <strong style="color: #3f5c22; font-family: 'Georgia', serif;">💬 Message:</strong>
                  <p style="margin: 5px 0 0 0; color: #5d7743; font-style: italic;">"${record.message}"</p>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #d5deca; text-align: center;">
              <p style="color: #7c9264; font-size: 14px; margin: 0;">
                📅 Submitted: ${new Date(record.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Email to the user (confirmation)
    const confirmationEmail = {
      from: `Nobska & Henry ${domainEmail}`, // Replace with your domain
      to: [record.email],
      subject: record.attending ? 'We can\'t wait to celebrate with you! 🎉' : 'Thank you for letting us know ❤️',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Georgia', serif; background-color: #f1f4ed;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #fefef9; margin: 0 0 10px 0; font-size: 32px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: 'Georgia', serif;">
              ${record.attending ? '🎉 You\'re Invited!' : '💕 Thank You'}
            </h1>
            <p style="color: #fefef9; margin: 0; font-size: 18px; opacity: 0.9;">
              ${record.attending ? 'We\'re so excited you\'ll be there!' : 'We appreciate you letting us know'}
            </p>
          </div>

          <!-- Main Content -->
          <div style="background: #fefef9; padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #3f5c22; margin: 0 0 10px 0; font-size: 24px; font-family: 'Georgia', serif;">
                Hello ${record.name}! 👋
              </h2>
              <p style="color: #5d7743; font-size: 16px; line-height: 1.6; margin: 0;">
                ${record.attending 
                  ? 'Thank you for your RSVP! We can\'t wait to celebrate our special day with you.' 
                  : 'Thank you for taking the time to respond to our invitation. We\'ll miss you on our special day, but we understand.'
                }
              </p>
            </div>

            <!-- RSVP Details Card -->
            <div style="background: #f1f4ed; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #d5deca;">
              <h3 style="color: #3f5c22; margin: 0 0 20px 0; font-size: 18px; text-align: center; font-family: 'Georgia', serif;">
                📋 Your RSVP Details
              </h3>
              
              <div style="display: grid; gap: 12px;">
                <div style="background: ${record.attending ? '#e3e9db' : '#fcfced'}; border-radius: 8px; padding: 15px; text-align: center;">
                  <strong style="color: ${record.attending ? '#3f5c22' : '#7c9264'}; font-size: 16px; font-family: 'Georgia', serif;">
                    ${record.attending ? '✅ Attending' : '❌ Unable to Attend'}
                  </strong>
                </div>
                
                ${record.dietary_restrictions ? `
                  <div style="background: #fcfced; border-radius: 8px; padding: 15px;">
                    <strong style="color: #7c9264; display: block; margin-bottom: 5px; font-family: 'Georgia', serif;">🍽️ Dietary Restrictions:</strong>
                    <span style="color: #5d7743;">${record.dietary_restrictions}</span>
                  </div>
                ` : ''}
                
                ${record.message ? `
                  <div style="background: #e3e9db; border-radius: 8px; padding: 15px;">
                    <strong style="color: #3f5c22; display: block; margin-bottom: 5px; font-family: 'Georgia', serif;">💬 Your Message:</strong>
                    <em style="color: #5d7743;">"${record.message}"</em>
                  </div>
                ` : ''}
              </div>
            </div>

            ${record.attending ? `
              <!-- Wedding Details -->
              <div style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); border-radius: 12px; padding: 25px; color: #fefef9; text-align: center; margin: 25px 0;">
                <h3 style="margin: 0 0 20px 0; font-size: 20px; font-family: 'Georgia', serif;">📅 Wedding Details</h3>
                <div style="display: grid; gap: 15px; text-align: left; max-width: 400px; margin: 0 auto;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">📅</span>
                    <div>
                      <strong>Date:</strong><br>
                      <span style="opacity: 0.9;">October 26, 2025</span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">🕐</span>
                    <div>
                      <strong>Ceremony:</strong><br>
                      <span style="opacity: 0.9;">5:00 PM</span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">📍</span>
                    <div>
                      <strong>Venue:</strong><br>
                      <span style="opacity: 0.9;">Legare Waring House<br>1500 Old Towne Rd, Charleston, SC 29407</span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">👔</span>
                    <div>
                      <strong>Dress Code:</strong><br>
                      <span style="opacity: 0.9;">Black Tie Optional</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Reception Info -->
              <div style="background: #f1f4ed; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #d5deca;">
                <h4 style="color: #3f5c22; margin: 0 0 10px 0; font-size: 16px; font-family: 'Georgia', serif;">🎉 Reception</h4>
                <p style="color: #5d7743; margin: 0; font-style: italic;">
                  Celebrate with us over dinner, drinks, and dancing immediately following the ceremony!
                </p>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 25px 0;">
                <div style="display: inline-block; margin: 10px;">
                  <a href="https://nobskaandhenry.com" style="background: linear-gradient(135deg, #7c9264 0%, #5d7743 100%); color: #fefef9; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(124, 146, 100, 0.3); font-family: 'Georgia', serif;">
                    🌐 Wedding Website
                  </a>
                </div>
                <div style="display: inline-block; margin: 10px;">
                  <a href="https://nobskaandhenry.com/registry" style="background: linear-gradient(135deg, #9aad85 0%, #7c9264 100%); color: #fefef9; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(154, 173, 133, 0.3); font-family: 'Georgia', serif;">
                    🎁 Gift Registry
                  </a>
                </div>
              </div>

              <!-- Calendar Invite -->
              <div style="background: #e3e9db; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #c7d3b8;">
                <h4 style="color: #3f5c22; margin: 0 0 15px 0; font-size: 16px; font-family: 'Georgia', serif;">📅 Add to Calendar</h4>
                <p style="color: #5d7743; margin: 0 0 15px 0; font-size: 14px;">
                  Save the date and never miss our special day!
                </p>
                <a href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Wedding//EN
BEGIN:VEVENT
UID:nobska-henry-wedding-2025@nobskaandhenry.com
DTSTART:20251026T210000Z
DTEND:20251027T020000Z
SUMMARY:Nobska & Henry's Wedding
DESCRIPTION:Join us as we exchange vows and begin our journey together. Reception with dinner, drinks, and dancing immediately following the ceremony!
LOCATION:Legare Waring House, 1500 Old Towne Rd, Charleston, SC 29407
URL:https://nobskaandhenry.com
END:VEVENT
END:VCALENDAR" style="background: #5d7743; color: #fefef9; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; font-family: 'Georgia', serif;">
                  📅 Download Calendar Event
                </a>
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
                ${record.attending 
                  ? 'We\'re counting down the days until we can celebrate with you!' 
                  : 'Even though you can\'t be there in person, you\'ll be in our thoughts on our special day.'
                }
              </p>
              <p style="color: #3f5c22; font-size: 18px; margin: 0; font-style: italic; font-family: 'Georgia', serif;">
                With love,<br>
                <strong style="color: #7c9264;">Nobska & Henry</strong> 💕
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Send notification email to you
    const notificationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationEmail),
    })

    // Send confirmation email to user (only if they provided an email)
    let confirmationResult = null
    if (record.email) {
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
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-rsvp-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
