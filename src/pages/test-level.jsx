import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserInfoForm from "../components/UserInfoForm";
import Exam_template from "../components/Exam_template";
import { getPublicFetch } from "../components/Api_Connect";
import { Loading } from "../components/Component_loading";

export default function Test_level() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const session = searchParams.get("session");

  // 👉 Agregar session a la URL (solo cuando userData cambia)
  useEffect(() => {
   /* if (userData?.uuid) {
      setSearchParams({ session: userData.uuid });
    }*/
  }, [userData, setSearchParams]);

  // 👉 Validar session al cargar / refrescar
useEffect(() => {
  const validateSession = async () => {
    const sessionUuid = session ?? userData?.uuid;

  

    if (!sessionUuid) {
      setLoading(false);
      return;
    }

    try {
     const ret = await getPublicFetch(
        "test-level?session=" + sessionUuid
      );

      const isValid =
        ret?.data !== null &&
        Number.isInteger(Number(ret.data));

      if (!isValid) {
        setUserData(null);
      }

    } catch (error) {
      console.log(error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  validateSession();
}, [session, userData]);

  // ⏳ Mientras valida
  if (loading) {
    return <Loading></Loading>;
  }


  if (!userData && !session) {
   
    return <UserInfoForm onSubmit={setUserData} />;
  }

  // 🧪 Paso 2: Examen
  return <Exam_template user={userData} />;
}
