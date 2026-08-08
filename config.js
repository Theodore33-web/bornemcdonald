/* =========================================================
   CONFIGURATION — API Google Drive
   =========================================================
   1. Va sur https://console.cloud.google.com/
   2. Crée un projet, puis active l'API "Google Drive API"
      (menu "API et services" > "Bibliothèque").
   3. Dans "API et services" > "Identifiants", crée une
      "Clé API" et restreins-la à l'API Google Drive.
   4. Crée un dossier Google Drive, mets-y tes images
      (ex: big-mac.jpg, cheeseburger.jpg, coca-cola.jpg, ...
      le NOM du fichier doit correspondre au champ "image"
      de chaque produit dans js/data.js, sans l'extension).
   5. Partage ce dossier en "Tous les utilisateurs disposant
      du lien" > "Lecteur".
   6. Récupère l'ID du dossier dans son URL :
      https://drive.google.com/drive/folders/CET_ID_LA
   7. Colle la clé API et l'ID du dossier ci-dessous.

   Tant que ces deux valeurs sont vides, le site fonctionne
   en mode démo avec des vignettes de remplacement.
   ========================================================= */

const DRIVE_CONFIG = {
  API_KEY: "",      // ex: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  FOLDER_ID: "",     // ex: "1A2b3C4d5E6f7G8h9I0jKLmNoPQRstuv"
};
