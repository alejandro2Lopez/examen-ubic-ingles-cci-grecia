import { useState } from "react";
import { postFetch, postPublicFetch } from "./Api_Connect";
import { useSearchParams } from "react-router-dom";
import imglogo from "/assets/img/logoCCI_O.png";
type UserData = {
  name: string;
  age: string;
  email: string;
  phone: string;
  uuid: string;
};

export default function UserInfoForm({ onSubmit }: { onSubmit: (data: UserData) => void }) {
  const [form, setForm] = useState<UserData>({
    name: "",
    age: "",
    email: "",
    phone: "",
    uuid: ""
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const resultado = await postPublicFetch("test-level", form);
    // console.log("Este resultado: "+resultado.message)
    const updatedForm = {
      ...form,
      uuid: resultado.data.message,
    };
    setSearchParams({ session: resultado.data.message });
    setForm(updatedForm);
    onSubmit(updatedForm);
  };

  const isValid =
    form.name &&
    form.age &&
    form.email &&
    form.phone;

  return (
    <div className="container py-5">
      <div className="row align-items-start">

        {/* 👉 COLUMNA IZQUIERDA – INSTRUCTIVO */}
        <div className="col-12 col-md-6 col-lg-5 mb-4 mb-md-0">
          <div className="card shadow-sm h-100"
          style={{ borderRadius: "24px",
            }}>
            <div className="card-body" style={{
              color: "#3b3d3fff",
              lineHeight: "1.6",
              marginBottom: "0.5rem",
              borderRadius: "24px",
            }}>
              <div className="d-flex align-items-center justify-content-left mb-2">
                <img
                 src={imglogo}  // ruta a tu logo
                  alt="CCI Grecia"
                  style={{
                    height: "40px",
                    marginRight: "10px",
                  }}
                />
                <span style={{
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  color: "#2c2e30",
                }}>
                  Centro Cultural de Idiomas Grecia
                </span>
              </div>

              <hr />
              <h4 className="mb-3">📌 Instrucciones</h4>

              <ul className="small">
                <li>Completa todos los campos con información real.</li>
                <li>Tu correo será usado para enviarte los resultados.</li>
                <li>El examen es individual y cuenta con un limite de tiempo, tiene una hora para resolverlo.</li>
                <li>No recargues la página durante el examen.</li>
              </ul>

              <div className="alert alert-info mt-3 small">
                ⏱️ Asegúrate de tener una conexión estable antes de continuar.
              </div>

            </div>
          </div>
        </div>


        <div className="col-12 col-md-6 col-lg-5 offset-lg-1">
          <div className="card shadow"  style={{ borderRadius: "24px", padding: "16px"
            }}>
            <div className="card-body" style={{
              color: "#3b3d3fff",
              lineHeight: "1.6",
              marginBottom: "0.5rem",
            }}>

              <h4 className="card-title mb-3">Regístrate para comenzar la prueba</h4>

              <p className="small mb-4">
                Esta información se usará únicamente para contactarle
                respecto a los resultados del examen.
              </p>

              <form onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    min="10"
                    max="100"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="btn btn-primary btn-lg w-100"

                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" style={{ display: isSubmitting ? 'inline-block' : 'none' }}></span>
                      &nbsp;  {"Cargando examen espera un momento ..."}
                    </>
                  ) : (
                    <>  Continuar al examen</>)
                  }


                </button>
              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  );


}
