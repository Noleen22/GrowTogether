let albums = [];
let currentAlbum = 'nature';
let imageCount = 0;
let healthDays = 0;
let lastUpload = new Date();
let coins = 0;
let hasPet = false;
let petType = '';
let isDarkMode = false;

document.addEventListener("DOMContentLoaded", () => {
  updateAlbumVisibility();
  updateCharacter();
  setInterval(updateCharacter, 1000 * 60 * 60 * 6);
});

function updateAlbumVisibility() {
  const albumSelect = document.getElementById('albumSelect');
  const firstAlbumPrompt = document.getElementById('firstAlbumPrompt');
  albumSelect.innerHTML = '';

  if (albums.length > 0) {
    firstAlbumPrompt.style.display = 'none';
    albumSelect.style.display = 'block';

    albums.forEach(album => {
      const option = document.createElement('option');
      option.value = album;
      option.textContent = album;
      albumSelect.appendChild(option);
    });

    const newOption = document.createElement('option');
    newOption.value = 'new';
    newOption.textContent = '+ Neues Album';
    albumSelect.appendChild(newOption);
  } else {
    albumSelect.style.display = 'none';
    firstAlbumPrompt.style.display = 'block';
  }
}

function createAlbum() {
  const newAlbumInput = document.getElementById('newAlbumName');
  const treeTypeSelect = document.getElementById('treeType');
  const newAlbumName = newAlbumInput.value.trim();
  const treeType = treeTypeSelect.value;

  if (newAlbumName && !albums.includes(newAlbumName)) {
    albums.push(newAlbumName);
    currentAlbum = treeType;
    newAlbumInput.value = '';
    document.querySelector('.new-album').style.display = 'none';
    updateAlbumVisibility();
    updateCharacter();
    alert(`Album "${newAlbumName}" mit Baumtyp "${treeType}" erstellt!`);
  } else {
    alert('Bitte gib einen eindeutigen Albumnamen ein!');
  }
}

function changeAlbum() {
  const selected = document.getElementById('albumSelect').value;
  if (selected === 'new') {
    document.querySelector('.new-album').style.display = 'flex';
  } else {
    currentAlbum = selected;
    updateCharacter();
  }
}

function uploadImage() {
  const input = document.getElementById('imageUpload');
  if (input.files && input.files[0]) {
    imageCount++;
    healthDays++;
    lastUpload = new Date();
    coins += 10;
    updateCharacter();
    input.value = '';
  } else {
    alert('Bitte wähle ein Bild aus!');
  }
}

function updateCharacter() {
  const tree = document.getElementById('tree');
  const daysSinceUpload = Math.floor((new Date() - lastUpload) / (1000 * 60 * 60 * 24));
  const scale = Math.min(1.4, 0.6 + (imageCount * 0.1));
  const rotation = Math.sin(Date.now() / 3000) * 1.5;

  // Replace this block with your SVG logic per album
  tree.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" ... ></svg>')`;

  tree.style.filter = daysSinceUpload > 3
    ? `grayscale(${Math.min(100, daysSinceUpload * 20)}%) brightness(${Math.max(0.7, 1 - (daysSinceUpload * 0.05))})`
    : 'none';

  tree.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

  document.getElementById('imageCount').textContent = imageCount;
  document.getElementById('healthDays').textContent = healthDays;
  document.getElementById('coins').textContent = coins;
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  document.getElementById('themeButton').innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

function buyPet(type) {
  if (coins >= 50 && !hasPet) {
    coins -= 50;
    hasPet = true;
    petType = type;
    showPet();
    updateCharacter();
    alert(`Du hast ein ${type === 'cat' ? 'Kätzchen' : 'Hündchen'} gekauft!`);
  } else {
    alert(hasPet ? 'Du hast bereits ein Haustier!' : 'Du brauchst 50 Münzen!');
  }
}

function showPet() {
  if (!hasPet) return;
  const pet = document.getElementById('pet');
  pet.style.backgroundImage = petType === 'cat'
    ? "url('data:image/svg+xml;utf8,<svg xmlns=...>...</svg>')"
    : "url('data:image/svg+xml;utf8,<svg xmlns=...>...</svg>')";
  pet.style.display = 'block';
}
