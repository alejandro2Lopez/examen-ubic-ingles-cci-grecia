import React, { lazy, Suspense, useState } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { NavbarTop } from "../components/Navbar_Top";
import { Loading } from "../components/Component_loading";
import { Not_found } from "../pages/Not_Found";
import Test_level from "../pages/test-level";

// 🔽 IMPORTACIONES DINÁMICAS
const Login = lazy(() => import("../pages/login"));
const Table_student = lazy(() => import("../pages/table-students"));
const Table_teacher = lazy(() => import("../pages/table-teachers"));
const Add_student = lazy(() => import("../pages/add-students"));
const Student = lazy(() => import("../pages/Student"));
const Enrollment = lazy(() => import("../pages/enrollment"));
const Teacher = lazy(() => import("../pages/Teacher"));
const Statistics_payment = lazy(() => import("../pages/statistics_payment"));
const Table_enrollment = lazy(() => import("../pages/tablet_enrollment"));
const Tablet_history_payment = lazy(() => import("../pages/tablet_history_payment_tablet"));

const AppRouter = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={
          collapsed ? "no-collapse main-content" : "main-content yes-collapse"
        }
        style={{ transition: "margin-left 0.3s ease" }}
      >
        <NavbarTop collapsed={collapsed} setCollapsed={setCollapsed} />
        <div style={{ paddingTop: "100px" }}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
               <Route path="/examen-ubicacion" element={<Test_level />} />
              <Route path="/estudiantes" element={<Table_student />} />
              <Route path="/pagina-no-encontrada" element={<Not_found navigate_to="/estudiantes" />} />
              <Route path="/matricular-estudiante" element={<Add_student />} />
              <Route path="/mostrar-estudiante" element={<Student isEdit={true} isReadOnly={true} titleAction="Estudiante" />} />
              <Route path="/editar-estudiante" element={<Student isEdit={true} isReadOnly={false} titleAction="Estudiante" />} />
              <Route path="/agregar-profesor" element={<Teacher isEdit={false} readOnly={false} mode="create" />} />
              <Route path="/editar-profesor" element={<Teacher isEdit={true} readOnly={false} mode="edit" />} />
              <Route path="/mostrar-profesor" element={<Teacher isEdit={false} readOnly={true} mode="view" />} />
              <Route path="/profesores" element={<Table_teacher />} />
              <Route path="/gestion-de-pagos" element={<Table_enrollment />} />
              <Route path="/editar-matricula" element={<Enrollment readOnly={false} />} />
              <Route path="/mostrar-matricula" element={<Enrollment readOnly={true} />} />
              <Route path="/informe-de-pagos" element={<Statistics_payment />} />
              <Route path="/historial-de-pagos" element={<Tablet_history_payment />} />
              <Route path="*" element={<Navigate to="/estudiantes" />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default AppRouter;
