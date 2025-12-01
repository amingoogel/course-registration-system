import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import CoursesList from "../pages/CoursesList";
import AddCourse from "../pages/AddCourse";
import EditCourse from "../pages/EditCourse";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/courses/:id/edit" element={<EditCourse />} />
      </Routes>
    </BrowserRouter>
  );
}
