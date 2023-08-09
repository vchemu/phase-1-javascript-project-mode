// Function to fetch pet data from the API
async function fetchPets() {
  try {
    const response = await fetch('https://api.petfinder.com/v2/animals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: XNEfj5Edft0EhlYmaAGmgfuW47PYZSShUQqnj4Tu1ubaRqPLaX,
        objectType: 'animals',
        objectAction: 'publicSearch',
        search: {
          resultStart: 0,
          resultLimit: 12,
        },
        fields: ['animalName', 'animalSpecies', 'animalBreed', 'animalAgeString', 'animalDescription', 'animalTemperament', 'animalPersonality', 'animalPurpose'],
      }),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching pet data:', error);
    return [];
  }
}

// Function to display the list of available pets
async function displayPetList() {
  const petListContainer = document.getElementById('petList');
  petListContainer.innerHTML = '';

  const pets = await fetchPets();

  pets.forEach((pet) => {
    const petItem = document.createElement('div');
    petItem.classList.add('pet-item');
    petItem.innerHTML = `
      <h2>${pet.animalName}</h2>
      <p>Type: ${pet.animalSpecies}</p>
      <p>Breed: ${pet.animalBreed}</p>
      <p>Age: ${pet.animalAgeString}</p>
      <button onclick="displayPetDetails('${pet.animalDescription}', '${pet.animalTemperament}', '${pet.animalPersonality}', '${pet.animalPurpose}')">View Details</button>
    `;
    petListContainer.appendChild(petItem);
  });
}

// Function to display pet details
function displayPetDetails(description, temperament, personality, purpose) {
  const petDetailsContainer = document.getElementById('petDetails');
  petDetailsContainer.innerHTML = `
    <h2>Pet Details</h2>
    <p>Description: ${description}</p>
    <p>Temperament: ${temperament}</p>
    <p>Personality: ${personality}</p>
    <p>Purpose: ${purpose}</p>
    <button onclick="displayAdoptionForm()">Adopt</button>
  `;
}

// Function to display the adoption form
function displayAdoptionForm() {
  const adoptionFormContainer = document.getElementById('adoptionForm');
  adoptionFormContainer.innerHTML = `
    <h3>Adoption Form</h3>
    <form>
      <label for="name">Name:</label>
      <input typr="text" id="name" required>

      <label for="phone">Phone:</label>
      <input type="tel" id="phone" required>

      <label for="message">Message:</label>
      <textarea id="message" required></textarea>

      <button type="submit">Submit</button>
    </form>
  `;
}

// Function to create a chatbox
function createChatbox() {
  const chatboxContainer = document.getElementById('chatbox');
  chatboxContainer.innerHTML = `
    <h3>Chatbox</h3>
    <!-- Add chatbox content and functionality here -->
  `;
}

// Initialize the app
async function initApp() {
  await displayPetList();
  createChatbox();
}

// Call initApp when the DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
