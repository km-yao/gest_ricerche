// // Ricerche
const API_BASE_URL = 'http://localhost:8080/primoprogetto/ricerche'

export async function getAllRicerche() {
  try {
    const response = await fetch(API_BASE_URL + '/getAllRicerche')
    if (!response.ok) throw new Error(`${response.status} : ${response.error}`)
    // console.log(response.json());
    return await response.json()
  } catch (error) {
    // console.error('Error fetching ricerche:', error);
    return { error: error.message, status: 'error' }
  }
}

export async function getRicercheBySubstring(substring) {
  try {
    const response = await fetch(`${API_BASE_URL}/getRicerca/${encodeURIComponent(substring)}`)
    if (!response.ok) throw new Error(`${response.status} : ${response.error}`)
    return await response.json()
  } catch (error) {
    console.error('Error searching ricerche:', error)
    return { error: error.message, status: 'error' }
  }
}

export async function saveRicerca(ricerca, file) {
  try {
    const formData = new FormData()

    const metadata = JSON.stringify(ricerca)
    // const blob = new Blob([metadata], { type: 'application/json' });
    formData.append('ricerca', metadata)
    //

    if (file != undefined) {
      formData.append('file', file)
    }

    const response = await fetch(`${API_BASE_URL}/saveRicerca`, {
      method: 'PUT',
      headers: {
        // 'Content-Type': 'application/json',
        // 'Content-Type': 'multipart/form-data; boundary=-------WEBKITFORMBOUNDARY--',
      },
      // body: JSON.stringify(ricerca)
      body: formData
    })
    if (!response.ok) throw new Error(`${response.status} : ${response.error}`)
    return await response.json()
  } catch (error) {
    console.error('Error adding ricerca:', error)
    return { error: error.message, status: 'error' }
  }
}

export async function deleteRicerca(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteRicerca/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error(`${response.status} : ${response.error}`)
    return await response.json()
  } catch (error) {
    console.error('Error deleting ricerca:', error)
    return { error: error.message, status: 'error' }
  }
}

// // Utenti
const API_UTENTI_URL = 'http://localhost:8080/primoprogetto/utenti'

export async function getAllUtenti() {
  try {
    const response = await fetch(API_UTENTI_URL + '/getAllUtenti')
    if (!response.ok) throw new Error(`${response.status} : ${response.error}`)
    return await response.json()
  } catch (error) {
    return { error: error.message, status: 'error' }
  }
}

// // Tipi di ricerca
const API_TIPI_URL = 'http://localhost:8080/primoprogetto/tipoRicerca'

export async function getTipiRicerca() {
  try {
    const response = await fetch(API_TIPI_URL + '/getAllTipiRicerche')
    if (!response.ok) throw new Error(`${response.status} : ${response.error}`)
    return await response.json()
  } catch (error) {
    return { error: error.message, status: 'error' }
  }
}

// // File per ricerca
const API_FILE_URL = 'http://localhost:8080/primoprogetto/ricerche/getFileByRicerca'

export async function getFilePerRicerca(id) {
  try {
    const response = await fetch(API_FILE_URL + `/${id}`)
    if (!response.ok) throw new Error(`${response.status} : ${response.statusText}`)
    return await response.json()
  } catch (error) {
    return { error: error.message, status: 'error' }
  }
}

// // Documenti
const API_DOCUMENTI_URL = 'http://localhost:8080/primoprogetto/documenti'

export async function getAnteprima(id) {
  try {
    const response = await fetch(API_DOCUMENTI_URL + '/getDocumentoFileAnteprima/' + id)
    if (!response.ok) throw new Error(`${response.status} : ${response.statusText}`)
    return await response.json()
  } catch (error) {
    return { error: error.message, status: 'error' }
  }
}

export async function getBase64File(id) {
  try {
    const response = await fetch(API_DOCUMENTI_URL + '/getDocumentoFile/' + id)
    if (!response.ok) throw new Error(`${response.status} : ${response.statusText}`)
    return await response.json()
  } catch (error) {
    return { error: error.message, status: 'error' }
  }
}

export async function getAllDocumenti() {
  try {
    const response = await fetch(API_DOCUMENTI_URL + '/getDocumenti')
    if (!response.ok) throw new Error(`${response.status} : ${response.statusText}`)
    return await response.json()
  } catch (error) {
    return { error: error.message, status: 'error' }
  }
}
