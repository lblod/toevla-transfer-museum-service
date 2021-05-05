import { querySudo, updateSudo } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeUri } from 'mu';
import { pre, post } from 'formal-code';

const PREFIXES = `
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
`;

export default class QueryHandler {
  /**
    * Finds the Museum URI for a given UUID.
    *
    * Gets the ID as a string, yields back a URI as a string.
    *
    * @param id :: UUID as a string
    */
  @pre((id) => typeof id === "string")
  @post((result) => result === undefined || typeof result === "string")
  async findMuseumUriForId(id) {
    const response = await querySudo(`${PREFIXES}
      SELECT ?museumUri WHERE {
        ?museumUri mu:uuid ${sparqlEscapeString(id)}.
      }`);

    try {
      return response.results.bindings[0].museumUri.value;
    } catch (e) {
      return undefined;
    }
  }

  @pre((uri) => typeof uri === "string")
  @pre((graph) => graph === undefined || typeof graph === "string")
  @post((result) => result instanceof Array)
  async typesFor(uri, graph) {
    let response;

    if (graph) {
      response = await querySudo(`
        SELECT DISTINCT ?type WHERE {
          GRAPH ${sparqlEscapeUri(graph)} {
            ${sparqlEscapeUri(uri)} a ?type.
          }
        }
      `);
    } else {
      response = await querySudo(`
        SELECT DISTINCT ?type WHERE {
          ${sparqlEscapeUri(uri)} a ?type.
        }
      `);
    }

    return response.results.bindings
      .map((binding) => binding["type"].value);
  }

  /**
     * Fetches all the data for the supplied resource using a construct
     * query.
     * 
     * @param {string} graph The graph which contains the resources.
     * @param {string} resource The source resource.
     * @param {[string | Object]} predicates All predicates to fetch.
     */
  async fetchData(graph, resource, predicates) {
    // What we need to do here is create a new resource, and fetch the
    // triples from there.

    const isInverse = (predicate) => predicate.inverse;

    const uriForSparql = (predicate) =>
      sparqlEscapeUri(
        typeof predicate === "string"
          ? predicate
          : predicate.uri);

    let tripleStatements =
      predicates
        .map((pred, idx) =>
          isInverse(pred)
            ? `?__sym${idx} ${uriForSparql(pred)} ${sparqlEscapeUri(resource)}.`
            : `${sparqlEscapeUri(resource)} ${uriForSparql(pred)} ?__sym${idx}.`);

    let generatePattern = "  " + tripleStatements.join("\n  ");
    let matchPattern = "  { " + tripleStatements.join("\n  } UNION {\n  ") + "\n }";

    const response = await querySudo(`CONSTRUCT {
      ${sparqlEscapeUri(resource)} a ?type.
      ${generatePattern}
    } WHERE {
       GRAPH ${sparqlEscapeUri(graph)} {
         ${sparqlEscapeUri(resource)} a ?type.
         ${matchPattern}
       }
    }`);

    return response.results.bindings;
  }

  /**
    * Removes the specified triples from the specified graph.
    *
    * @param {string} graph The affected graph.
    * @param {[Object]} triples The triples to remove.
    * @return {Promise}
    */
  @pre((graph) => typeof graph === "string")
  @pre((graph, triples) => triples instanceof Array)
  @pre((graph, triples) => triples.length > 0)
  // @post({ doc: "triples removed from graph" })
  async removeTriples(graph, triples) {
    // TODO: split triples in queries of N batches.
    const statements =
      triples
        .map((triple) => this.sparqlFormatTriple(triple))
        .join("  \n");

    await updateSudo(`DELETE DATA {
      GRAPH ${sparqlEscapeUri(graph)} {
        ${statements}
      }
    }`);
  }

  @pre((graph) => typeof graph === "string")
  @pre((graph, triples) => triples instanceof Array)
  @pre((graph, triples) => triples.length > 0)
  // @post({ doc: "triples inserted into graph" })
  async insertTriples(graph, triples) {
    // TODO: split triples in queries of N batches.

    const statements =
      triples
        .map((triple) => this.sparqlFormatTriple(triple))
        .join("  \n");

    await updateSudo(`INSERT DATA {
      GRAPH ${sparqlEscapeUri(graph)} {
        ${statements}
      }
    }`);
  }

  /**
     * Formats a triple so it can be put into a SPARQL query.
     *
     * @param {Object} tirple
     * @return {string}
     */
  @pre((triple) => typeof triple.s === "object" && triple.s.value)
  @pre((triple) => typeof triple.p === "object" && triple.p.value)
  @pre((triple) => typeof triple.o === "object")
  @post((res) => typeof res === "string")
  sparqlFormatTriple(triple) {
    const formatEntity = function(entity) {
      const value = entity.value;
      if (entity.type === "uri") {
        return sparqlEscapeUri(value);
      } else if (entity["xml:lang"]) {
        return `${sparqlEscapeString(value)}@${entity["xml:lang"]}`;
      } else if (entity["datatype"]) {
        return `${sparqlEscapeString(value)}^^${sparqlEscapeUri(entity["datatype"])}`;
      } else {
        return sparqlEscapeString(value);
      }
    };

    // TODO: verify this is correct for booleans and numbers
    return `${formatEntity(triple.s)} ${formatEntity(triple.p)} ${formatEntity(triple.o)}.`;
  }
}
