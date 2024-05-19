import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const queryDbVersion = await database.query("SHOW server_version;");
  const dbVersion = queryDbVersion.rows[0].server_version;

  const queryMaxConection = await database.query("SHOW max_connections;");
  const maxConnections = queryMaxConection.rows[0].max_connections;

  const queryString =
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;";
  const params = [process.env.POSTGRES_DB];

  const queryActiveConnections = await database.query({
    text: queryString,
    values: params,
  });
  const activeConnections = queryActiveConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      db_version: dbVersion,
      max_connections: parseInt(maxConnections),
      active_connections: activeConnections,
      db_name: process.env.POSTGRES_DB,
    },
  });
}

export default status;
