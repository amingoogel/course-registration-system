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






  
}