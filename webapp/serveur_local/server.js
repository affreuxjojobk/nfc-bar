const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Chargement des identifiants du compte de service
const credentials = JSON.parse(fs.readFileSync("credentials.json"));

// Authentification avec Google API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ID du fichier Google Sheets (copié depuis l'URL)
const spreadsheetId = '12ea7KsUQttlAdBXO7sAQmx3aO16fG9NMfST_U_ZY42w' ; // ← Mets ton ID réel ici
const range = "Inscriptions!A:H"; // Le nom de ton onglet

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:H:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;


// Route pour ajouter une inscription
app.post("/api/inscription", async (req, res) => {
  try {
    // Affiche l'URL de l'API pour déboguer
    console.log("URL de l'API:", url); // <-- Ajout ici

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '12ea7KsUQttlAdBXO7sAQmx3aO16fG9NMfST_U_ZY42w',
      range: 'Inscriptions!A:H',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          ["Fortuno", "Johanna", "johanna.doe@example.com", "0123456789", "01/01/1990", "Paris", "123 Rue de Paris"]
        ]
      }
    });
    console.log(response);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }

  res.status(200).send("Inscription ajoutée avec succès !");
} catch (error) {
    console.error("Erreur d’ajout à Google Sheets :", error);
    res.status(500).send("Erreur lors de l'inscription.");
  }
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
