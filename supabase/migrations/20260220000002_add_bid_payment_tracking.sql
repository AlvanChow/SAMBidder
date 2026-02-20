/*
  # Add Payment Tracking to Bids

  Adds columns to the bids table to record when a proposal export
  was paid for via Stripe. Used by the billing history UI.

  ## New Columns

  - paid_at: timestamp when the Stripe checkout.session.completed event fired
  - stripe_session_id: the Stripe checkout session ID for reference
*/

ALTER TABLE bids ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE bids ADD COLUMN IF NOT EXISTS stripe_session_id text DEFAULT '';
