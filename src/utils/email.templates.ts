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
        <a href="https://dessa.tn/reset-password/${resetToken}" class="verification-code">Réinitialiser</a>
        <div class="footer">
          <p>Ceci est un message automatisé. Veuillez ne pas répondre.</p>
          <p>www.dessa.tn</p>
        </div>
      </div>
    </body>
    </html>
    `;
};

export const newsletterUpdateTemplate = (subject: string, title: string, content: string): string => {
  return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mise à jour de la Newsletter</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: linear-gradient(135deg, #004ca3, #0065cc, #007bff);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            color: #ffffff;
          }
          .header {
            padding: 10px;
            text-align: center;
            background: linear-gradient(135deg, #0069ff, #2a82ff);
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #ffffff; 
          }
          .content {
            padding: 20px;
            text-align: left;
            line-height: 1.6;
            background-color: #ffffff;
            color: #000000; 
            border-top: 5px solid #0069ff;
          }
          .footer {
            background-color: #f0f0f0;
            text-align: center;
            padding: 10px;
            font-size: 0.8em;
            color: #333;
          }
          .social-links p {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${subject}</h2>
          </div>
          <div class="content">
           <h4>${title}</h4>
            <p>${content}</p>
          </div>
          <div class="footer">
            <div class="social-links">
              <p>Suivez-nous sur <a href="https://www.facebook.com/profile.php?id=61556276108446">Facebook</a> et <a href="https://www.instagram.com/dessa.tn/">Instagram</a></p>
            </div>
           <p>Ceci est un e-mail automatique, veuillez ne pas répondre.</p>
           <a href="https://dessa.tn">dessa.tn</a>
          </div>
        </div>
      </body>
      </html>
    `;



};

// Add this to your email-templates.ts

export const invoiceEmailTemplate = (invoice: { userFirstName: string, invoiceNumber: string, amount: number, date: string, description: string }): string => {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #ffffff;
        margin: 0;
        padding: 40px;
      }
      .container {
        max-width: 800px;
        margin: auto;
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
      }
      .header {
        background-color: #007bff;
        color: #ffffff;
        padding: 20px 40px;
        text-align: center;
        border-bottom: 1px solid #0069d9;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      }
      .body {
        padding: 20px 40px;
        background-color: #ffffff;
        color: #212529;
      }
      .invoice-details {
        background-color: #e9ecef;
        padding: 15px;
        border-radius: 8px;
        margin-top: 25px;
      }
      .invoice-details p {
        margin: 5px 0;
      }
      .footer {
        text-align: center;
        padding: 15px 0;
        background-color: #f8f9fa;
        color: #6c757d;
        font-size: 14px;
      }
      .footer p {
        margin: 0;
      }
      .company-details p {
        font-size: 0.8em;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Facture</h1>
      </div>
      <div class="body">
        <p>Salut ${invoice.userFirstName},</p>
        <p>Votre paiement a été effectué avec succès.</p>
        <div class="invoice-details">
          <p>Numéro de facture : ${invoice.invoiceNumber}</p>
          <p>Montant : ${invoice.amount} TND</p>
          <p>Date : ${invoice.date}</p>
          <p>Description : ${invoice.description}</p>
        </div>
      </div>
      <div class="footer">
        <p>Ce message est généré automatiquement, merci de ne pas y répondre.</p>
        <p><a href="https://www.dessa.tn" style="color: #007bff;">dessa.tn</a></p>
        <div class="company-details" style="margin-top: 20px;">
          <p>OTS - Omri Tech Solutions</p>
          <p>27, AV Habib Bourguiba Ariana - 2080</p>
          <p>+216 94 94 10 88</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  ;
};


