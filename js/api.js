const API_KEY = "31d25af170cf4f988d9c79d55529044e";
const BASE_URL = "https://api.football-data.org/v2/";

const ID_LIGA = 2021;

const KLASEMEN = `${BASE_URL}competitions/${ID_LIGA}/standings`;
const JADWAL = `${BASE_URL}competitions/${ID_LIGA}/matches?status=SCHEDULED&limit=20`; 
const TIM = `${BASE_URL}teams/`;


let fetchApi = url => {
  return fetch(url, {
    
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}
// let base_url = "https://readerapi.codepolitan.com/";
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

// KLASEMEN LIGA----------------------------------------------------------------------------------KLASEMEN LIGA
function getAllStandings() {
    if ("caches" in window) {
        caches.match(KLASEMEN).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    
                    showStanding(data);
                })
            }
        })
    }

    fetchApi(KLASEMEN)
    .then(status)
    .then(json)
    .then(function(data) {
      // console.log(data) ;
      showStanding(data);
    })
    .catch(error);
    
}

function showStanding(data) {
    let standings = "";
    let standingElement =  document.getElementById("homeStandings");

    data.standings[0].table.forEach(function (standing) {
        standings += `
            <tr>
                <td>${standing.position}</td>
                <td>
                <a href="./team.html?id=${standing.team.id}">
                <p class="hide-on-small-only">
                    <img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="20px" alt="badge" align="center"/> ${standing.team.name}
                </p>
                    <img class="show-on-small-only hide-on-med-and-up" src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="20px" alt="badge" align="center"/>
                </a>
                </td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.points}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
            </tr>
        `;
    });

    standingElement.innerHTML = `
        <div class="card #e0e0e0 grey lighten-2" style="padding-left: 10px; padding-right: 10px; margin-top: 10px;">
            <table class="striped responsive-table highlight">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Team Name</th>
                        <th>Won</th>
                        <th>Draw</th>
                        <th>Lost</th>
                        <th>Points</th>
                        <th>GFor</th>
                        <th>GAgaints</th>
                        <th>GDiff</th>
                    </tr>
                </thead>
                <tbody id="standings">
                    ${standings}
                </tbody>
            </table>
        </div>
    `;
}



// JADWAL TANDING TIM----------------------------------------------------------------------------JADWAL TANDING TIM
function getAllMatches() {
    if ("caches" in window) {
        caches.match(JADWAL).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    
                    showMatch(data);
                })
            }
        })
    }

    fetchApi(JADWAL)
    .then(status)
    .then(json)
    .then(function(data) {
      // console.log(data) ;
      showMatch(data);
    })
    .catch(error);
}

function showMatch(data) {
    let matches = "";
    let matchElement =  document.getElementById("jadwal");

    data.matches.forEach(function (match) {
        matches += `
                <tr>
                    <td>${match.matchday}</td>
                    <td>${match.utcDate}</td>
                    <td><img class="responsive-img" width="20px" style="margin-right:5px" align="center" src="https://crests.football-data.org/${match.homeTeam.id}.svg"
                    }">${match.homeTeam.name}</td>
                    <td><img class="responsive-img" width="20px" style="margin-right:5px" align="center" src="https://crests.football-data.org/${match.awayTeam.id}.svg"
                    }">${match.awayTeam.name}</td>
                    <td>${match.score.fullTime.homeTeam == null ? "-" : match.score.fullTime.homeTeam} 
                    : ${match.score.fullTime.awayTeam == null ? "-" : match.score.fullTime.awayTeam}
                    </td>
                </tr>
        `;
    });

        matchElement.innerHTML = `
            <div class="card #e0e0e0 grey lighten-2" style="padding-left: 10px; padding-right: 10px; margin-top: 10px;">
                <table class="highlight striped responsive-table">
                    <thead>
                        <tr>
                            <th>Mday</th>
                            <th>Date</th>
                            <th>Home Team</th>
                            <th>Away Team</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody id="matches">
                        ${matches}
                    </tbody>
                </table>   
            </div>
        `;
}

// DETAIL TIM ---------------------------------------------------------------------------DETAIL TIM
function getDetailTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    let dataSquadHTML = ''
    let tabelSquadHTML = ''
        if ("caches" in window) {
            caches.match(TIM + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        // Objek JavaScript dari response.json() masuk lewat letiabel data.
                        //console.log(data);
                        // Menyusun komponen card artikel secara dinamis
                        resultDetailTeamJSON(data)
                        
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }
            });
        }

    fetchApi(TIM + idParam)
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek JavaScript dari response.json() masuk lewat letiabel data.
            console.log(data);
            // Menyusun komponen card artikel secara dinamis
            resultDetailTeamJSON(data)
            dataTeamJSON = data;
            
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
        })
        .catch(error);
    });
}


function resultTeamFav(data) {

    let dataIndexDb = getAllData("team_Favorite");
    dataIndexDb.then(function (data) {

    let dataTeamFavHtml = ''
    data.forEach(function (team) {
        
        dataTeamFavHtml += `
            <div class="col s12 m6">
                <div class="card">
                    <div class="card-content">
                        <a href="./team.html?id=${team.id}">
                        <img src=${team.crestUrl.replace(/^http:\/\//i, 'https://')} align="center" width="100" height="100" vspace="25">
                        <span class="card-title center-align">${team.name}</span>
                        </a>
                        <hr>
                        
                        <div class="#e0e0e0 grey lighten-2">                      
                        <p>Address: ${team.address}<br>
                        <p>E-mail: ${team.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    if(data.length == 0) dataTeamFavHtml += '<h6 class="center-align">Tidak ada Tim favorit!</6>'

    // Sisipkan komponen card ke dalam elemen dengan id divFavorit
    document.getElementById("IsiFavorit").innerHTML = dataTeamFavHtml;
    });
}












