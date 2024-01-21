import { colorSchemes } from "/static-data.js"

const inputColorEl = document.getElementById('input-color')
const currentSchemeEl = document.getElementById('current-scheme')
const selectorMenuEl = document.getElementById('scheme-menu')
const greyTickEl = document.getElementById('grey-tick')
const mainEl = document.getElementById('main')

const selectorTargetId = ['scheme-selector', 'current-scheme', 'grey-tick']

let showSelectorMenu = false
let selectedId = 0
let selectedColor = '#F55A5A'
let paletteAr = []

getPalette(selectedColor.slice(1), colorSchemes[selectedId])

inputColorEl.addEventListener('change', function(e) {
  selectedColor = e.target.value
})

document.body.addEventListener('click', function(e) {
  const targetId = e.target.id
  console.log(targetId)

  if (selectorTargetId.includes(targetId)) {
    showSelectorMenu = !showSelectorMenu
    greyTickEl.classList.toggle('rotate')
  } else if (targetId.startsWith('scheme-item-')) {
    selectedId = Number(targetId.slice(-1))
    currentSchemeEl.textContent = colorSchemes[selectedId]
    setToCloseMenu()
  } else if (targetId === 'check-tick'
    || (showSelectorMenu && !e.target.id.includes('scheme'))
    ) {
    setToCloseMenu()
  } else if (targetId === 'get-scheme-btn') {
    getPalette(selectedColor.slice(1), colorSchemes[selectedId])
    setToCloseMenu()
  }
  else if (targetId.startsWith('color-')) {
    const indexOfColor = Number(targetId.slice(-1))
    const notificationEl = document.getElementById('notification')
    navigator.clipboard.writeText(paletteAr[indexOfColor])
      .then(() => {
          notificationEl.style.display = 'block'
          notificationEl.style.left = `${indexOfColor * 20}%`
          setTimeout(function() {
            notificationEl.style.display = 'none'
        }, 2000)
      })
      .catch(err => {
          console.error('An error occurred while copying:', err)
      })
  }

  if (showSelectorMenu) {
    renderSchemeMenu()
  }
  selectorMenuEl.style.display = showSelectorMenu ? 'block' : 'none'
})

function getPalette(color, scheme) {
  fetch(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${scheme}&count=5`)
    .then(response => response.json())
    .then(data => {
      paletteAr = data.colors.map(color => color.hex.value)
      renderPalette(paletteAr)
    })
}

function setToCloseMenu() {
  showSelectorMenu = false
  greyTickEl.classList.remove('rotate')
}

function renderSchemeMenu() {
  const htmlSelectorMenu = colorSchemes.map((scheme, i) => {
    return `
      <div class="item-container">
        <p
          class="${i === selectedId
            ? "scheme-item scheme-item--selected"
            : "scheme-item"}"
          id="scheme-item-${i}"
        >
          ${scheme}
        </p>
        ${i === selectedId ? `<img
          src="./assets/check.svg"
          alt="tick for selected scheme"
          class="check-tick"
          id="check-tick"
        >` : ''}
      </div>
    `}).join('')
  selectorMenuEl.innerHTML = htmlSelectorMenu
}

function renderPalette(paletteAr) {
  const mainInnerHtml = paletteAr.map((color, i) => {
    return `
      <div class="color-container">
        <div
          class="color-bgc"
          id="color-bgc-${i}"
          style="background-color: ${color};"
          title="Click to copy"
        ></div>
        <p class="color-hex" id="color-hex-${i}" title="Click to copy">
          ${color}
        </p>
      </div>
    `
  }).join('')
  mainEl.innerHTML = mainInnerHtml + `
    <div id="notification">Color is copied!</div>
  `
}
