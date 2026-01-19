import { showErrorAlert } from "./Response_user";

// Región deseada para ejecución de funciones
const REGION = 'us-west-1';
const SUPABASE_URL = 'https://vhdqfwgegjootyegkllk.supabase.co/functions/v1';

export const getFetch = async (sb, path) => {
  try {
    const session = await sb.auth.getSession();
    const access_token = session.data.session?.access_token;
    const res = await fetch(`${SUPABASE_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'x-region': REGION,
      },
    });
    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.error('Error del servidor:', await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        throw new Error('Respuesta del servidor no es JSON válido');
      });
      return response;
    }
  } catch (error) {
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    console.error('Error de red o ejecución:', error);
    return false;
  }
};

export const postFetch = async (sb, path, data) => {
  try {
    const session = await sb.auth.getSession();
    const access_token = session.data.session?.access_token;
    const res = await fetch(`${SUPABASE_URL}/${path}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        'x-region': REGION,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.error('Error del servidor:', await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        throw new Error('Respuesta del servidor no es JSON válido');
      });
      console.log(response);
      return response;
    }
  } catch (error) {
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    console.error('Error de red o ejecución:', error);
    return false;
  }
};

export const putFetch = async (sb, path, data) => {
  try {
    const session = await sb.auth.getSession();
    const access_token = session.data.session?.access_token;

    const res = await fetch(`${SUPABASE_URL}/${path}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        'x-region': REGION,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.error('Error del servidor:', await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        throw new Error('Respuesta del servidor no es JSON válido');
      });

      return response;
    }
  } catch (error) {
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    console.error('Error de red o ejecución:', error.message);
    return false;
  }
};

export const deleteFetch = async (sb, path, data = null) => {
  try {
    const session = await sb.auth.getSession();
    const access_token = session.data.session?.access_token;

    const res = await fetch(`${SUPABASE_URL}/${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        'x-region': REGION,
      },
      body: JSON.stringify(data || {}),
    });

    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.log(await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        return {};
      });
      console.log(response);
      return response;
    }
  } catch (error) {
    console.log(error.message);
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    return false;
  }

  
};
export const getPublicFetch = async (path) => {
  try {
   // const session = await sb.auth.getSession();
  //  const access_token = session.data.session?.access_token;
    const res = await fetch(`${SUPABASE_URL}/${path}`, {
      headers: {
        Authorization: `Bearer `+ import.meta.env.VITE_SB_ANON_KEY,
      //  'x-region': REGION,
      },
    });
    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.error('Error del servidor:', await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        throw new Error('Respuesta del servidor no es JSON válido');
      });
      console.log(response)
      return response;
    }
  } catch (error) {
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    console.error('Error de red o ejecución:', error);
    return false;
  }
};

export const postPublicFetch = async (path, data) => {
  try {
   
    const res = await fetch(`${SUPABASE_URL}/${path}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer `+ import.meta.env.VITE_SB_ANON_KEY,
        'x-region': REGION,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.error('Error del servidor:', await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        throw new Error('Respuesta del servidor no es JSON válido');
      });
      console.log(response);
      return response;
    }
  } catch (error) {
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    console.error('Error de red o ejecución:', error);
    return false;
  }
};
export const putPublicFetch = async ( path, data) => {
  try {
   

    const res = await fetch(`${SUPABASE_URL}/${path}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer `+ import.meta.env.VITE_SB_ANON_KEY

      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showErrorAlert("Error", "Ocurrió un error inesperado. Intenta nuevamente.", "error");
      console.error('Error del servidor:', await res.json());
      return false;
    } else {
      const response = await res.json().catch(() => {
        throw new Error('Respuesta del servidor no es JSON válido');
      });

      return response;
    }
  } catch (error) {
    showErrorAlert("Error", "Hubo un problema. Refresca la página o contáctanos.", "error");
    console.error('Error de red o ejecución:', error.message);
    return false;
  }
};
