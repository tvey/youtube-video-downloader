let videoForm = document.getElementById('video-form')
let videoInput = document.getElementById('video-input')
let infoElem = document.getElementById('info')
let buttonsElem = document.getElementById('buttons')
let spinner = document.querySelector('.spinner')

spinner.style.display = 'none'

videoForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  infoElem.innerHTML = ''
  buttonsElem.innerHTML = ''
  let videoValue = videoInput.value.trim()
  let pattern = /(?:v=|\/)([0-9A-Za-z_-]{11}$)/
  let videoMatch = videoValue.match(pattern)

  if (!videoMatch) {
    infoElem.innerText = 'Please add a valid link.'
  } else {
    spinner.style.display = 'block'
    let videoInfo = await getInfo(videoValue)
    spinner.style.display = 'none'

    if (!Object.keys(videoInfo).length) {
      infoElem.innerText = 'This video is not available.'
    } else {
      infoElem.innerHTML = `<p><strong>${videoInfo.title}</strong></p>`

      buttonsInner = '<p>Resolutions:</p>'
      for (const el of videoInfo.resolutions) {
        buttonsInner += `<button class="btn btn-secondary">${el}</button>`
      }
      buttonsElem.innerHTML = buttonsInner

      let resolutionButtons = buttonsElem.getElementsByClassName('btn')

      if (resolutionButtons) {
        for (const button of resolutionButtons) {
          button.addEventListener('click', async (e) => {
            let resolution = e.target.textContent
            spinner.style.display = 'block'
            let data = await getVideo(videoValue, resolution)
            spinner.style.display = 'none'
            let filename = `${videoInfo.title}.mp4`
            await downloadFile(data, filename)
          }, false)
        }
      }
    }
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


async function getVideoUrl(videoValue, resolution) {
  const response = await fetch('/url', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'video': videoValue, 'resolution': resolution })
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
    body: JSON.stringify({ 'video': videoValue, 'resolution': resolution })
  },
  )
  const result = await response.blob()
  return result
}


async function downloadFile(data, filename) {
  const blob = new Blob([data], {type: 'video/mp4'});
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  setTimeout(() => {
    window.URL.revokeObjectURL(blobURL);
  }, 100);
}
