const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Chemin vers le fichier de clés d'authentification
const credentialsPath = path.join(__dirname, 'testinscriptionbk-24cfe9b1d424.json');

// Chargement des informations d'identification
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Configuration OAuth2
const { client_email, private_key } = credentials;
const auth = new google.auth.JWT(
  client_email,
  null,
  private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

// ID de la feuille de calcul et nom de la feuille
const spreadsheetId = '12ea7KsUQttlAdBXO7sAQmx3aO16fG9NMfST_U_ZY42w';
const sheetName = 'Inscriptions';

// Créez une instance de Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Fonction pour ajouter des données à la feuille
async function appendToSheet(data) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:H`, // A à H = 8 colonnes
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
      values: data, // utilise les données passées en argument
      },
    });
    console.log('✅ Données ajoutées avec succès.');
    return response;
  } catch (error) {
    console.error('❌ Erreur d\'ajout à Google Sheets :', error);
    throw error;
  }
}

// Route POST pour ajouter des données
app.post('/add-to-sheet', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dob, city, address } = req.body;

    if (!firstName || !lastName || !email || !phone || !dob || !city || !address) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const timestamp = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
    });

    const newData = [[firstName, lastName, email, phone, dob, city, address, timestamp]];

    await appendToSheet(newData);
    res.status(200).json({ message: 'Données ajoutées avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout des données.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
