import userModel, { prefixes } from './config/model';
import { pre, post } from 'formal-code';

class Domain {
  expandedModel = {};

  constructor() {
    this.expandedModel = this.expandModel();
  }

  @pre(function() { return typeof userModel === 'object'; })
  @pre(function() { return typeof prefixes === 'object'; })
  @post((res) => typeof res === 'object')
  expandModel() {
    const res = {};
    for (const type in userModel) {
      res[this.expandUri(type)] = userModel[type].map(this.expandUri);
    }
    return res;
  }

  @pre((uri) => typeof uri === 'string')
  @post((res) => typeof res === 'string')
  @post((res) => res.indexOf("http") == 0) // not ideal, but it works for all current cases.
  expandUri(uri) {
    if (uri.indexOf("http") === 0) {
      return uri;
    } else {
      // split on the index, get left and right part.  find the left
      // part in the prefixes and attach the content to the right part.
      const splitIndex = uri.indexOf(":");
      const prefix = uri.slice(0, splitIndex);
      const uriRest = uri.slice(splitIndex + 1);
      const prefixReplacement = prefixes[prefix];
      if (!prefixReplacement)
        throw `Could not find prefix ${prefix} in configuration`;
      return `${prefixReplacement}${uriRest}`;
    }
  }

  /**
    * Check whether the supplied type is a type we are interested in or not.
    * 
    * @param {string} type The type URI to be checked.
    * @return {boolean} A boolean indicating whether this is an
    * interesting type or not.
    */
  @pre((type) => typeof type === "string")
  @post((res) => typeof res === "boolean")
  typeIncludedP(type) {
    return !!this.expandedModel[type];
  }

  /**
     * Is any of these types included in the dataset?
     *
     * @param {[string]} types
     * @return {boolean}
     */
  @pre((types) => types instanceof Array)
  @post((res) => typeof res === "boolean")
  anyTypeIncludedP(types) {
    return types.some((type) => this.typeIncludedP(type));
  }

  /**
    * Yield all properties for the supplied type.
    *
    * @param {string} type
    * @return {[string]}
    */
  @pre((type) => typeof type === "string")
  @post((res) => res instanceof Array)
  propertiesForType(type) {
    return this.expandedModel[type] || [];
  }
}

const domain = new Domain();

export default domain;
