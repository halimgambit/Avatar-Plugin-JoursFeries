exports.action = function(data, callback){


	var tblCommand = {

		feries : function() {  
						feries (data, client);
					},						
		command2 : function() {  
						command2 (data, client);
					}					
	};
	
	let client = setClient(data);

	info("JoursFeries:", data.action.command, "From:", data.client, "To:", client);
	tblCommand[data.action.command]();
	callback();
}


function feries (data, client) {

  const CleApi = Config.modules.JoursFeries.CleApi;

if (!CleApi) {
  Avatar.speak(`Pas de clé API sur le fichier propriété`, data.client, () => {
    Avatar.Speech.end(data.client);
  });
return;
}

fetch(`https://anyapi.io/api/v1/holidays?country=FR&language=fr&apiKey=${CleApi}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Code erreur: ${response.status}`);
    }
    return response.json();
  })
  .then(responseData => {
    const resData = responseData.holidays;

    const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

    const holidayInfo = resData.slice(0, 13).map((holiday, index) => {
      const dateOrigine = new Date(holiday.date);
      const jour = dateOrigine.getDate();
      const moisIndex = dateOrigine.getMonth();
      const annee = dateOrigine.getFullYear();
      const dateFormater = `${jour} ${mois[moisIndex]} ${annee}`;
      const message = `${dateFormater}: ${holiday.name}.`;

      setTimeout(() => {
        Avatar.speak(message, data.client, () => {
          if (index === 13) {
            Avatar.Speech.end(data.client);
          }
        });
      }, index * 5000);
    });
  })
  .catch(error => {
    Avatar.speak(`Erreur lors de la requête à l'API: ${error.message}`, data.client, () => {
      Avatar.Speech.end(data.client);
    });
  });


  
  
  
  }


function command2 (data, client) {

}


function setClient(data){
    var client = data.client;
    if (data.action.room)
    client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
    if (data.action.setRoom)
    client = data.action.setRoom;
    return client;
}
