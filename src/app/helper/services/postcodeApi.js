export async function createPostcode(code) {
  const res = await fetch("/api/form/postcode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcode: code }),
  });
  return res.json();
}

export async function getPostcodes() {
  const res = await fetch("/api/form/postcode");
  return res.json();
}

export async function updatePostcode(id, code) {
  const res = await fetch(`/api/form/postcode/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcode: code }),
  });
  return res.json();
}

export async function deletePostcode(id) {
  const res = await fetch(`/api/form/postcode/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
