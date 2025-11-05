import { Client } from "pg";

export default async function handler(req, res) {
  try {
    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    try {
      const schema = 'pet_portraits';
      const schemaExists = (await pg.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`, [schema])).rowCount > 0;
      const usersReg = (await pg.query(`SELECT to_regclass($1) AS r`, [`${schema}.users`])).rows[0]?.r;
      const evtReg = (await pg.query(`SELECT to_regclass($1) AS r`, [`${schema}.email_verification_tokens`])).rows[0]?.r;
      const pgcryptoPresent = (await pg.query(`SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') AS present`)).rows[0]?.present === true;

      const usersCols = usersReg ? (await pg.query(`
        SELECT column_name, column_default
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = 'users'
      `, [schema])).rows : [];
      const evtCols = evtReg ? (await pg.query(`
        SELECT column_name, column_default
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = 'email_verification_tokens'
      `, [schema])).rows : [];

      await pg.end();
      return res.json({
        ok: true,
        schema: schema,
        schema_exists: schemaExists,
        users_table: !!usersReg,
        email_verification_tokens_table: !!evtReg,
        pgcrypto_present: pgcryptoPresent,
        users_columns: usersCols,
        email_verification_tokens_columns: evtCols
      });
    } catch (dbErr) {
      await pg.end();
      throw dbErr;
    }
  } catch (e) {
    console.error("Diagnostics DB error:", e);
    return res.status(500).json({ ok: false, error: 'diagnostics_failed' });
  }
}