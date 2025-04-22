import React, { useState } from 'react';

const UserRegistration = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (name && lastName && email) {
      const userData = { name, lastName, email, id: Date.now() }; // Utilise un ID unique (ici Date.now)
      localStorage.setItem(userData.id, JSON.stringify(userData)); // Sauvegarder l'utilisateur dans le localStorage
      setMessage("Félicitations, vous êtes inscrit et prêt à scanner votre carte !");
      onRegister(userData); // Passe l'utilisateur inscrit à l'application principale
    } else {
      setMessage("Tous les champs sont obligatoires.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Inscription pour le cadeau</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold">Nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-semibold">Prénom</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-2 border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full mt-4 hover:bg-blue-800">
          S'inscrire
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center">
          <p className="text-green-600">{message}</p>
        </div>
      )}
    </div>
  );
};

export default UserRegistration;
