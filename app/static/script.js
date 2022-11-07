let videoForm = document.getElementById('video-form')
let videoInput = document.getElementById('video-input')
let infoElem = document.getElementById('info')
let spinner = document.querySelector('.spinner')

spinner.style.display = 'none'

videoForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  infoElem.innerHTML = ''
  let videoValue = videoInput.value
  let pattern = /(?:v=|\/)([0-9A-Za-z_-]{11})/
  let videoMatch = videoValue.match(pattern)

  if (videoMatch) {
    spinner.style.display = 'block'
    let info = await getInfo(videoValue)
    spinner.style.display = 'none'

    let infoInner = `<p>${info.title}</p>`
    infoInner += '<p>Resolutions:</p>'
    for (const el of info.resolutions) {
      infoInner += `<button class="btn btn-secondary">${el}</button>`
    }
    infoElem.innerHTML = infoInner

    let resolutionButtons = infoElem.getElementsByClassName('btn')

    if (resolutionButtons) {
      for (const button of resolutionButtons) {
        button.addEventListener('click', async (e) => {
          let resolution = e.target.textContent
          let videoResp = await getVideo(videoValue, resolution)
          console.log(videoResp)
        }, false)
      }
    }
  } else {
    resolutionsElem.innerText = 'Please add a valid link.'
  }
})



async function getInfo(videoValue) {
  const response = await fetch('/info', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({'video': videoValue})
    },
  )
  const result = await response.json()
  return result
}

async function getVideo(videoValue, resolution) {
  const response = await fetch('/video', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({'video': videoValue, 'resolution': resolution})
    },
  )
  const result = await response.json()
  return result
}
