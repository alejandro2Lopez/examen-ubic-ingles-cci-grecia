
import { useEffect, useState } from "react";
import { getFetch, putFetch } from "../components/Api_Connect";
import { useAuth } from "../context/AuthContext";
import { courseSchema } from "../components/schemas";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { schema_params } from '../components/validators';
import Component_enrollment from "../components/Component_enrollment";
import Swal from "sweetalert2";
import { z } from 'zod';
import { Loading } from "../components/Component_loading";

const Enrollment: React.FC<any> = ({ readOnly }) => {
    const { sb } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [courses, setCourses] = useState<Array<{ course_id: number; description: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState<Array<{ teacher_id: number; teacher_name: string }>>([]);
    const [isReadOnly, setIsReadOnly] = useState(readOnly);
    type CourseFormData = z.infer<typeof courseSchema>;

    const courseForm = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema), mode: 'all', defaultValues: {
            e_start_date: undefined,
            e_next_payment: undefined, // o new Date()
        }

    });
    const {
        formState: { errors: courseErrors },
        reset: resetCourseForm,
        watch: watch_courseForm,

    } = courseForm;

    useEffect(() => {


        const get_courses = async () => {
            const res = await getFetch(sb, 'common-service?action=getCourses');
            if (res) {
                setCourses(res.data);
            }
        };

        // Cargamos profesores
        const get_teachers = async () => {
            const res = await getFetch(sb, 'common-service?action=getTeachers');
            if (res) {
                setTeachers(res.data);
            }
        };
        const get_enrollment = async () => {
            const paramValue = searchParams.get('matricula') ?? '';
            const parsed = schema_params.safeParse({ param: paramValue });

            if (!parsed.success) {
                console.warn('Parámetro inválido:', parsed.error.issues);
                navigate('/error');
                return;
            }

            const res = await getFetch(sb, `enrollment/${paramValue}`);
            if (res) {
                res.data.enrolment[0].e_first_course_payment = 1
                res.data.enrolment[0].e_enrollment_paymentSN = 1
                if (res.data.enrolment[0].e_active) {
                    res.data.enrolment[0].e_active = "1"
                } else {
                    res.data.enrolment[0].e_active = "0"
                }
                console.log(res);
                resetCourseForm(res.data.enrolment[0]);


            }
            setIsLoading(false);
        };


        if (refresh) {
            get_teachers();
            get_courses();
            get_enrollment();
            setRefresh(false)

        }
    }, [refresh, resetCourseForm]);


    const onSubmit = async () => {
        const isValid = await courseForm.trigger(); // Valida todos los campos

        if (!isValid) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos requeridos antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const data = courseForm.getValues();
        setIsSubmitting(true); // Activar loading
      

        const fullData = {
            enrollment: data,
        };

        const resultado = await putFetch(sb, "enrollment", fullData);
      

        setIsSubmitting(false);

        if (resultado) {
            Swal.fire({
                title: 'Estudiante actualizado!',
                text: 'El estudiante ha sido actualizado correctamente',
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
    };
    const handleState = (isReadOnly: boolean, mode: string) => {

        setIsReadOnly(isReadOnly);

        //setIsMode(mode)
    }

    return (<>   {isLoading ? (
        <Loading />
    ) : (<div className="container-fluid pb-5">
        <div className="col">
            <Component_enrollment
                courseForm={courseForm}
                courses={courses}
                teachers={teachers}
                courseErrors={courseErrors}
                onSubmit={onSubmit}
                isEditEnrollment={true}
                watch={watch_courseForm}
                button_Action={"Guardar cambios"}
                isSubmitting={isSubmitting}
                isReadOnly={isReadOnly}
                handleState={handleState}
            /></div>
    </div>)}</>);




}

export default Enrollment;