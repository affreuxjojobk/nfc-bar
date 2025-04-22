import React, { useState } from 'react';
import { toast } from 'react-toastify';
import QRCodeGenerator from './QRCodeGenerator';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate(); // Hook pour redirection

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name && lastName && email && mobile) {
      const userID = Date.now();
      const userData = { name, lastName, email, mobile };
      localStorage.setItem(userID, JSON.stringify(userData));

      toast.success("✅ Utilisateur inscrit avec succès !");
      addUserToBrevo(userData);

      // Réinitialiser les champs
      setName('');
      setLastName('');
      setEmail('');
      setMobile('');

      // Rediriger vers /bar
      navigate("/bar");
    } else {
      toast.error("❌ Merci de remplir tous les champs !");
    }
  };

  const addUserToBrevo = (userData) => {
    const url = 'https://api.brevo.com/v3/contacts';
    const apiKey = 'votre_clé_api_Brevo'; // Remplace avec ta vraie clé
    const body = {
      email: userData.email,
      attributes: {
        FIRSTNAME: userData.name,
        LASTNAME: userData.lastName,
        MOBILE: userData.mobile
      },
      listIds: [1234],
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => console.log('Ajouté à Brevo :', data))
      .catch(err => console.error('Erreur Brevo:', err));
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Inscription Client</h2>

      <QRCodeGenerator />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Prénom"
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom"
          className="border p-2 w-full rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full rounded"
        />
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Téléphone"
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Signup;
