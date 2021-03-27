function databasePromise(idb) {
    let dbPromise = idb.open("db_bola", 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains("team_Favorite")) {
            let indexTeamFav = upgradeDb.createObjectStore("team_Favorite", {
                keyPath: "id"
            });
            indexTeamFav.createIndex("nameTeam", "name", {
                unique: false
            });
        }
    });
    return dbPromise;
}

function checkDataFav(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tx = db.transaction(storeName, "readonly");
                let store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function (data) {
                if (data != undefined) {
                    resolve("data favorit")
                } else {
                    reject("bukan data favorit")
                }
            });
    });
}


function deleteDatafav(storeName, data) {
    databasePromise(idb).then(function (db) {
        let tx = db.transaction(storeName, 'readwrite');
        let store = tx.objectStore(storeName);
        //console.log("deleteDataPlayerfav: cek id= " + data);
        store.delete(data);
        return tx.complete;
    }).then(function () {
        console.log('Team deleted');
        document.getElementById("iconFavorite").innerHTML = "favorite_border";
        M.toast({
            html: 'Data berhasil dihapus dari favorit!'
        });
    }).catch(function () {
        M.toast({
            html: 'terjadi kesalahan'
        });
    });
}

function createDataFav(dataType, data) {
    let storeName = "";
    let dataToCreate = {}
    if (dataType == "team") {
        storeName = "team_Favorite"
        dataToCreate = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl,
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            founded: data.founded,
            clubColors: data.clubColors,
            venue: data.venue,
            squad: data.squad
        }
    }
    console.log("data " + dataToCreate);
    databasePromise(idb).then(db => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(dataToCreate);

        return tx.complete;
    }).then(function () {
        console.log('team berhasil disimpan.');
        document.getElementById("iconFavorite").innerHTML = "favorite";
        M.toast({
            html: 'Data berhasil difavoritkan!'
        });
    }).catch(function () {
        M.toast({
            html: 'terjadi kesalahan'
        });
    });

}

function getSavedDataById(dataType) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = Number(urlParams.get("id"));

    if (dataType == "team") {
        
        getDataById("team_Favorite", idParam).then(function (team) {
            // Objek JavaScript dari response.json() masuk lewat letiabel data.
            console.dir("getSavedTeamById: " + team);
            // Menyusun komponen card artikel secara dinamis
            resultDetailTeamJSON(team)
            
            
        })
    } 
}

function getDataById(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tx = db.transaction(storeName, "readonly");
                let store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function getAllData(storeName) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tx = db.transaction(storeName, "readonly");
                let store = tx.objectStore(storeName);
                return store.getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}
