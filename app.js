// see https://github.com/mu-semtech/mu-javascript-template for more info
import { app, errorHandler } from 'mu';
import QueryHandler from './queries';
import { fetchTriples } from './information-capturing';

const PUBLIC_GRAPH = "http://mu.semte.ch/graphs/public";
const VALIDATOR_GRAPH = "http://data.toevla.org/inter";
const MUSEUM_BASE_GRAPH = "http://data.toevla.org/musea/";

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

/**
 * Returns the graph in which the museum's local content is stored.
 *
 * @param {string} uuid Uuid of the museum.
 * @return {string} Graph in which the museum has its local information.
 */
function getMuseumGraph(uuid) {
  return `${MUSEUM_BASE_GRAPH}${uuid}`;
}

/**
 * Replaces the data of a museum which is in targetGraph, with the data
 * available in sourceGraph.
 *
 * @param {string} uri The uri of the museum.
 * @param {string} sourceGraph Originating graph.
 * @param {string} targetGraph Manipulated graph.
 */
async function sendMuseum(uri, sourceGraph, targetGraph) {
  const db = new QueryHandler();

  // FUTURE: lockMuseum( museumUri, museumUri );

  const sourceTriples = await fetchTriples(sourceGraph, uri);
  const targetTriples = await fetchTriples(targetGraph, uri);

  if (targetTriples.length > 0)
    await db.removeTriples(targetGraph, targetTriples);
  if (sourceTriples.length > 0)
    await db.insertTriples(targetGraph, sourceTriples);
}

/**
 * Send a museum from the museum graph to the validator
 *
 * This is used when a museum has executed changes and wants to send
 * them to inter.
 *
 * - id: the uuid of the museum
 */
app.post('/museum/:id/send-to-validator', async function(req, res) {
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);
    const museumGraph = getMuseumGraph(req.params.id);
    await sendMuseum(museumUri, museumGraph, VALIDATOR_GRAPH);

    res.status(200).send(JSON.stringify({ status: "done" }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

/**
 * Send a museum from the validator to public.
 *
 * This is used when a museum has executed changes and wants to send
 * them to inter.
 *
 * - id: the uuid of the museum
 */
app.post('/museum/:id/send-to-public', async function(req, res) {
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);
    await sendMuseum(museumUri, VALIDATOR_GRAPH, PUBLIC_GRAPH);

    res.status(200).send(JSON.stringify({ status: "done" }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

/**
 * Send a museum from the validator to the museum graph.
 *
 * - id: the uuid of the museum
 */
app.post('/museum/:id/send-to-museum', async function(req, res) {
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);
    const museumGraph = getMuseumGraph(req.params.id);
    await sendMuseum(museumUri, VALIDATOR_GRAPH, museumGraph);

    res.status(200).send(JSON.stringify({ status: "done" }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

/**
 * Import a museum from the public graph.
 *
 * This is mostly handy when pulling back musea from the public graph.
 *
 * - id: the uuid of the museum
 */
app.post('/museum/:id/from-public', async function(req, res) {
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);
    await sendMuseum(museumUri, PUBLIC_GRAPH, VALIDATOR_GRAPH);

    res.status(200).send(JSON.stringify({ status: "done" }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

/**
 * Removes a museum from the validator graph.
 *
 * Used as an administrative task.
 */
app.delete('/museum/:id/from-validator', async function(req, res) {
  const db = new QueryHandler();
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);

    const targetTriples = await fetchTriples(VALIDATOR_GRAPH, museumUri);

    if (targetTriples.length > 0)
      await db.removeTriples(VALIDATOR_GRAPH, targetTriples);

    res.status(200).send(JSON.stringify({ status: "done" }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

/**
 * Removes a museum from the public graph.
 *
 * Used as an administrative task.
 */
app.delete('/museum/:id/from-public', async function(req, res) {
  const db = new QueryHandler();
  // TODO: check access rights
  try {
    const museumUri = await getMuseumUri(req.params.id);

    const targetTriples = await fetchTriples(PUBLIC_GRAPH, museumUri);

    if (targetTriples.length > 0)
      await db.removeTriples(PUBLIC_GRAPH, targetTriples);

    res.status(200).send(JSON.stringify({ status: "done" }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});


app.use(errorHandler);
