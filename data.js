let responses = [];
const userResponsesSection = document.querySelector('#user-responses');

const nameSelect = document.querySelector('#name');
const favouriteSnackSelect = document.querySelector('#favorite-snack');
const favouriteCountrySelect = document.querySelector('#favourite-country');
const searchInput = document.querySelector('#search');

const fetchUserResponses = async () => {
  const response = await fetch(
    'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vT-qq72MCgYI2Gmt6MCkiqYejVbxvSfuG9oQKBcj-6BIwJSVuN23yTSUKa-f5xoiaDl7FyA8nBNPVuO/pub?output=csv'
  );
  const data = await response.text();
  const results = Papa.parse(data, { header: true });
  responses = results.data;
};

const renderUserResponse = userResponse => {
  console.log(userResponse);
  const vacationTime =
    userResponse[
      'During vacation time, what has been your favourite travel destination to-date?'
    ];
  const countriesToTravel =
    userResponse[
      'If you could only go to one of the following countries, which one would you choose!'
    ];
  const workExperience =
    userResponse[
      'In 2-3 sentences, please describe your most memorable work experience at RBI. (Be creative!)'
    ];
  const travelDestination =
    userResponse[
      'On a scale of 1-5, how likely are you to return to that travel destination? '
    ];
  const burgerKingLogo =
    userResponse[
      "Over the brand's 70 year history, which Burger King logo has been your favorite? Please upload an example of your favorite logo. "
    ];
  console.log(burgerKingLogo);
  const brandInteraction =
    userResponse['What brand do you interact with most as part of your job?'];
  const name = userResponse['What is your first and last name?'];
  const indulgentSnack =
    userResponse['Which brand carries your favorite indulgent snack? '];
  const googlePhotoId = burgerKingLogo.split('id=')[1];
  console.log(googlePhotoId);
  return `
    <div class="user-response">
    <h2>${name}</h2>
    <h3> I interact most with ${brandInteraction} most as part of my job </h3>
    <img src="https://drive.google.com/thumbnail?id=${googlePhotoId}" alt="logo" />
    <h4> ${indulgentSnack} carries my favourite indulgent snack! </h4>
    <p> 🏆 My most memorable experience at RBI was ${workExperience} </p>
    <p> 🏄🏻‍♂️During vaction time, my favourite travel destination has been ${vacationTime} </p>
    <p> 🌎On a scale of 1-5, the likeliness I would return to that same travel destination would be a ${travelDestination} </p>
    <h4> If I could only go to one country, I would choose ${countriesToTravel} </h4>
    </div>
  `;
};

const fetchAndShowResponses = async () => {
  await fetchUserResponses();
  const eachUserResponseHTML = responses.map(renderUserResponse);
  const allUserResposnesHTML = eachUserResponseHTML.join('');
  userResponsesSection.innerHTML = allUserResposnesHTML;
};

fetchAndShowResponses();

const teamFilter = team => {
  const selectedFavouriteSnack = favouriteSnackSelect.value;
  console.log(selectedFavouriteSnack);
  const selectedFavouriteCountry = favouriteCountrySelect.value;
  const selectedName = nameSelect.value;
  const searchTerm = searchInput.value.toLowerCase();
  console.log({
    teamFavourite: team['Which brand carries your favorite indulgent snack? '],
    selectedFavouriteSnack,
  });
  return (
    (selectedFavouriteSnack === 'all' ||
      selectedFavouriteSnack
        .toLowerCase()
        .includes(
          team[
            'Which brand carries your favorite indulgent snack? '
          ].toLowerCase()
        )) &&
    (selectedFavouriteCountry === 'all' ||
      team[
        'If you could only go to one of the following countries, which one would you choose!'
      ] === selectedFavouriteCountry) &&
    (selectedName === 'all' ||
      team['What is your first and last name?'] === selectedName) &&
    team['What is your first and last name?'].toLowerCase().includes(searchTerm)
  );
};

const handleFilterInput = () => {
  const filteredteamFilter = responses.filter(teamFilter);
  userResponsesSection.innerHTML = filteredteamFilter
    .map(renderUserResponse)
    .join('');
};

favouriteSnackSelect.addEventListener('input', handleFilterInput);
nameSelect.addEventListener('input', handleFilterInput);
favouriteCountrySelect.addEventListener('input', handleFilterInput);
searchInput.addEventListener('input', handleFilterInput);

const question = 'Which country would you prefer to travel for vacation?';

const votes = {
  France: 0,
  Germany: 0,
  Singapore: 0,
  Thailand: 0,
};

responses.forEach(response => {
  votes[response[question]] += 1;
});

const franceSpan = document.querySelector('#france-votes');
const germanySpan = document.querySelector('#germany-votes');
const singaporeSpan = document.querySelector('#singapore-votes');
const thailandSpan = document.querySelector('#thailand-votes');

franceSpan.textContent = votes.France;
germanySpan.textContent = votes.Germany;
singaporeSpan.textContent = votes.Singapore;
thailandSpan.textContent = votes.Thailand;

new Chart('pie-chart', {
  type: 'pie',
  data: {
    datasets: [
      {
        data: Object.values(votes),
        backgroundColor: [
          'rgb(195,226,228)',
          'rgb(170,207,213)',
          'rgb(104,184,193)',
        ],
      },
    ],
    labels: Object.keys(votes),
  },
});
