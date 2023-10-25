const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

const NewsletterModel = require('../models/NewsletterModel');

describe('NewsletterModel', () => {
  describe('saveOneEmail', () => {
    it('should save an email to the newsletter', async () => {
      // Créer un stub pour db.query pour simuler la requête
      const db = {
        query: sinon.stub().resolves({ /* Résultat simulé ici */ })
      };

      // Appeler la méthode saveOneEmail avec une requête simulée
      const req = { body: { email: 'test@example.com' } };
      const result = await NewsletterModel.saveOneEmail(req, db);

      // Vérifier que db.query a été appelé avec les bons arguments
      expect(db.query).to.have.been.calledOnceWith('INSERT INTO newsletter (email) VALUES (?)', ['test@example.com']);

      // Vérifier que la méthode renvoie le résultat simulé
      expect(result).to.deep.equal({ /* Résultat simulé ici */ });
    });

    //d'autres cas de test ici, à voir plus tard si y'a le temps.
  });
});
