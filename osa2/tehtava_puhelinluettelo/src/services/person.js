import axios from 'axios'

const baseUrl='/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const removePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
return request
}

const updateNumber = (updateObject, id) => {
  console.log(`${baseUrl}/${id}`, updateObject)
  const request = axios.put(`${baseUrl}/${id}`, updateObject)
  return request
}

export default { getAll, create, removePerson, updateNumber }
