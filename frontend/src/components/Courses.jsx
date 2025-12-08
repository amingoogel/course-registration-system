import { useState, useEffect } from "react";
import { fetchCourses } from "./apiClient";

const colors = {
  card: "#EFE9E3",
  border: "#D9CFC7",
};

function Courses({ accessToken, title = "لیست دروس" }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const loadCourses = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await fetchCourses(accessToken);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessage(err.message || "خطا در دریافت لیست دروس.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [accessToken]);

  const cardStyle = {
    backgroundColor: colors.card,
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    padding: "16px 18px",
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
    borderBottom: `1px solid "#f1ece6"`,
    fontSize: "12px",
  };

  return (
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
          {title}
        </h2>
        {loading && (
          <span style={{ fontSize: "12px", color: "#555" }}>
            در حال بارگذاری...
          </span>
        )}
      </div>

      {message && (
        <div
          style={{
            marginBottom: "8px",
            padding: "6px 8px",
            borderRadius: "10px",
            fontSize: "12px",
            backgroundColor: "#ffe5e5",
            color: "#a30000",
          }}
        >
          {message}
        </div>
      )}

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
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && !loading ? (
              <tr>
                <td style={tdStyle} colSpan={9}>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Courses;
