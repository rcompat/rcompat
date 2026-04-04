import test from "#index";
import intercept from "#intercept";

const base = "https://api.example.com";

test.case("calls() counts matched requests", async assert => {
  using api = intercept(base, setup => {
    setup.post("/echo", () => ({ ok: true }));
  });

  await fetch(`${base}/echo`, { method: "POST" });
  await fetch(`${base}/echo`, { method: "POST" });

  assert(api.calls("/echo")).equals(2);
});

test.case("calls() only counts matching path", async assert => {
  using api = intercept(base, setup => {
    setup.get("/a", () => ({ ok: true }));
    setup.get("/b", () => ({ ok: true }));
  });

  await fetch(`${base}/a`);
  await fetch(`${base}/a`);
  await fetch(`${base}/b`);

  assert(api.calls("/a")).equals(2);
  assert(api.calls("/b")).equals(1);
});

test.case("requests() returns the actual Request objects", async assert => {
  using api = intercept(base, setup => {
    setup.post("/echo", () => ({ ok: true }));
  });

  await fetch(`${base}/echo`, { method: "POST", body: JSON.stringify({ id: 1 }) });

  assert(api.requests("/echo").length).equals(1);
  assert(api.requests("/echo")[0].method).equals("POST");
});

test.case("unregistered path on intercepted origin throws", async assert => {
  using _ = intercept(base, setup => {
    setup.get("/known", () => ({ ok: true }));
  });

  let threw = false;
  try {
    await fetch(`${base}/unknown`);
  } catch {
    threw = true;
  }

  assert(threw).true();
});

test.case("restore() reinstates original fetch", assert => {
  const original = globalThis.fetch;

  const api = intercept(base, setup => {
    setup.get("/", () => ({ ok: true }));
  });

  api.restore();

  assert(globalThis.fetch).equals(original);
});

test.case("multiple intercepts stack and unwind correctly", async assert => {
  const base2 = "https://api.other.com";

  using a = intercept(base, setup => {
    setup.get("/a", () => ({ from: "a" }));
  });

  using b = intercept(base2, setup => {
    setup.get("/b", () => ({ from: "b" }));
  });

  await fetch(`${base}/a`);
  await fetch(`${base2}/b`);

  assert(a.calls("/a")).equals(1);
  assert(b.calls("/b")).equals(1);
});

test.case("response body matches handler return value", async assert => {
  using api = intercept(base, setup => {
    setup.get("/user", () => ({ id: 1, name: "alice" }));
  });

  const response = await fetch(`${base}/user`);
  const body = await response.json();

  assert(body).equals({ id: 1, name: "alice" });
});

test.case("method mismatch on same path throws", async assert => {
  using _ = intercept(base, setup => {
    setup.post("/data", () => ({ ok: true }));
  });

  let threw = false;
  try {
    await fetch(`${base}/data`, { method: "GET" });
  } catch {
    threw = true;
  }

  assert(threw).true();
});

test.case("calls() returns 0 for unvisited path", async assert => {
  using api = intercept(base, setup => {
    setup.get("/visited", () => ({ ok: true }));
    setup.get("/unvisited", () => ({ ok: true }));
  });

  await fetch(`${base}/visited`);

  assert(api.calls("/unvisited")).equals(0);
});

test.case("using restores original fetch", async assert => {
  const original = globalThis.fetch;

  {
    using _ = intercept(base, setup => {
      setup.get("/", () => ({ ok: true }));
    });

    assert(globalThis.fetch).nequals(original);
  }

  assert(globalThis.fetch).equals(original);
});
