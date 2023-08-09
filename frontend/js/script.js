document.addEventListener('DOMContentLoaded', () => {

  //api credentials 
   const client_id = "XQTJMqOFzELX9zNd2JWKyzO8dMenm25TVghccbImef4Fsr0S34";
   const client_secret = "fDAs8C5BtaboLNtDbcgLocABWSCKV45zbcGE1tFd";
 
   //create and configure the XMLHttpRequest object
   const xhr = new XMLHttpRequest();
   xhr.open('POST', "https://api.petfinder.com/v2/oauth2/token", true);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
 
   //onload function
   xhr.onload = function () { 
     if (xhr.status === 200) {
       const token_data = JSON.parse(xhr.responseText);
       const access_token = token_data.access_token;
 
       const headers = new Headers();
       headers.append('Authorization', `Bearer ${access_token}`);
 
       // Construct the query parameters
       const queryParams = new URLSearchParams();
       queryParams.append('type', 'dog'); 
       queryParams.append('breed', 'retriever');
       queryParams.append('size', 'small');
       queryParams.append('gender', 'male');
       queryParams.append('age', 'baby'); 
       queryParams.append('limit', '15'); 
 
       // Field expansion for photos and description
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
           
             petGallery.appendChild(petCard);
 
             const likeButton = petCard.querySelector('.like-button');
             const likesCountElement = petCard.querySelector('.likes-count');
             const likedPets = JSON.parse(localStorage.getItem('likedPets')) || {};
             const likeCounts = JSON.parse(localStorage.getItem('likeCounts')) || {};
 
             likeButton.addEventListener('click', () => {
               likedPets[animal.id] = !likedPets[animal.id];
               likeCounts[animal.id] = (likeCounts[animal.id] || 0) + (likedPets[animal.id] ? 1 : -1);
 
               localStorage.setItem('likedPets', JSON.stringify(likedPets));
               localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
 
               likeButton.classList.toggle('liked', likedPets[animal.id]);
               likeButton.textContent = likedPets[animal.id] ? 'Liked' : 'Like';
               likesCountElement.textContent = likeCounts[animal.id];
             });
           });
         })
         .catch(error => {
           console.error('Error fetching animals:', error);
         });
     } else {
       console.error('Request failed. Status:', xhr.status);
     }
   };
 
   // Construct the request data
   const data = new URLSearchParams();
   data.append('grant_type', 'client_credentials');
   data.append('client_id', client_id);
   data.append('client_secret', client_secret);
 
   // Send the request
   xhr.send(data);
 
   // Add event listener to clearLikesButton
   const clearLikesButton = document.getElementById('clearLikesButton');
   clearLikesButton.addEventListener('click', () => {
     localStorage.removeItem('likedPets');
     localStorage.removeItem('likeCounts');
   });
 
 });
 