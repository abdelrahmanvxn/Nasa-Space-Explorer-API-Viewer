const fetchImg = document.getElementById('getImageBtn');
const imgContainer = document.getElementById('gallery');
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// --- Modal structure ---
const modal = document.createElement('div');
modal.id = 'modal';
modal.classList.add('modal');
modal.innerHTML = `
  <div id="modal-content" class="modal-content" role="dialog" aria-modal="true">
    <div class="modal-header">
      <button id="close-modal" class="close-modal" aria-label="Close">&times;</button>
    </div>
    <div id="modal-scroll" class="modal-scroll">
      <img id="modal-image" src="" alt="" />
      <h2 id="modal-title"></h2>
      <p id="modal-date"></p>
      <p id="modal-explanation"></p>
    </div>
    <div class="modal-buttons" id="modal-links"></div>
  </div>
`;
document.body.appendChild(modal);

// --- Close logic ---
function closeModal() {
  modal.style.display = 'none';
}

// Click outside modal-content
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close button
document.addEventListener('click', (e) => {
  if (e.target.id === 'close-modal') closeModal();
});

// ✅ Close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Add a loading message element
const loadingMessage = document.createElement('div');
loadingMessage.id = 'loading-message';
loadingMessage.textContent = '🔄 Loading space photos…';
loadingMessage.style.textAlign = 'center';
loadingMessage.style.fontSize = '18px';
loadingMessage.style.margin = '20px';
loadingMessage.style.display = 'none'; // Initially hidden
imgContainer.appendChild(loadingMessage);

// Remove placeholder when fetching images
const placeholder = document.querySelector('.placeholder');

fetchImg.addEventListener('click', () => {
  // Hide the placeholder
  if (placeholder) {
    placeholder.style.display = 'none';
  }

  // Show the loading message
  loadingMessage.style.display = 'block';

  setTimeout(() => {
    fetch(apodData)
      .then(response => response.json())
      .then(data => {
        // Remove the loading message
        loadingMessage.style.display = 'none';

        imgContainer.innerHTML = ''; // clear gallery
        data.forEach(item => {
          const mediaContainer = document.createElement('div');
          mediaContainer.classList.add('gallery-item');

          if (item.media_type === 'video' && item.url.includes('youtube.com')) {
            const iframe = document.createElement('iframe');
            iframe.src = item.url;
            iframe.title = item.title;
            iframe.width = '100%';
            iframe.height = '280';
            iframe.frameBorder = '0';
            iframe.allow =
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            mediaContainer.appendChild(iframe);
          } else if (item.media_type === 'image') {
            const imgElement = document.createElement('img');
            imgElement.src = item.url;
            imgElement.alt = item.title;
            imgElement.classList.add('nasa-image');
            imgElement.addEventListener('click', () => {
              document.getElementById('modal-image').src = item.url;
              document.getElementById('modal-title').textContent = item.title;
              document.getElementById('modal-date').textContent = `Date: ${item.date}`;
              document.getElementById('modal-explanation').textContent = item.explanation;
              document.getElementById('modal-links').innerHTML = `
                <div class="link-row">
                  <a href="${item.hdurl}" target="_blank" class="btn-link">Full HD</a>
                  <a href="${item.url}" target="_blank" class="btn-link">HD</a>
                </div>`;
              modal.style.display = 'flex';
            });
            mediaContainer.appendChild(imgElement);
          }

          const mediaInfo = document.createElement('div');
          mediaInfo.classList.add('media-info');
          mediaInfo.innerHTML = `
            <strong>${item.title}</strong><br>
            Date: ${item.date}<br>
            <em>${item.copyright || 'Public Domain'}</em>`;
          mediaContainer.appendChild(mediaInfo);

          imgContainer.appendChild(mediaContainer);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        loadingMessage.textContent = '❌ Failed to load space photos. Please try again.';
      });
  }, 1000); // Show loading message for 1 second
});

// Array of fun space facts
const spaceFacts = [
  "Did you know? The Sun is 400 times larger than the Moon but also 400 times farther away, making them appear the same size in the sky!",
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? There are more stars in the universe than grains of sand on Earth!",
  "Did you know? Saturn's moon Titan has a thick atmosphere and lakes of liquid methane!",
  "Did you know? The footprints left by astronauts on the Moon will remain there for millions of years!"
];

// Function to display a random space fact
function displaySpaceFact() {
  const factContainer = document.getElementById('space-fact');
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  factContainer.textContent = randomFact;
}

// Hide the space fact when the fetch button is clicked
const fetchButton = document.getElementById('getImageBtn');
fetchButton.addEventListener('click', () => {
  const factContainer = document.getElementById('space-fact');
  factContainer.style.display = 'none';
});

// Call the function on page load
document.addEventListener('DOMContentLoaded', displaySpaceFact);
