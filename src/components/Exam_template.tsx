import { useEffect, useState } from "react";
import { getPublicFetch, putPublicFetch } from "./Api_Connect";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showErrorAlert } from "./Response_user";
import Swal from 'sweetalert2';
import { Loading } from "./Component_loading";
import imglogo from "/assets/img/logoCCI_O.png";
interface Answer {
  answer: string,
  answer_id: number;
}

interface Question {
  question_id: number;
  question: string;
  answer: Answer[];
}

export default function ExamTemplate() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [userData, setUserData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const session = searchParams.get("session");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadExam = async () => {
      const sessionUuid = session ?? userData?.uuid;
      //
      console.log("SESSION FINAL PARA EXAM:", sessionUuid);

      if (!sessionUuid) {
        setIsLoading(false);
        return;
      }

      try {
        const questionsRes = await getPublicFetch("test-level");
        const timeRes = await getPublicFetch(
          "test-level?session=" + sessionUuid
        );

        // ⏱️ Tiempo desde BD
        if (
          timeRes?.data !== null &&
          Number.isInteger(Number(timeRes.data)) &&
          Number(timeRes.data) > 0
        ) {
          setTimeLeft(Number(timeRes.data) * 60);
        } else {
          console.log(
            "Tiempo vencido, los resultados fueron enviados."
          );
          setTimeLeft(0);
        }

        if (Array.isArray(questionsRes?.data)) {
          setQuestions(questionsRes.data);

          // 🔁 Restaurar índice
          const savedIndex = Number(
            localStorage.getItem("indx")
          );

          if (
            Number.isInteger(savedIndex) &&
            savedIndex >= 0 &&
            savedIndex < questionsRes.data.length
          ) {
            setCurrentIndex(savedIndex);
          }

          // 🔁 Restaurar respuestas
          const storedAnswers = JSON.parse(
            localStorage.getItem("exwers")
          );

          if (storedAnswers) {
            setAnswers(storedAnswers);
          }
        }

      } catch (error) {
        console.error("Error cargando examen:", error);
        setTimeLeft(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [session, userData]);



  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);


  if (isLoading) {
    return  <Loading></Loading>;
  }
  const submitTestIfTimeExpired = async () => {

    const session = searchParams.get("session");
    const storedAnswers = JSON.parse(
      localStorage.getItem("exwers"))
    const formatted = Object.entries(storedAnswers).map(
      ([questionId, answerId]) => ({
        question_id: Number(questionId),
        answer_id: answerId
      })
    );
    const sendInfo = {
      id: session,
      answer: formatted
    }
    const response = await putPublicFetch("test-level", sendInfo);

    if (response.data.response == "OK") {
      localStorage.clear();
      setSearchParams({}, { replace: true });
      console.log(response);
      console.log(formatted);

      setIsSubmitting(false);

      Swal.fire({
        title: "Haz terminado",
        text: "Hemos enviado los resultados a tu correo, pronto serás contactado por uno de nuestros acesores",
        icon: "success",
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  }


  if (timeLeft !== null && timeLeft <= 0) {
    submitTestIfTimeExpired()
    return <p>⏰ Tiempo agotado. Revisa tu correo, las respuestas se han mandado a tu correo.</p>;
  }

  const currentQuestion = questions[currentIndex];

  const handleNext = async () => {
    if (!selected || !currentQuestion) return;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.question_id]: selected,
    };

    setAnswers(updatedAnswers);

    localStorage.setItem("exwers", JSON.stringify(updatedAnswers));
    localStorage.setItem("indx", currentIndex + 1);

    setSelected(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      const formatted = Object.entries(updatedAnswers).map(
        ([questionId, answerId]) => ({
          question_id: Number(questionId),
          answer_id: answerId
        })
      );
      const session = searchParams.get("session");
      const sendInfo = {
        id: session,
        answer: formatted
      }
      const response = await putPublicFetch("test-level", sendInfo);

      if (response.data.response == "OK") {
        localStorage.clear();
        setSearchParams({}, { replace: true });
        console.log(response);
        console.log(formatted);

        setIsSubmitting(false);
        Swal.fire({
          title: "Haz terminado",
          text: "Hemos enviado los resultados a tu correo, pronto serás contactado por uno de nuestros acesores",
          icon: "success",
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.reload();;


        })
      }
    }
  };


  if (isLoading) {
    return (
       <Loading></Loading>
    );
  }

  if (questions.length === 0) {
    return (
    <Loading></Loading>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f3f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div className="container">
        <section className="row justify-content-center align-items-start g-4">

          {/* INSTRUCCIONES */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm"
             style={{ borderRadius: "24px", padding: "12px"
            }}>
              <div
                className="card-body"
                style={{
                  color: "#3b3d3f",
                  lineHeight: "1.6",
                }}
              >
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
                <h5 className="card-title mb-3">📘 Instrucciones</h5>

                <ul className="mb-0">
                  <li>No cambie de pestaña.</li>
                  <li>Una sola respuesta por pregunta.</li>
                  <li>No refresque la página.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* EXAMEN */}
          <div className="col-md-8 col-lg-5">
            <div className="card shadow"   style={{ borderRadius: "24px", padding: "12px"
            }}>
              <div className="card-body d-flex flex-column gap-4">
                <div className="row">
                  <div className="col-md-8 d-flex flex-column align-items-start">
                    <small className="text-muted">
                      Pregunta {currentIndex + 1} de {questions.length}
                    </small>
                  </div>
                  <div className="col-md-4 d-flex flex-column align-items-end">
                    <span
                      className="badge bg-light text-dark"
                      style={{
                        fontSize: "0.9rem",
                        padding: "8px 12px",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      ⏱️ {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <div className="progress" style={{
                  height: "6px",
                  borderRadius: "4px",
                }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <div
                  style={{
                    background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                    padding: "20px",
                    borderRadius: "12px",
                    borderLeft: "4px solid #0d6efd",
                  }}
                >

                  <h5 className="card-title" style={{ whiteSpace: "pre-line" }}>
                    {renderQuestionText(currentQuestion.question)}
                  </h5>
                </div>

                <div className="d-flex flex-column gap-2">
                  {currentQuestion.answer.map((option, index) => (
                    <label
                      key={index}
                      className={`form-check border rounded p-3 ${selected === option.answer
                        ? "border-primary bg-light"
                        : ""
                        }`}
                      style={{
                        cursor: "pointer",
                        color: "#3b3d3f",
                        lineHeight: "1.6",
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="answer"
                        checked={selected === option.answer_id}
                        onChange={() => setSelected(option.answer_id)}
                      />
                      <span className="form-check-label ms-2">
                        {option.answer}
                      </span>
                    </label>
                  ))}
                </div>

                <button

                  disabled={isSubmitting || !selected}
                  className="btn btn-primary btn-lg"
                  onClick={handleNext}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" style={{ display: isSubmitting ? 'inline-block' : 'none' }}></span>
                      &nbsp;  {"Revisando examen, espera un momento ..."}
                    </>
                  ) : (
                    <> {currentIndex === questions.length - 1
                      ? "Finalizar examen"
                      : "Siguiente"}</>)
                  }


                </button>

              </div>
            </div>
          </div>

        </section>
      </div></div>);
}
function renderQuestionText(text: string) {
  return text.split("\n").map((line, lineIndex) => {
    const parts = line.split(/(\*[^*]+\*|___)/g);

    return (
      <div key={lineIndex}
        style={{
          color: "#3b3d3fff",
          lineHeight: "1.6",
          marginBottom: "0.5rem",
        }}>
        {parts.map((part, index) => {
          // *texto* → negrita
          if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <span
                key={index}
                style={{ fontWeight: 800 }}
              >
                {part.replace(/\*/g, "")}
              </span>
            );
          }

          // ___ → resaltado
          if (part === "___") {
            return (
              <span
                key={index}
                style={{
                  backgroundColor: "#fff3cd",
                  padding: "0 6px",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                ___
              </span>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </div>

    );
  });

}
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

