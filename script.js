let imageCount = 0;
let healthDays = 0;
let lastUpload = new Date();
let isDarkMode = false;
let currentAlbum = '';
let albums = [];
let coins = 0;
let hasPet = false;
let petType = '';

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  document.getElementById('themeButton').innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function updateCharacter() {
  const tree = document.getElementById('tree');
  if (!tree) return;

  const daysSince = Math.floor((new Date() - lastUpload) / (1000 * 60 * 60 * 24));
  const scale = Math.min(1.4, 0.6 + (imageCount * 0.1));
  const rotate = Math.sin(Date.now() / 3000) * 1.5;

  let svg = '';

  switch (currentAlbum) {
    case 'pine':
      svg = `<path d="M48,120 L52,120 L50,40" fill="#795548"/><path d="M30,90 L50,30 L70,90" fill="#1565C0"/>`;
      break;
    case 'oak':
      svg = `<path d="M48,120 L52,120 L50,40" fill="#795548"/><circle cx="50" cy="40" r="30" fill="#1565C0"/>`;
      break;
    case 'cherry':
      svg = `<path d="M48,120 L52,120 L50,40" fill="#795548"/><circle cx="50" cy="40" r="25" fill="#64B5F6"/><circle cx="45" cy="30" r="3" fill="#E91E63"/>`;
      break;
    case 'maple':
      svg = `<path d="M48,120 L52,120 L50,40" fill="#795548"/><path d="M30,40 L70,40 L50,10 Z" fill="#1565C0"/>`;
      break;
    case 'archer':
      svg = `<path d="M45,120 L55,120 L52,70 L48,70 Z" fill="#228B22"/><circle cx="50" cy="55" r="15" fill="#90EE90"/>`;
      break;
    case 'wizard':
      svg = `<path d="M45,120 L55,120 L52,70 L48,70 Z" fill="#4527A0"/><circle cx="50" cy="55" r="15" fill="#7B1FA2"/>`;
      break;
    default:
      svg = `<path d="M48,120 L52,120 L50,40" fill="#795548"/><path d="M30,40 L70,40 L50,10 Z" fill="#2196F3"/>`;
  }

  tree.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">${svg}</svg>')`;

  tree.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
  tree.style.filter = daysSince > 3
    ? `grayscale(${Math.min(100, daysSince * 20)}%) brightness(${Math.max(0.7, 1 - daysSince * 0.05)})`
    : 'none';

  document.getElementById('healthDays').textContent = healthDays;
  document.getElementById('imageCount').textContent = imageCount;
}

function updateAlbumVisibility() {
  const select = document.getElementById('albumSelect');
  const prompt = document.getElementById('firstAlbumPrompt');
  select.innerHTML = '';

  if (albums.length > 0) {
    albums.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    const newOpt = document.createElement('option');
    newOpt.value = 'new';
    newOpt.textContent = '+ New Album';
    select.appendChild(newOpt);

    select.style.display = 'block';
    prompt.style.display = 'none';
  } else {
    select.style.display = 'none';
    prompt.style.display = 'block';
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

function createAlbum() {
  const nameInput = document.getElementById('newAlbumName');
  const type = document.getElementById('treeType').value;
  const name = nameInput.value.trim();

  if (!name || albums.includes(name)) {
    alert("Please enter a unique album name.");
    return;
  }

  albums.push(name);
  currentAlbum = type;

  nameInput.value = '';
  document.querySelector('.new-album').style.display = 'none';

  updateAlbumVisibility();
  updateCharacter();

  alert(`Album "${name}" with type "${type}" created!`);
}

function uploadImage() {
  const input = document.getElementById('imageUpload');
  if (!input.files || !input.files[0]) {
    alert('Please select an image.');
    return;
  }

  imageCount++;
  healthDays++;
  coins += 10;
  lastUpload = new Date();

  document.getElementById('coins').textContent = coins;
  input.value = '';
  updateCharacter();
}

function buyPet(type) {
  if (hasPet) return alert("You already have a pet!");
  if (coins < 50) return alert("You need 50 coins!");

  hasPet = true;
  coins -= 50;
  petType = type;

  document.getElementById('coins').textContent = coins;
  document.getElementById('pet').style.display = 'block';

  const petSVG = type === 'cat'
    ? `<circle cx="50" cy="50" r="30" fill="%23808080"/><circle cx="35" cy="40" r="5" fill="black"/><circle cx="65" cy="40" r="5" fill="black"/>`
    : `<circle cx="50" cy="50" r="30" fill="%23A0522D"/><circle cx="35" cy="40" r="5" fill="black"/><circle cx="65" cy="40" r="5" fill="black"/>`;

  document.getElementById('pet').style.backgroundImage =
    `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${petSVG}</svg>')`;

  alert(`You bought a ${type}!`);
}

setInterval(updateCharacter, 1000 * 60 * 5);
updateAlbumVisibility();
updateCharacter();
