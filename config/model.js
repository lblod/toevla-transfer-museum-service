/**
 * This file is read and processed by domain.js.  It is the intention
 * that end-users can provide this file, whilst ../domain.js processes it
 * and provides hande accessors for the information provided here.
 */

export default {
  "https://data.vlaanderen.be/ns/adres#AdresseerbaarObject": [
    // properties
    "rdfs:label",
    "toevla:comment",
    "toevla:commentOnPublicTransport",
    "toevla:commentOnEntrance",
    "ext:locationString",
    "toevla:hasCashPayment",
    "toevla:hasPaymentWithMovableElectronicPaymentSystem",
    "toevla:hasPaymentWithFixedElectronicPaymentSystem",
    "toevla:hasOrderingAndPaymentOnline",
    "toevla:assistanceForGuideDogs",
    "toevla:websiteHasScreenreader",
    "toevla:websiteSupportsWCAG2",
    "toevla:websiteAllowsTextIncrease",
    "toevla:websiteHasAccessibleContrast",
    "toevla:websiteHasSignLanguage",
    "toevla:publicTransportGuidanceAvailable",
    "toevla:hasClearlyRecognizableBuilding",
    "toevla:hasVisibleGuidelines",
    "toevla:hasVisualVisitPreparationPlan",
    "toevla:extraAttentionGivenToAcoustics",
    "toevla:hasClearlyRecognizableEntrance",
    "toevla:hasRevolvingDoor",
    "toevla:isNoisy",
    "toevla:hasGlassFloor",
    "toevla:hasDifficultStaircaseForDogs",
    "toevla:hasEscalator",
    "toevla:hasWheelchairAccessibleToilet",
    // relationships
    "toevla:atLocation",
    "toevla:hasFile",
    "toevla:hasImage",
    "toevla:hasEntrance",
    "toevla:hasParking",
    "toevla:hasToilet",
    "toevla:hasTrainStop",
    "toevla:hasBusStop",
    "toevla:hasTramStop",
    "toevla:summaryIcon",
    "toevla:hasPublicTransportRouteDescription",
    "toevla:hasRestaurant",
    "toevla:rendersPoi",
    "toevla:hasShop",
    "toevla:wifiAvailability",
    "toevla:typeOfGlassDoorDecoration",
    "toevla:acceptanceOfMuseumPass",
    "toevla:acceptanceOfUitpas",
    "toevla:acceptanceOfCityPass",
    "toevla:acceptanceOfEdc",
    "toevla:discountForGuide",
    "toevla:discountForTranslator",
    "toevla:wheelchairAvailability",
  ],
  // "skos:Concept": [], // concepts are public
  "toevla:Restaurant": [
    // properties
    "toevla:heightUnderTarraceTableForWheelchairInConsumptionSpace",
    "toevla:comment",
    "toevla:hasCashPayment",
    "toevla:hasPaymentWithMovableElectronicPaymentSystem",
    "toevla:hasPaymentWithFixedElectronicPaymentSystem",
    "toevla:hasOrderingAndPaymentOnline",
    "toevla:amountOfSeatingPlaces",
    "toevla:hasSpaceSuitedForGroupsWithMobileLimitation",
    "toevla:hasMenuAvailableOnline",
    "toevla:hasMenuVisuallyClearToRead",
    "toevla:hasMenuAvailableInBraille",
    "toevla:hasMenuAvailableWithPictures",
    "toevla:hasDietBasedMeasAdjustment",
    "toevla:hasInformationOnAllergenics",
    "toevla:hasChildrenMenu",
    "toevla:hasChildSeat",
    "toevla:mostNarrowDoorWidthInConsumptionSpace",
    "toevla:smallestPointOnRouteToConsumptionSpace",
    "toevla:highestThresholdOnRouteToConsumptionSpace",
    "toevla:heightUnderTableForWheelchairInConsumptionSpace",
    "toevla:mostNarrowDoorWidthForTerrace",
    "toevla:smallestPointOnRouteForTarrace",
    "toevla:highestThresholdForTerrace",
    // no relationships
  ]
};

const prefixes = {
  "ext": "http://mu.semte.ch/vocabularies/ext/",
  "skos": "http://www.w3.org/2004/02/skos/core#",
  "dct": "http://purl.org/dc/terms/",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "toevla": "http://toevla.org/ns/generic/",
  "schema": "http://schema.org/",
  "nfo": "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#",
  "nie": "http://www.semanticdesktop.org/ontologies/2007/01/19/nie#",
  "dbpedia": "http://dbpedia.org/resource/",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "muaccount": "http://mu.semte.ch/vocabularies/account/",
  "musession": "http://mu.semte.ch/vocabularies/session/"
};

export { prefixes };
