/**
 * Fetches film data from SWAPI
 *
 * @param {number} episodeNum Episode number to get data for
 */
async function fetchData(episodeNum) {
  try {
    const response = await fetch(`https://swapi.info/api/films/${episodeNum}`)
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch data from API')
  }
}

/**
 * Plays opening crawl
 *
 * @param {number} episodeNum Episode number to play crawl from
 */
async function playCrawl(episodeNum) {
  // Get film data
  const responseData = await fetchData(episodeNum)

  // Start playing audio
  const audioEl = document.getElementById('audio')
  audioEl.play()

  // Convert episode number to roman numeral
  const romanNumEpisode = convertToRomanNumeral(episodeNum)

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

  const headingEl = document.createElement('h1')
  headingEl.innerHTML = responseData.title
  titleEl.appendChild(headingEl)

  const crawlTextEl = document.createElement('p')
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
  const romanNumerals = {
    1: 'IV',
    2: 'V',
    3: 'VI',
    4: 'I',
    5: 'II',
    6: 'III',
  }

  return romanNumerals[number] || ''
}

/**
 * Toggles muted audio and updates button text/icon
 */
function muteAudio() {
  const audioEl = document.getElementById('audio')
  const muteButton = document.getElementById('mute-button')
  const icon = muteButton.querySelector('i')

  // Toggle the muted state
  audioEl.muted = !audioEl.muted

  // Update button text and icon based on muted state
  if (audioEl.muted) {
    // Audio is now muted
    icon.className = 'fas fa-volume-mute'
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i> Unmute Audio'
  } else {
    // Audio is now unmuted
    icon.className = 'fas fa-volume-up'
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i> Mute Audio'
  }
}

/**
 * Initialize event listeners when DOM is loaded
 */
function initializeEventListeners() {
  // Back button event listener
  const backButton = document.getElementById('back-button')
  if (backButton) {
    backButton.addEventListener('click', stopPlayback)
  }

  // Mute button event listener
  const muteButton = document.getElementById('mute-button')
  if (muteButton) {
    muteButton.addEventListener('click', muteAudio)
  }

  // Episode card event listeners using event delegation
  const episodeContainer = document.getElementById('ep-card-container')
  if (episodeContainer) {
    episodeContainer.addEventListener('click', function (event) {
      // Find the closest episode card
      const episodeCard = event.target.closest('.ep-card')
      if (episodeCard) {
        // Get the episode number from data attribute
        const episodeNum = episodeCard.dataset.episode
        if (episodeNum) {
          playCrawl(parseInt(episodeNum))
        }
      }
    })
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEventListeners)
} else {
  // DOM is already loaded
  initializeEventListeners()
}
