// email-templates.ts
export const confirmationEmailTemplate = (confirmationCode: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérification d'email</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap">
      <style>
        body {
          font-family: 'Poppins', Arial, sans-serif; /* Use Poppins font */
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px; /* Added rounded corners */
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center; /* Center the content */
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        .verification-code {
          display: inline-block; /* Ensure inline-block for centering */
          font-size: 24px;
          font-weight: bold;
          color: #0069ff; /* Updated to the new blue color */
          margin: 20px 0; /* Updated margin for spacing */
          padding: 10px 20px; /* Added padding for round frame */
          border: 2px solid #0069ff; /* Added border */
          border-radius: 15px; /* Added border-radius for round frame */
        }
        .footer {
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Vérification d'email</h1>
        <p>Merci de vous être inscrit(e) ! Pour compléter votre inscription, veuillez utiliser le code de vérification suivant :</p>
        <p class="verification-code">${confirmationCode}</p>
        <div class="footer">
          <p>Ceci est un message automatisé. Veuillez ne pas répondre.</p>
          <p>www.dessa.tn</p>
        </div>
      </div>
    </body>
    </html>
    
    `;
  };
  
  export const passwordResetEmailTemplate = (resetToken: string): string => {
    return `

    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation votre mot de passe</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap">
      <style>
        body {
          font-family: 'Poppins', Poppins, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        .verification-code {
          display: inline-block;
          font-size: 24px;
          font-weight: bold;
          color: #0069ff;
          margin: 20px 0;
          padding: 10px 20px;
          border: 2px solid #0069ff;
          border-radius: 15px;
          text-decoration: none;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Réinitialisation de mot de passe</h1>
        <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="http://localhost:5173/reset-password/${resetToken}" class="verification-code">Réinitialiser</a>
        <div class="footer">
          <p>Ceci est un message automatisé. Veuillez ne pas répondre.</p>
          <p>www.dessa.tn</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };
  