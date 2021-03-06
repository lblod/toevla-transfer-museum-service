import domain from './domain';
import QueryHandler from './queries';
import { pre, post } from 'formal-code';

const FETCH_TRIPLES_REQUEST_CONCURRENCY = 32;

class TripleStore {
  /**
     * @type Map<string,string>
     */
  triples = new Map();

  /**
   * Creates a new TripleStore, optionally setting it up with data.
   *
   * @param {[object] | undefined} triples Initial set of triples.
   */
  constructor(triples = []) {
    triples.forEach((triple) => this.add(this.canonical(triple)));
  }

  @pre((triple) => typeof triple.o === "object")
  @pre((triple) => typeof triple.p === "object")
  @pre((triple) => typeof triple.o === "object")
  @post((res) => typeof res.o === "object")
  canonical(triple) {
    if( triple.o.datatype === "http://www.w3.org/2001/XMLSchema#decimal" )
      triple.o.datatype = "http://www.w3.org/2001/XMLSchema#integer";
    return triple;
  }

  /**
    * Adds a triple to the store.
    *
    * @param {Object} triple
    */
  @pre((triple) => typeof triple.s === "object")
  @pre((triple) => typeof triple.p === "object")
  @pre((triple) => typeof triple.o === "object")
  add(triple) {
    const canonicalTriple = this.canonical(triple);
    if (!this.has(triple))
      this.triples.set(JSON.stringify(canonicalTriple), canonicalTriple);
  }

  /**
    * @param {Object} triple
    * @return {boolean}
    */
  has(triple) {
    return this.triples.has(JSON.stringify(this.canonical(triple)));
  }

  /**
     * Yields all triples in the store.
     * @return {[Object]} All triples
     */
  @post((res) => res instanceof Array)
  all() {
    return [...this.triples.values()];
  }
}

/**
 * Captures information based on received requests.
 */
export default class InformationCapturing {
  /**
     * Graph in which we have to search.
     * @type {string}
     */
  graph = null;

  /**
     * Uri we want to find.
     * @type {string}
     */
  uri = null;

  /**
     * QueryHandler through which we can execute predefined database
     * queries.
     * @type {QueryHandler}
     */
  db = null;

  /**
     *  Set of resources which need fetching.
     * @type {Set<string>}
     */
  newResources = new Set();

  /**
     * A cache of types we've already discovered.
     * @type {Map<String,String>}
     */
  typeCache = new Map();

  /**
     * Contains all fetched triples.
     * @type {TripleStore} triples.
     */
  triples = new TripleStore();

  /**
     * A new information capturing based on the supplied graph and uri.
     *
     * @param {string} graph Where we go get the information.
     * @param {string} uri Source entity.
     */
  // @pre((graph, uri) => typeof graph === "string")
  // @pre((graph, uri) => typeof uri === "string")
  // @post(function(res) { return res instanceof InformationCapturing; })
  // @post(function() { return this.db instanceof QueryHandler; })
  constructor(graph, uri) {
    this.graph = graph;
    this.uri = uri;
    this.db = new QueryHandler();
  }

  /**
   * Splits entities in N batches.
   *
   * @template T
   * @param {[T]} triples Entities to batch.
   * @param {number} batches Amount of batches.
   * @return {[[T]]} Nested array of batches.
   */
  splitTriples(triples, batches = FETCH_TRIPLES_REQUEST_CONCURRENCY) {
    // initialize the batches
    const result = [];
    for (let i = 0; i < batches; i++) {
      result[i] = [];
    }

    // fill the batches
    triples.forEach((triple, idx) =>
      result[idx % batches].push(triple)
    );

    return result;
  }

  /**
     * Fetches all triples originating from the provided data-source.
     *
     * @return {Promise}
     */
  async fetch() {
    this.newResources.add(this.uri);
    const db = this.db;

    do {
      // prep to walk over all resources
      const nextResources = [...this.newResources];
      this.newResources.clear();

      // discover the URIs to fetch
      const urisToFetch = new Set();
      for (const resource of nextResources)
        if (domain.anyTypeIncludedP(await this.typesForResource(resource)))
          urisToFetch.add(resource);

      // fetch extra information for each of the URIs
      const batches = this.splitTriples([...urisToFetch], FETCH_TRIPLES_REQUEST_CONCURRENCY);
      const promises = batches.map( async (batch) => {
        for (const resource of [...batch]) {
          for (const triple
               of await db.fetchData(this.graph,
                                     resource,
                                     await this.allPredicates(resource))) {

            this.triples.add(triple);
            if (!this.isKnownResource(triple.s.value))
              this.newResources.add(triple.s.value);
            if (triple.o.type === "uri"
                && !this.isKnownResource(triple.o.value))
              this.newResources.add(triple.o.value);
          }
        }
      });

      await Promise.all( promises );
    } while (this.newResources.size !== 0)
  }

  /**
    * Returns types for the given resource.
    *
    * The types are scoped to the current graph.
    *
    * @param {string} uri
    * @return {Promise<[string]>} All types of the supplied resource.
    */
  @pre(function() { return typeof this.graph === "string"; })
  @pre((uri) => typeof uri === "string")
  @post((res) => res instanceof Array)
  async typesForResource(uri) {
    if (this.typeCache.has(uri)) {
      return this.typeCache.get(uri);
    }
    else {
      const types = await this.db.typesFor(uri, this.graph);
      this.typeCache.set(uri, types);
      return types;
    }
  }

  /**
    * Have we treated the resource below?
    *
    * We assume it has been treated if the types have been fetched earlier.
    * @param {string} uri
    * @return {boolean}
    */
  @pre((uri) => typeof uri === "string")
  @post((res) => typeof res === "boolean")
  isKnownResource(uri) {
    return this.typeCache.has(uri);
  }

  /**
    * What are all the predicates for the given resource?
    *
    * @param {string} resource
    * @return {Promise<[string | Object]>}
    */
  @pre((uri) => typeof uri === "string")
  @post((res) => res instanceof Array)
  async allPredicates(resource) {
    const predicates = new Set();
    (await this.typesForResource(resource))
      .forEach((type) =>
        domain
          .propertiesForType(type)
          .forEach((property) => predicates.add(property)));
    return [...predicates.values()];
  }
}

/**
 * Fetches the triples starting from URI in GRAPH.
 *
 * @param {string} graph
 * @param {string} uri
 */
async function fetchTriples(graph, uri) {
  const ic = new InformationCapturing(graph, uri);
  await ic.fetch();
  return ic.triples.all();
}

/**
 * Yields the triples which are in source but not in target.
 *
 * Non-destructive operation.
 *
 * @param {[object]} source Array with triples as base knowledge.
 * @param {[object]} target Array if triples that will be removed from
 * the result.
 */
function triplesMinus(source, target) {
  const targetStore = new TripleStore(target);

  return source.filter((s) => !targetStore.has(s));
}

export { fetchTriples, triplesMinus };
