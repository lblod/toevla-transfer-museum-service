// see https://github.com/mu-semtech/mu-javascript-template for more info
import { app, errorHandler } from 'mu';
import QueryHandler, { ensureRoleIsMuseum, ensureRoleIsValidator, NoMatchingRoleError } from './queries';
import { fetchTriples, triplesMinus } from './information-capturing';

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
 * @param {boolean} validateSending? If truethy, we will validate
 *   whether all triples were correctly updated or not.
 */
async function sendMuseum(uri, sourceGraph, targetGraph, validateSending = true) {
  const db = new QueryHandler();

  // FUTURE: lockMuseum( museumUri, museumUri );

  const sourceTriples = await fetchTriples(sourceGraph, uri);
  const targetTriples = await fetchTriples(targetGraph, uri);

  const toRemove = triplesMinus(targetTriples, sourceTriples);
  const toAdd = triplesMinus(sourceTriples, targetTriples);

  if (toRemove.length > 0)
    await db.removeTriples(targetGraph, toRemove);
  if (toAdd.length > 0)
    await db.insertTriples(targetGraph, toAdd);

  if( validateSending ) {
    const newSourceTriples = await fetchTriples(sourceGraph, uri);
    const newTargetTriples = await fetchTriples(targetGraph, uri);

    const failedRemovals = triplesMinus(newTargetTriples, newSourceTriples);
    const failedAdditions = triplesMinus(newSourceTriples, newTargetTriples);

    const sendingComplete = failedRemovals.length == 0 && failedAdditions.length == 0;

    if( sendingComplete ) {
      console.log("Sending completed successfully, no missing triples");
    } else {
      console.log("Could not send successfully");
      console.log({
        toRemove: toRemove.map( (x) => JSON.stringify(x) ),
        failedRemovals: failedRemovals.map( (x) => JSON.stringify(x) ),
        toAdd: toAdd.map( (x) => JSON.stringify(x) ),
        failedAdditions: failedAdditions.map( (x) => JSON.stringify(x) ) });
    }

    return sendingComplete;
  }
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
  try {
    const museumUri = await getMuseumUri(req.params.id);
    const sessionUri = req.headers['mu-session-id'];
    await ensureRoleIsMuseum(sessionUri, museumUri);
    const museumGraph = getMuseumGraph(req.params.id);

    if( await sendMuseum(museumUri, museumGraph, VALIDATOR_GRAPH, true) ) {
      res
        .status(200)
        .send(JSON.stringify({status: "transfer succeeded"}));
    } else {
      res
        .status(500)
        .send(JSON.stringify({status: "transfer incomplete"}));
    }
  } catch (e) {
    if( e instanceof NoMatchingRoleError )
      res.status(403).send(JSON.stringify({ status: "wrong access rights" }));
    else
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
  try {
    const sessionUri = req.headers['mu-session-id'];
    await ensureRoleIsValidator(sessionUri);
    const museumUri = await getMuseumUri(req.params.id);

    if( await sendMuseum(museumUri, VALIDATOR_GRAPH, PUBLIC_GRAPH, true) ) {
      res
        .status(200)
        .send(JSON.stringify({status: "transfer succeeded"}));
    } else {
      res
        .status(500)
        .send(JSON.stringify({status: "transfer incomplete"}));
    }
  } catch (e) {
    if( e instanceof NoMatchingRoleError )
      res.status(403).send(JSON.stringify({ status: "wrong access rights" }));
    else
      res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

/**
 * Send a museum from the validator to the museum graph.
 *
 * - id: the uuid of the museum
 */
app.post('/museum/:id/send-to-museum', async function(req, res) {
  try {
    const sessionUri = req.headers['mu-session-id'];
    await ensureRoleIsValidator(sessionUri);
    const museumUri = await getMuseumUri(req.params.id);
    const museumGraph = getMuseumGraph(req.params.id);

    if( await sendMuseum(museumUri, VALIDATOR_GRAPH, museumGraph, true) ) {
      res
        .status(200)
        .send(JSON.stringify({status: "transfer succeeded"}));
    } else {
      res
        .status(500)
        .send(JSON.stringify({status: "transfer incomplete"}));
    }
  } catch (e) {
    if( e instanceof NoMatchingRoleError )
      res.status(403).send(JSON.stringify({ status: "wrong access rights" }));
    else
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
  try {
    const sessionUri = req.headers['mu-session-id'];
    await ensureRoleIsValidator(sessionUri);
    const museumUri = await getMuseumUri(req.params.id);

    if( await sendMuseum(museumUri, PUBLIC_GRAPH, VALIDATOR_GRAPH, true) ) {
      res
        .status(200)
        .send(JSON.stringify({status: "transfer succeeded"}));
    } else {
      res
        .status(500)
        .send(JSON.stringify({status: "transfer incomplete"}));
    }
  } catch (e) {
    if( e instanceof NoMatchingRoleError )
      res.status(403).send(JSON.stringify({ status: "wrong access rights" }));
    else
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
  try {
    const sessionUri = req.headers['mu-session-id'];
    await ensureRoleIsValidator(sessionUri);
    const museumUri = await getMuseumUri(req.params.id);

    const targetTriples = await fetchTriples(VALIDATOR_GRAPH, museumUri);

    if (targetTriples.length > 0)
      await db.removeTriples(VALIDATOR_GRAPH, targetTriples);

    res.status(200).send(JSON.stringify({ status: "remove succeeded" }));
  } catch (e) {
    if( e instanceof NoMatchingRoleError )
      res.status(403).send(JSON.stringify({ status: "wrong access rights" }));
    else
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
  try {
    const sessionUri = req.headers['mu-session-id'];
    await ensureRoleIsValidator(sessionUri);
    const museumUri = await getMuseumUri(req.params.id);

    const targetTriples = await fetchTriples(PUBLIC_GRAPH, museumUri);

    if (targetTriples.length > 0)
      await db.removeTriples(PUBLIC_GRAPH, targetTriples);

    res.status(200).send(JSON.stringify({ status: "remove succeeded" }));
  } catch (e) {
    if( e instanceof NoMatchingRoleError )
      res.status(403).send(JSON.stringify({ status: "wrong access rights" }));
    else
      res.status(500).send(JSON.stringify({ status: "failure" }));
  }
});

app.use(errorHandler);
