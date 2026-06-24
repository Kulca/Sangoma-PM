# Sangoma Alpha: Supabase Schema

This directory contains the PostgreSQL schema for the Sangoma Alpha prediction market.

## How to Set Up

1. Create a new Supabase project.
2. Run the `schema_v2.sql` script in the Supabase SQL Editor.
3. Enable 'Realtime' for the tables mentioned in the script.
4. Copy the project URL and Anon Key to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Schema Overview

- **profiles**: Extends `auth.users` with a `balance_sngm` for Play Money.
- **markets**: Core market data (Loadshedding, Elections, etc.).
- **outcome_tokens**: Individual outcome contracts (e.g., 'Stage 1', 'Stage 2').
- **orders**: Central Limit Order Book (CLOB) entries.
- **trades**: History of executed trades.

## Real-time Logic

The frontend uses Supabase Realtime to subscribe to updates in the `markets` and `outcome_tokens` tables to reflect price/probability changes instantly without page refreshes.
