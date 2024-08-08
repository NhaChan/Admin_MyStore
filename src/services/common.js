const API_URL = process.env.REACT_APP_BASE_URL

export const toImageLink = (link) => {
    return API_URL + '/' + link; 
}