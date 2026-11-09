-- Lock down SECURITY DEFINER functions so only the server (service_role) can call them.
--
-- Why: Postgres grants EXECUTE to everyone by default, so anyone holding the public anon key could call
-- /rest/v1/rpc/deduct_generation_credit (etc.) with ANOTHER user's id. These functions take p_user_id
-- as a parameter and run with elevated rights, so they must not be callable from the browser.
--
-- Safe because the app only calls them via supabaseAdmin (service role) in:
--   app/api/generate/route.ts            -> deduct_generation_credit
--   app/api/study/complete-session       -> update_study_streak
--   app/api/study/rate-card              -> record_card_confidence
--
-- handle_new_user is intentionally NOT touched: it is a trigger on new sign-ups and cannot be
-- called as an RPC, and changing it risks breaking account creation.
--
-- Run in the Supabase SQL editor. Safe to re-run.

do $$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('deduct_generation_credit', 'update_study_streak', 'record_card_confidence')
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', r.sig);
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;
end $$;

-- Verify: anon_can_run and logged_in_can_run should now be false for these three functions.
-- select p.proname, has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_run,
--        has_function_privilege('authenticated', p.oid, 'EXECUTE') as logged_in_can_run,
--        has_function_privilege('service_role', p.oid, 'EXECUTE') as server_can_run
-- from pg_proc p join pg_namespace n on n.oid = p.pronamespace
-- where n.nspname = 'public' order by p.proname;
