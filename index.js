/**
 * Fetches film data from SWAPI
 *
 * @param {number} episodeNum Episode number to get data for
 */
async function fetchData(episodeNum) {
  const response = await fetch(`https://swapi.info/api/films/${episodeNum}`)
  if (!response.ok) {
    throw new Error('Something went wrong!')
  }
  const responseData = await response.json()
  return responseData
}

/**
 * Plays opening crawl
 *
 * @param {number} episodeNum Episode number to play crawl from
 */
async function playCrawl(episodeNum) {
  // Start playing audio
  const audioEl = document.getElementById('audio')
  audioEl.play()

  // Convert episode number to roman numeral
  const romanNumEpisode = convertToRomanNumeral(episodeNum)

  // Get film data
  const responseData = await fetchData(episodeNum)
  console.log(responseData)

  // Hide buttons
  document.getElementById('container').style.display = 'none'
  document.getElementById('ep-card-container').style.display = 'none'
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden'

  // Show fade, intro, logo
  document.getElementById('intro').style.display = 'flex'
  document.getElementById('logo').style.display = 'flex'
  document.getElementById('fade').style.zIndex = '1'

  // Remove intro text and logo from DOM after timeout
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none'
    setTimeout(() => {
      document.getElementById('logo').style.display = 'none'
      document.getElementById('fade').style.display = 'block'
    }, 6000)
  }, 9000)

  const crawlElement = document.getElementById('crawl')
  crawlElement.classList.add('crawl')
  const titleEl = document.getElementById('title')

  const epNumEl = document.createElement('p')
  epNumEl.id = 'crawl-text'
  epNumEl.innerHTML = `Episode ${romanNumEpisode}`
  titleEl.appendChild(epNumEl)

  const headingEl = document.createElement(`h1`)
  headingEl.innerHTML = responseData.title
  titleEl.appendChild(headingEl)

  const crawlTextEl = document.createElement(`p`)
  crawlTextEl.innerHTML = responseData.opening_crawl
  crawlElement.appendChild(crawlTextEl)

  // Show menu
  setTimeout(() => {
    stopPlayback()
  }, 100000)
}

/**
 * Stops playback by refreshing page
 */
function stopPlayback() {
  location.reload()
}

/**
 * Convert episode number to roman numerals
 *
 * @param {number} number Episode number to convert
 * @returns Roman numeral equivalent
 */
function convertToRomanNumeral(number) {
  switch (number) {
    case 1:
      return 'IV'
    case 2:
      return 'V'
    case 3:
      return 'VI'
    case 4:
      return 'I'
    case 5:
      return 'II'
    case 6:
      return 'III'
    default:
      return ''
  }
}

/**
 * Toggles muted audio
 */
function muteAudio() {
  const audioEl = document.getElementById('audio')
  if (!audioEl.muted) {
    audioEl.muted = true
  } else {
    audioEl.muted = false
  }
}
