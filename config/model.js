/**
 * This file is read and processed by domain.js.  It is the intention
 * that end-users can provide this file, whilst ../domain.js processes it
 * and provides hande accessors for the information provided here.
 */

export default {
  "https://data.vlaanderen.be/ns/adres#AdresseerbaarObject": [
    "mu:uuid",
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
    { uri: "toevla:atLocation", inverse: true },
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
    { uri: "toevla:rendersPoi", inverse: true },
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
    { uri: "toevla:scoreSubject", inverse: true }
  ],
  "toevla:Widget": [
    "mu:uuid",
    // no properties
    // relationships
    "toevla:rendersPoi" // redundant but may help if we start from widget
  ],
  // "skos:Concept": [], // concepts are public
  "toevla:Restaurant": [
    "mu:uuid",
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
    "toevla:amountOfThresholds",
    "toevla:amountOfStairs",
    "toevla:amountOfSlopes",
    "toevla:highestThresholdOnRouteToConsumptionSpace",
    "toevla:heightUnderTableForWheelchairInConsumptionSpace",
    "toevla:mostNarrowDoorWidthForTerrace",
    "toevla:smallestPointOnRouteForTarrace",
    "toevla:highestThresholdForTerrace",
    // no relationships
  ],
  "toevla:Shop": [
    "mu:uuid",
    // properties
    "toevla:accessControlWidth",
    "toevla:mostNarrowDoorwidth",
    "toevla:highestThreshold",
    "toevla:smallestPointOnRoute",
    "toevla:hasPaymentWithFixedElectronicPaymentSystem",
    "toevla:hasPaymentWithMovableElectronicPaymentSystem",
    "toevla:hasCashPayment",
    "toevla:comment",
    "toevla:heightOfLoweredCounter",
    // no relationships
  ],
  "nfo:FileDataObject": [
    "mu:uuid",
    // properties
    "dbpedia:fileExtension",
    "nfo:fileSize",
    "dct:format",
    "dct:description",
    "rdfs:label",
    "ext:order",
    "nfo:fileName",
    "nfo:fileCreated",
    // relationships
    { uri: "nie:dataSource", inverse: true },
    // { uri: "toevla:hasFile", inverse: true } (exists in other direction)
    // "toevla:belongsToExperienceTreeNodeScore" // not used yet
  ],
  "toevla:RouteDescription": [
    "mu:uuid",
    // properties
    "toevla:hasDetailedDescription",
    "toevla:hasFlemishSignLanguage",
    "toevla:hasScreenreader"
  ],
  "toevla:TrainStop": [
    "mu:uuid",
    "toevla:distanceFromLocation",
    "toevla:stopName"
  ],
  "toevla:TramStop": [
    "mu:uuid",
    "toevla:distanceFromLocation",
    "toevla:stopName"
  ],
  "toevla:BusStop": [
    "mu:uuid",
    "toevla:distanceFromLocation",
    "toevla:stopName"
  ],
  "https://linkedgeodata.org/ontology/Toilets": [
    "mu:uuid",
    // properties
    "toevla:amountOfSupportBraces",
    "toevla:turningRadius",
    "toevla:spaceNextToToilet",
    "toevla:spaceInFrontOfToilet",
    "toevla:turningRadiusAtDoor",
    "toevla:doorWidth",
    "toevla:typeOfElevator",
    "toevla:amountOfPlateauElevators",
    "toevla:hasRamps",
    "toevla:amountOfSlopes",
    "toevla:amountOfStairs",
    "toevla:amountOfThresholds",
    "toevla:highestThresholdOnRoute",
    "toevla:smallestPointOnRoute",
    "toevla:hasBabyNurturingTable",
    "toevla:hasClearSignalizationInBuilding",
    "toevla:hasSyntheticSpeechInElevator",
    "toevla:hasSimpleAndLogicalRoute",
    "toevla:isWheelchairAccessibleThroughBuilding",
    "toevla:comment",
    "toevla:hasWashbasin",
    // relationships
    "toevla:sizeOfPlateauElevator",
    "toevla:sizeOfToiletRoom",
    "toevla:canRideUnderWashbasinCategory",
    "toevla:sizeOfElevator"
  ],
  "toevla:Area": [
    "mu:uuid",
    // properties
    "toevla:widthInCm",
    "toevla:heightInCm",
  ],
  "schema:Parking": [
    "mu:uuid",
    // properties
    "toevla:parkingSpaceWidth",
    "toevla:parkingSpaceLength",
    "toevla:hasWheelchairFriendlyTerrain",
    "toevla:onPublicDomain",
    "toevla:numberOfWheelchairFriendlySpots",
    "toevla:detailedRouteDescriptionIsAvailableInFlemishSignLanguage",
    "toevla:detailedRouteDescriptionHasScreenReader",
    "toevla:hasDetailedRouteDescription",
    "toevla:isWellLit",
    "toevla:hasDriveOnPossibility",
    "toevla:isPartOfLocation",
    "toevla:comment",
    "toevla:maxVehicleHeight",
    // relationships
    "toevla:pathToEntrance"
  ],
  "toevla:Path": [
    "mu:uuid",
    // properties
    "toevla:amountOfSlopes",
    "toevla:amountOfStairs",
    "toevla:numberOfThresholds",
    "toevla:highestThreshold",
    "toevla:narrowestPoint",
    "toevla:hasWheelchairFriendlyTerrain",
    "toevla:hasRamp",
    // no relationships
  ],
  "toevla:Entrance": [
    "mu:uuid",
    // properties
    "toevla:turningRadiusAtDoor",
    "toevla:hasEntranceCheck",
    "toevla:doorWidth",
    "toevla:hasRevolvingDoor",
    "toevla:hasRamps",
    "toevla:amountOfSlopes",
    "toevla:amountOfStairs",
    "toevla:amountOfThresholds",
    "toevla:commentOnAlternativeEntranceForWheelchair",
    "toevla:highestThreshold",
    "toevla:hasTeleloopAtCounter",
    "toevla:hasMannedDesk",
    "toevla:hasVisibleGuidelines",
    "toevla:hasLoweredCounter",
    // relationships
    // { uri: "toevla:hasEntrance", inverse: true } // on Poi
    "toevla:forceForOpeningDoorCategory"
  ],
  "toevla:Experience": [
    "mu:uuid",
    // properties
    "toevla:hasPlacesOfSilence",
    "toevla:hasListeningElements",
    "toevla:hasActionableElements",
    "toevla:hasSmellElements",
    "toevla:hasTouchElements",
    "toevla:hasVirtualTechnology",
    "toevla:hasMovieGuide",
    "toevla:audioGuideAvailableViaOtherMeans",
    "toevla:audioGuideAvailableViaSmartphone",
    "toevla:audioGuideAvailableViaHeatset",
    "toevla:audioGuideAvailableInMultipleLanguages",
    "toevla:audioGuideOnlyInDutch",
    "toevla:signsInLargePrint",
    "toevla:signsHaveBraille",
    "toevla:signsHaveNoReflection",
    "toevla:signsHaveAccessibleContrast",
    "toevla:brochureIsAvailableInLargePrint",
    "toevla:brochureIsAvailableInBraille",
    "toevla:brochureHasAccessibleContrast",
    "toevla:hasMagnifyingGlass",
    "toevla:hasGoodLighting",
    "toevla:hasMultipleElementsToDriveUnder",
    "toevla:comment",
    "dct:title",
    "toevla:otherElements",
    // relationships
    "toevla:scoreSubject",
    "toevla:hasAuditorium",
    "toevla:guidedTour",
    "toevla:hasCirculation",
    "toevla:atLocation",
    { uri: "toevla:scoreSubject", inverse: true }
  ],
  "toevla:Auditorium": [
    "mu:uuid",
    // noproperties
    // relationships
    "toevla:availabilityOfTailorMadeTours",
    "toevla:availabilityOnQuietMoments",
    "toevla:supportForChildren",
    "toevla:supportForAutism",
    "toevla:supportForDementia",
    "toevla:supportForMentalHandicap",
    "toevla:supportForDeaf",
    "toevla:supportForAuditiveHandicap",
    "toevla:supportForVisualHandicap",
  ],
  "toevla:Route": [
    "mu:uuid",
    // properties
    "toevla:hasMultipleRestingAndSittingOpportunities",
    "toevla:hasAlternativePathForHardToAccessSpaces",
    "toevla:hasPlanForAdvisedPath",
    "toevla:hasVenuePlan",
    "toevla:hasClearSignalizationOnRoute",
    "toevla:typeOfElevator",
    "toevla:amountOfPlateauElevators",
    "toevla:hasRamps",
    "toevla:amountOfSlopes",
    "toevla:amountOfStairs",
    "toevla:amountOfThresholds",
    "toevla:highestThresholdOnRoute",
    "toevla:smallestPointOnRoute",
    "toevla:hasSyntheticSpeechInElevator",
    "toevla:hasClearSignalizationInBuilding",
    "toevla:isSimpleAndLogical",
    "toevla:comment",
    "toevla:hasExtraAttentionForAcoustics",
    // relationships
    "toevla:multipleLevelsCategory",
    "toevla:sizeOfPlateauElevator",
    "toevla:sizeOfElevator",
  ],
  "toevla:TreeNodeScore": [
    "mu:uuid",
    // properties
    "toevla:commentLinkUrl",
    "toevla:commentLinkText",
    "rdfs:comment",
    "toevla:score",
    "ext:entryWasVisited",
    // relationships
    "toevla:selectedConcept",
    "toevla:scoreTopic",
    "toevla:scoreSubject"
  ]
};

const prefixes = {
  "mu": "http://mu.semte.ch/vocabularies/core/",
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
