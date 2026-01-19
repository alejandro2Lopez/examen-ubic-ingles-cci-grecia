
import { useEffect, useState } from "react";
import { getFetch, putFetch, postFetch } from "../components/Api_Connect";
import { useAuth } from "../context/AuthContext";
import { formSchema_Teacher } from "../components/schemas";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { schema_params } from '../components/validators';
import Component_enrollment from "../components/Component_enrollment";
import Component_basic_information from "../components/Component_basic_information";
import Swal from "sweetalert2";
import { z } from 'zod';
import { Loading } from "../components/Component_loading";

const Teacher: React.FC<any> = ({ readOnly, isEdit, mode }) => {
    const { sb } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refresh, setRefresh] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [languages, setLanguages] = useState<Array<{ p_language_id: number; language_description: string }>>([]);
    const [isReadOnly, setIsReadOnly] = useState(readOnly);
    const [isMode, setIsMode] = useState(mode);
    type FormData = z.infer<typeof formSchema_Teacher>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema_Teacher), mode: 'all',
        defaultValues: {
            p_birth_date: undefined, // o new Date()
            p_language_id: 1
        },

    });
    const {
        formState: { errors: mainErrors },
        reset: resetForm,
        watch,
        register,

    } = form;
    const goback = () => {
        navigate(-1)
    }
    useEffect(() => {

        // Cargamos profesores
        const get_languages = async () => {
            const res = await getFetch(sb, 'common-service?action=getLanguages');
            if (res) {
                setLanguages(res.data);
            }
        };
        const get_teacher = async () => {
            const paramValue = searchParams.get('profesor') ?? '';
            const parsed = schema_params.safeParse({ param: paramValue });

            if (!parsed.success) {
                console.warn('Parámetro inválido:', parsed.error.issues);
                navigate('/error');
                return;
            }

            const res = await getFetch(sb, `teacher/${paramValue}`);
            if (res) {

                resetForm(res.data[0]);


            }
            setIsLoading(false);
        };


        if (refresh) {
            get_languages();

            if (isMode == "view" || isMode == "edit") {
                get_teacher();

            } else {
                setIsLoading(false);
            }


            setRefresh(false)


        }
    }, []);


    const onSubmit = async () => {
        const isValid = await form.trigger(); // Valida todos los campos
        const data = form.getValues();
        // setIsSubmitting(true); // Activar loading

        if (!isValid) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos requeridos antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        //  const data = form.getValues();
        setIsSubmitting(true); // Activar loading
        console.log(data);

        if (isMode == "create") {
            const resultado = await postFetch(sb, "teacher", data);
            console.log(resultado);

            setIsSubmitting(false);

            if (resultado) {
                Swal.fire({
                    title: 'Profesor agregado!',
                    text: 'El profesor ha sido agregado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    backdrop: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        setRefresh(true);
                        navigate("/profesores");
                    }
                });
            }

        } else {

            const resultado = await putFetch(sb, "teacher", data);
          

            setIsSubmitting(false);

            if (resultado) {
                Swal.fire({
                    title: 'El profesor ha sido de actualizado!',
                    text: 'Los cambios han sido guardados de manera correcta',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    backdrop: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        setRefresh(true);
                    }
                });
            }
        }


    };
    const handleState = (isReadOnly: boolean, mode: string) => {

        setIsReadOnly(isReadOnly);

        setIsMode(mode)
    }

    return (<>   {isLoading ? (
        <Loading />
    ) : (

        <div className="container-fluid pb-5">
            <div className="card shadow">
                <div className="card-header py-3">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="text-primary m-0 fw-bold">Profesor</p>
                        </div>
                        <div className="col text-end">
                            {mode !== "create" && (<>
                                {!isReadOnly ? (<button
                                    onClick={() => handleState(true, "view")}
                                    style={{ background: "transparent", borderColor: "transparent" }}
                                >

                                    <i
                                        className="fa fa-eye pt-0 mt-0"
                                        style={{ fontSize: 22, color: "rgb(175, 158, 0)" }}
                                    />

                                </button>) : (
                                    <button
                                        onClick={() => handleState(false, "edit")}

                                        style={{ background: "transparent", borderColor: "transparent" }}
                                    ><i
                                            className="fa fa-edit pt-0 mt-0"
                                            style={{ fontSize: 21, color: "#1e5e5a" }}
                                        />


                                    </button>
                                )} </>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col">
                <Component_basic_information
                    mainErrors={mainErrors}
                    watch={watch}
                    register={register}
                    isReadOnly={isReadOnly}
                    isSubmitting={isSubmitting}
                    onSubmit={onSubmit}
                    button_Action={isMode == "create" ? "Agregar profesor" : "Guardar cambios"}
                    isEdit={isEdit}
                    isTeacher={true}
                    language={languages}
                    isMode={isMode}
                /></div>
        </div>)}</>);




}

export default Teacher;