import { $fetch } from 'ofetch'
const URL = 'https://serverstatus-sgp.albiononline.com/'

const data = await $fetch(URL, {
  responseType: 'json'
})
console.log(data, typeof data)