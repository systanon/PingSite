import { readArg } from "./clireader.ts";


function myFetch (url: string) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          resolve(`${url} available`)
        } else {
          reject(`${url} not available. Status code: ${response.status}`)
        }
      })
      .catch(error => reject(`Response error ${url}: ${error}`))
  })
}

async  function checkUrls (urls: Array<string>) {
  try {
    const results = await Promise.allSettled(urls.map(myFetch))
    results.forEach(result => console.log(result))
  } catch (error) {
    console.error('Error:', error)
  }
}

checkUrls(readArg())
