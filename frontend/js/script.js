//api token
const access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJYUVRKTXFPRnpFTFg5ek5kMkpXS3l6TzhkTWVubTI1VFZnaGNjYkltZWY0RnNyMFMzNCIsImp0aSI6IjM5ZjU0ZDM1Y2E4ZjkyMDkwYWIxOTc1YjNmNTk3OTQ0M2ZhMzc2NDlkMjY4MmIxNTg1YmNmOTNjZWRiMTRkNDNjOGIxMzM2NzEyYWMzZTUzIiwiaWF0IjoxNjkxNTE0Njg5LCJuYmYiOjE2OTE1MTQ2ODksImV4cCI6MTY5MTUxODI4OSwic3ViIjoiIiwic2NvcGVzIjpbXX0.BmXVqqUSDdEj7h0XswPQYI7SQ7LJ5dVgvE_JM3YM804FrQR_KuRUJknPgT66N_KgjRKMj1zWPVLRZs-ieI9mqQ2NzQiuZMJaTmVOcIw6ChUWF6TnVIcOsDh6sAZmjD2lOyp6wqX_S4gc9isEHPfLIjMjp5jqJ1FQC11I--OqGQsxF8qFXbd35PKo4gujGzrBie7mIhod5eZUZaCEzS3oIuX0Le7Haisg7SDkUW0fTVLERDQ6-vst_G-iMUZw-oQCwLvP4_R1yi8YWl7cfWLOjeeojwR_Co99avhhs8lzni0MM9T1jRBweVFMF2yjIKG1jKuZCeIUvysY1aQ62vf_eA";

//Initialize liked pets and like counts from local storage
let likedPets = JSON.parse(localStorage.getItem('likedPets')) || {};
let likeCounts = JSON.parse(localStorage.getItem('likeCounts')) || {};

// Construct the request headers with the access token
const headers = new Headers();
headers.append('Authorization', `Bearer ${access_token}`);

// Construct the query parameters
const queryParams = new URLSearchParams();
queryParams.append('type', 'dog'); 
queryParams.append('breed', 'pug');
queryParams.append('size', 'small');
queryParams.append('gender', 'male');
queryParams.append('age', 'baby'); 
queryParams.append('limit', '15'); 

//field expansion for photos and description
queryParams.append('fields', 'photos,description');

// Construct the full URL with query parameters
const apiUrl = `https://api.petfinder.com/v2/animals?${queryParams.toString()}`;

// Make the GET request to retrieve animals
fetch(apiUrl, {
  method: 'GET',
  headers: headers
})
  .then(response => response.json())
  .then(data => {
    const petGallery = document.getElementById('petGallery');

    // Process the data and populate the HTML
    data.animals.forEach(animal => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      petCard.innerHTML = `
        <img src="${animal.photos[0]?.medium}" alt="${animal.name}">
        <h2>Name: ${animal.name}</h2>
        <p>Type: ${animal.type}</p>
        <p>Breed: ${animal.breeds.primary}</p>
        <p>Age: ${animal.age}</p>
        <p>Description: ${animal.description}</p>
        <button class="like-button" data-pet-id="${animal.id}">Like</button>
        <span class="likes-count">0</span>
      `;
    
      const petGallery = document.getElementById('petGallery');
      petGallery.appendChild(petCard);
    

      const likeButton = petCard.querySelector('.like-button');
      const likesCountElement = petCard.querySelector('.likes-count');

      likeButton.addEventListener('click', () => {
        if (!likedPets[animal.id]) {
          likedPets[animal.id] = true;
          likeCounts[animal.id] = (likeCounts[animal.id] || 0) + 1;
        } else {
          likedPets[animal.id] = false;
          likeCounts[animal.id] = (likeCounts[animal.id] || 1) - 1;
        }

        localStorage.setItem('likedPets', JSON.stringify(likedPets));
        localStorage.setItem('likeCounts', JSON.stringify(likeCounts));

        likeButton.classList.toggle('liked', likedPets[animal.id]);
        likeButton.textContent = likedPets[animal.id] ? 'Liked' : 'Like';
        likesCountElement.textContent = likeCounts[animal.id];
      });
      const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // Liked state has changed
            const likeButton = mutation.target;
            const isLiked = likeButton.classList.contains('liked');
            const petId = likeButton.dataset.petId;
      
            // Perform any actions you want when the liked state changes
            console.log(`Liked state changed for pet ${petId}. Liked: ${isLiked}`);
          }
        }
      });
      
      // Observe changes to the class attribute of all like buttons
      const likeButtons = document.querySelectorAll('.like-button');
      likeButtons.forEach(likeButton => {
        observer.observe(likeButton, { attributes: true });
      });
    });
  })
  .catch(error => {
    console.error('Error fetching animals:', error);
  });





