const BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {

  }

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      "در ارتباط با سرور مشکلی پیش آمد.";
    throw new Error(message);
  }

  return data;
}

// Login 
export async function loginRequest(username, password) {
  const res = await fetch(`${BASE_URL}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);

  return {
    accessToken: data.access,
    refreshToken: data.refresh,
  };
}

// GET /api/courses/
export async function fetchCourses(accessToken) {
  const res = await fetch(`${BASE_URL}/api/courses/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(res);
}

// POST /api/courses/
export async function createCourse(accessToken, coursePayload) {
  const res = await fetch(`${BASE_URL}/api/courses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(coursePayload),
  });

  return handleResponse(res);
}

// PUT /api/courses/:id/
export async function updateCourse(accessToken, courseId, coursePayload) {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/`, {
    method: "PUT", // اگر بک‌اندت PATCH می‌خواهد، این را به "PATCH" تغییر بده
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(coursePayload),
  });

  return handleResponse(res);
}

// DELETE /api/courses/:id/
export async function deleteCourse(accessToken, courseId) {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {}

    const message =
      (data && (data.detail || data.message)) ||
      "حذف درس با مشکل مواجه شد.";
    throw new Error(message);
  }

  return true;
}
