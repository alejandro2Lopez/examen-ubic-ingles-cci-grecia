import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFetch } from "../components/Api_Connect"; // suponiendo que tenés ese método
import { Loading } from "../components/Component_loading";

const PrivateRouter = ({ children }) => {
  const { session, loading, sb } = useAuth();
  const [autorizado, setAutorizado] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const validarPermiso = async () => {
      if (session) {
        const res = await getFetch(sb, 'auth-review');
        if (res?.data?.status === 'OK') {
          setAutorizado(true);
        } else {
          await sb.auth.signOut();
          setAutorizado(false);
        }
      } else {
        setAutorizado(false);
      }
    };

    validarPermiso();
  }, [session, location.pathname]);

  if (loading || autorizado === null) return <Loading />;

  return autorizado ? children : <Navigate to="/examen-ubicacion" />;
};

export default PrivateRouter;