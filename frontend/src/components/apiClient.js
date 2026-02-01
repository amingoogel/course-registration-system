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

// =======================
// AUTH / CURRENT USER
// =======================

// GET /api/users/me/
export async function fetchMe(accessToken) {
  const res = await fetch(`${BASE_URL}/api/users/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(res);
}

// GET /api/users/login-history/
export async function fetchLoginHistory(accessToken) {
  const res = await fetch(`${BASE_URL}/api/users/login-history/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(res);
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

// GET /api/courses-with-prerequisites/
export async function fetchCoursesWithPrerequisites(accessToken) {
  const res = await fetch(`${BASE_URL}/api/courses-with-prerequisites/`, {
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

// ✅ جدید: GET /api/unit-limit/
export async function fetchUnitLimit(accessToken) {
  const res = await fetch(`${BASE_URL}/api/unit-limit/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // اگر هنوز ساخته نشده باشد (مثلاً 404)
  if (res.status === 404) return null;

  return handleResponse(res);
}

// ✅ جدید: POST /api/unit-limit/
export async function createUnitLimit(accessToken, payload) {
  const res = await fetch(`${BASE_URL}/api/unit-limit/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ✅ بک‌اند جدید با POST هم آپدیت می‌کند؛ این را نگه می‌داریم برای سازگاری.
export async function updateUnitLimit(accessToken, payload) {
  const res = await fetch(`${BASE_URL}/api/unit-limit/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// =======================
// TERMS
// =======================

// GET /api/terms/
export async function fetchTerms(accessToken) {
  const res = await fetch(`${BASE_URL}/api/terms/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// GET /api/terms/:id/
export async function fetchTermDetail(accessToken, termId) {
  const res = await fetch(`${BASE_URL}/api/terms/${termId}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// POST /api/terms/
export async function createTerm(accessToken, payload) {
  const res = await fetch(`${BASE_URL}/api/terms/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// PUT /api/terms/:id/
export async function updateTerm(accessToken, termId, payload) {
  const res = await fetch(`${BASE_URL}/api/terms/${termId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// POST /api/terms/:id/toggle-active/
export async function toggleTermActive(accessToken, termId) {
  const res = await fetch(`${BASE_URL}/api/terms/${termId}/toggle-active/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
  // ✅ جدید: لیست اساتید
  const res = await fetch(`${BASE_URL}/api/professors/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// =======================
// COURSE SELECTION (STUDENT)
// =======================

// GET /api/selection/selections/draft/
export async function fetchDraftSelections(accessToken) {
  const res = await fetch(`${BASE_URL}/api/selection/selections/draft/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// POST /api/selection/selections/select-course/
export async function selectCourse(accessToken, courseCode) {
  const res = await fetch(
    `${BASE_URL}/api/selection/selections/select-course/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ course_code: courseCode }),
    }
  );

  return handleResponse(res);
}

// DELETE /api/selection/selections/select-course/
export async function removeCourseFromDraft(accessToken, courseCode) {
  const res = await fetch(
    `${BASE_URL}/api/selection/selections/select-course/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ course_code: courseCode }),
    }
  );

  return handleResponse(res);
}

// POST /api/selection/selections/finalize/
export async function finalizeSelection(accessToken) {
  const res = await fetch(`${BASE_URL}/api/selection/selections/finalize/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// GET /api/selection/selections/
export async function fetchFinalSelections(accessToken) {
  const res = await fetch(`${BASE_URL}/api/selection/selections/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// GET /api/selection/selections/schedule/
export async function fetchWeeklySchedule(accessToken) {
  const res = await fetch(`${BASE_URL}/api/selection/selections/schedule/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// GET /api/selection/selections/report-card/?term_id=...
export async function fetchReportCard(accessToken, termId) {
  const url = new URL(`${BASE_URL}/api/selection/selections/report-card/`);
  if (termId !== undefined && termId !== null && termId !== "") {
    url.searchParams.set("term_id", String(termId));
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return handleResponse(res);
}

// =======================
// PROFESSOR
// =======================

// GET /api/selection/professor/:course_code/students/
export async function fetchProfessorCourseStudents(accessToken, courseCode) {
  const res = await fetch(
    `${BASE_URL}/api/selection/professor/${encodeURIComponent(
      courseCode
    )}/students/`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return handleResponse(res);
}

// POST /api/selection/professor/:course_code/remove-student/?student_number=...
export async function removeStudentFromCourse(accessToken, courseCode, studentNumber) {
  const url = new URL(
    `${BASE_URL}/api/selection/professor/${encodeURIComponent(
      courseCode
    )}/remove-student/`
  );
  url.searchParams.set("student_number", String(studentNumber));

  const res = await fetch(url.toString(), {
    method: "POST",
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
