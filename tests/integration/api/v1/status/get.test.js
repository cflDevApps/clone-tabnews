test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.db_version).toContain("16.2");
  expect(responseBody.dependencies.max_connections).toEqual(100);
  expect(responseBody.dependencies.active_connections).toEqual(1);
  console.log(responseBody);
});
