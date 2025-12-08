import { useEffect, useState } from "react";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "./apiClient";

const colors = {
  card: "#EFE9E3",
  border: "#D9CFC7",
};

const emptyCourse = {
  id: null,
  code: "",
  name: "",
  capacity: "",
  units: "",
  day: "",
  start_time: "",
  end_time: "",
  location: "",
  professor: "",
};

function CourseManager({ accessToken }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(emptyCourse);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  useEffect(() => {
    if (!accessToken) return;

    const loadCourses = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await fetchCourses(accessToken);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessageType("error");
        setMessage(err.message || "خطا در دریافت لیست دروس.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [accessToken]);

  const handleInputChange = (field, value) => {
    setSelectedCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = (course) => {
    setSelectedCourse({
      id: course.id,
      code: course.code ?? "",
      name: course.name ?? "",
      capacity:
        course.capacity === null || course.capacity === undefined
          ? ""
          : String(course.capacity),
      units:
        course.units === null || course.units === undefined
          ? ""
          : String(course.units),
      day: course.day ?? "",
      start_time: course.start_time ?? "",
      end_time: course.end_time ?? "",
      location: course.location ?? "",
      professor: course.professor ?? "",
    });
    setMessage("");
    setMessageType("");
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "آیا از حذف این درس اطمینان دارید؟"
    );
    if (!confirmDelete) return;

    try {
      await deleteCourse(accessToken, courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setMessageType("success");
      setMessage("درس با موفقیت حذف شد.");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "حذف درس با مشکل مواجه شد.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedCourse.code || !selectedCourse.name) {
      setMessageType("error");
      setMessage("فیلدهای کد درس و نام درس اجباری هستند.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: selectedCourse.code.trim(),
        name: selectedCourse.name.trim(),
      };

      if (selectedCourse.capacity !== "") {
        payload.capacity = Number(selectedCourse.capacity);
      }
      if (selectedCourse.units !== "") {
        payload.units = Number(selectedCourse.units);
      }
      if (selectedCourse.day && selectedCourse.day.trim() !== "") {
        payload.day = selectedCourse.day.trim();
      }
      if (
        selectedCourse.start_time &&
        selectedCourse.start_time.trim() !== ""
      ) {
        payload.start_time = selectedCourse.start_time.trim();
      }
      if (
        selectedCourse.end_time &&
        selectedCourse.end_time.trim() !== ""
      ) {
        payload.end_time = selectedCourse.end_time.trim();
      }
      if (
        selectedCourse.location &&
        selectedCourse.location.trim() !== ""
      ) {
        payload.location = selectedCourse.location.trim();
      }
      if (
        selectedCourse.professor &&
        selectedCourse.professor.trim() !== ""
      ) {
        payload.professor = selectedCourse.professor.trim();
      }

      if (selectedCourse.id) {
        const updated = await updateCourse(
          accessToken,
          selectedCourse.id,
          payload
        );
        setCourses((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        setMessageType("success");
        setMessage("ویرایش درس با موفقیت انجام شد.");
      } else {
        const created = await createCourse(accessToken, payload);
        setCourses((prev) => [...prev, created]);
        setMessageType("success");
        setMessage("درس جدید با موفقیت اضافه شد.");
      }

      setSelectedCourse(emptyCourse);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "ذخیره درس با مشکل مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCourse(emptyCourse);
    setMessage("");
    setMessageType("");
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    direction: "rtl",
    fontFamily: "sans-serif",
    boxSizing: "border-box",
  };

  const cardStyle = {
    backgroundColor: colors.card,
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    padding: "16px 18px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    marginBottom: "4px",
    fontWeight: 500,
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    fontSize: "12px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  };

  const thStyle = {
    padding: "8px 6px",
    textAlign: "center",
    borderBottom: `1px solid ${colors.border}`,
    whiteSpace: "nowrap",
    fontSize: "12px",
  };

  const tdStyle = {
    padding: "6px 6px",
    textAlign: "center",
    borderBottom: `1px solid #f1ece6`,
    fontSize: "12px",
  };

  const actionButtonStyle = {
    padding: "4px 8px",
    borderRadius: "8px",
    border: "none",
    fontSize: "11px",
    cursor: "pointer",
    margin: "0 2px",
  };

  return (
    <div style={containerStyle}>
      {/* فرم افزودن/ویرایش درس */}
      <div style={cardStyle}>
        <h2
          style={{
            fontSize: "15px",
            marginBottom: "10px",
          }}
        >
          {selectedCourse.id ? "ویرایش درس" : "افزودن درس جدید"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px 16px",
              marginBottom: "10px",
            }}
          >
            <div>
              <label style={labelStyle}>کد درس *</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.code}
                onChange={(e) =>
                  handleInputChange("code", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>نام درس *</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.name}
                onChange={(e) =>
                  handleInputChange("name", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>ظرفیت</label>
              <input
                type="number"
                style={inputStyle}
                value={selectedCourse.capacity}
                onChange={(e) =>
                  handleInputChange("capacity", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>تعداد واحد</label>
              <input
                type="number"
                style={inputStyle}
                value={selectedCourse.units}
                onChange={(e) =>
                  handleInputChange("units", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>روز</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.day}
                onChange={(e) =>
                  handleInputChange("day", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>ساعت شروع (مثلاً 08:00)</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.start_time}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>ساعت پایان (مثلاً 09:30)</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.end_time}
                onChange={(e) =>
                  handleInputChange("end_time", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>محل برگزاری</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.location}
                onChange={(e) =>
                  handleInputChange("location", e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>استاد</label>
              <input
                type="text"
                style={inputStyle}
                value={selectedCourse.professor}
                onChange={(e) =>
                  handleInputChange("professor", e.target.value)
                }
              />
            </div>
          </div>

          {message && (
            <div
              style={{
                marginBottom: "8px",
                padding: "6px 8px",
                borderRadius: "10px",
                fontSize: "12px",
                whiteSpace: "pre-line",
                backgroundColor:
                  messageType === "error"
                    ? "#ffe5e5"
                    : messageType === "success"
                    ? "#e5ffea"
                    : "#f5f5f5",
                color:
                  messageType === "error"
                    ? "#a30000"
                    : messageType === "success"
                    ? "#036b21"
                    : "#333",
              }}
            >
              {message}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-start",
              marginTop: "4px",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                ...actionButtonStyle,
                background:
                  "linear-gradient(135deg, #D9CFC7 0%, #B6A896 100%)",
                minWidth: "110px",
              }}
            >
              {saving
                ? "در حال ذخیره..."
                : selectedCourse.id
                ? "ثبت ویرایش"
                : "افزودن درس"}
            </button>

            {selectedCourse.id && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: "#ddd",
                  minWidth: "80px",
                }}
              >
                انصراف
              </button>
            )}
          </div>
        </form>
      </div>

      {/* جدول لیست دروس (مدیریت) */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              margin: 0,
            }}
          >
            لیست دروس (مدیریت)
          </h2>
          {loading && (
            <span style={{ fontSize: "12px", color: "#555" }}>
              در حال بارگذاری...
            </span>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>کد</th>
                <th style={thStyle}>نام درس</th>
                <th style={thStyle}>ظرفیت</th>
                <th style={thStyle}>واحد</th>
                <th style={thStyle}>روز</th>
                <th style={thStyle}>شروع کلاس</th>
                <th style={thStyle}>پایان کلاس</th>
                <th style={thStyle}>محل</th>
                <th style={thStyle}>استاد</th>
                <th style={thStyle}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && !loading ? (
                <tr>
                  <td style={tdStyle} colSpan={10}>
                    درسی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td style={tdStyle}>{course.code}</td>
                    <td style={tdStyle}>{course.name}</td>
                    <td style={tdStyle}>
                      {course.capacity !== null &&
                      course.capacity !== undefined
                        ? course.capacity
                        : "-"}
                    </td>
                    <td style={tdStyle}>
                      {course.units !== null &&
                      course.units !== undefined
                        ? course.units
                        : "-"}
                    </td>
                    <td style={tdStyle}>{course.day || "-"}</td>
                    <td style={tdStyle}>{course.start_time || "-"}</td>
                    <td style={tdStyle}>{course.end_time || "-"}</td>
                    <td style={tdStyle}>{course.location || "-"}</td>
                    <td style={tdStyle}>{course.professor || "-"}</td>
                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={() => handleEditClick(course)}
                        style={{
                          ...actionButtonStyle,
                          backgroundColor: "#e3e0ff",
                        }}
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCourse(course.id)
                        }
                        style={{
                          ...actionButtonStyle,
                          backgroundColor: "#ffd6d6",
                        }}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseManager;
