// see https://github.com/mu-semtech/mu-javascript-template for more info
import { app, errorHandler } from 'mu';
import QueryHandler from './queries';
import { fetchTriples } from './information-capturing';

const PUBLIC_GRAPH = "http://mu.semte.ch/graphs/public";
const VALIDATOR_GRAPH = "http://data.toevla.org/inter";

/**
 * Get's a museum's uri given its uuid or throws an error.
 *
 * @param {string} uuid The uuid of the museum.
 * @throws Error when no URI could be found.
 */
async function getMuseumUri(uuid) {
  const db = new QueryHandler();
  const museumUri = await db.findMuseumUriForId(uuid);
  if (!museumUri)
    throw `Could not find museum with id ${uuid}`;
  else
    return museumUri;
}

app.get('/', function(_req, res) {
  res.send('Hello mu-javascript-template');
});

app.post('/museum/:id/from-public', async function(req, res) {
  const db = new QueryHandler();
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);

    const sourceTriples = await fetchTriples(PUBLIC_GRAPH, museumUri);
    const targetTriples = await fetchTriples(VALIDATOR_GRAPH, museumUri);

    console.log({ sourceTriples, targetTriples });
    // FUTURE: lockMuseum( museumUri, museumUri );
    if (targetTriples.length > 0)
      await db.removeTriples(VALIDATOR_GRAPH, targetTriples);
    if (sourceTriples.length > 0)
      await db.insertTriples(VALIDATOR_GRAPH, sourceTriples);
    // clearMuseum( museumUri, museumUri );
    // copyMuseum( museumUri, triples );

    res.status(200).send(JSON.stringify(sourceTriples));
    // res.status(200).send(museumUri);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});

app.delete('/museum/:id/from-validator', async function(req, res) {
  const db = new QueryHandler();
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);

    const targetTriples = await fetchTriples(VALIDATOR_GRAPH, museumUri);

    if (targetTriples.length > 0)
      await db.removeTriples(VALIDATOR_GRAPH, targetTriples);

    res.status(200).send("DONE!");
    // res.status(200).send(museumUri);
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
});


app.use(errorHandler);
