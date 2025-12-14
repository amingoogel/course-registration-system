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

export async function fetchPrerequisites(accessToken) {
  const res = await fetch(`${BASE_URL}/api/prerequisites/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(res);
}

// POST /api/prerequisites/
export async function createPrerequisite(accessToken, prerequisitePayload) {
  const res = await fetch(`${BASE_URL}/api/prerequisites/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(prerequisitePayload),
  });

  return handleResponse(res);
}

// DELETE /api/prerequisites/:id/
export async function deletePrerequisite(accessToken, prerequisiteId) {
  const res = await fetch(
    `${BASE_URL}/api/prerequisites/${prerequisiteId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {}

    const message =
      (data && (data.detail || data.message)) ||
      "حذف پیش‌نیاز با مشکل مواجه شد.";
    throw new Error(message);
  }

  return true;
}

// =======================
// UNIT LIMITS API
// =======================

// GET /api/unit-limits/1/
export async function fetchUnitLimit(accessToken) {
  const res = await fetch(`${BASE_URL}/api/unit-limits/1/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // اگر هنوز ساخته نشده باشد (مثلاً 404)
  if (res.status === 404) return null;

  return handleResponse(res);
}

// POST /api/unit-limits/
export async function createUnitLimit(accessToken, payload) {
  const res = await fetch(`${BASE_URL}/api/unit-limits/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// PUT /api/unit-limits/1/
export async function updateUnitLimit(accessToken, payload) {
  const res = await fetch(`${BASE_URL}/api/unit-limits/1/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}
// ================= STUDENTS =================

// POST register student
export async function registerStudent(accessToken, payload) {
  const res = await fetch(
    `${BASE_URL}/api/users/register/register-student/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(res);
}

// GET students
export async function fetchStudents(accessToken) {
  const res = await fetch(`${BASE_URL}/api/users/students/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// DELETE student
export async function deleteStudent(accessToken, id) {
  const res = await fetch(`${BASE_URL}/api/users/students/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// ================= PROFESSORS =================

// POST register professor
export async function registerProfessor(accessToken, payload) {
  const res = await fetch(
    `${BASE_URL}/api/users/register/register-professor/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(res);
}

// GET professors
export async function fetchProfessors(accessToken) {
  const res = await fetch(`${BASE_URL}/api/users/professors/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// DELETE professor
export async function deleteProfessor(accessToken, id) {
  const res = await fetch(
    `${BASE_URL}/api/users/professors/${id}/`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return handleResponse(res);
}
