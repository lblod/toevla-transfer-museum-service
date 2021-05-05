// see https://github.com/mu-semtech/mu-javascript-template for more info
import { app, errorHandler } from 'mu';
import QueryHandler from './queries';
import domain from './domain';
import InformationCapturing from './information-capturing';

const VALIDATOR_GRAPH = "http://mu.semte.ch/graphs/public"; // TODO: Convert to actual validator graph

app.get('/', function(req, res) {
  res.send('Hello mu-javascript-template');
});

app.post('/museum/:id/to-museum', async function(req, res) {
  const db = new QueryHandler();
  // TODO: check access rights
  try {
    const museumUri = await db.findMuseumUriForId(req.params.id);
    if (!museumUri)
      throw `Could not find museum with id ${req.params.id}`;

    const ic = new InformationCapturing(VALIDATOR_GRAPH, museumUri);
    await ic.fetch();
    console.log( ic.triples.all() );
    // FUTURE: lockMuseum( museumUri, museumUri );

    const triples = ic.triples.all();
    // clearMuseum( museumUri, museumUri );
    // copyMuseum( museumUri, triples );

    res.status(200).send(JSON.stringify(ic.triples.all()));
    // res.status(200).send(museumUri);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }

});

app.use(errorHandler);
