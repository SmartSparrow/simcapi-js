define(function(require) {
  var SimCapiType = function(enumValue, stringValue) {
    this.enumValue = enumValue;
    this.stringValue = stringValue;
  };

  SimCapiType.prototype.valueOf = function() {
    return this.enumValue;
  };

  SimCapiType.prototype.toString = function() {
    return this.stringValue;
  };

  var SIMCAPI_TYPES = {
    NUMBER: new SimCapiType(1, 'Number'),
    STRING: new SimCapiType(2, 'String'),
    ARRAY: new SimCapiType(3, 'Array'),
    BOOLEAN: new SimCapiType(4, 'Boolean'),
    ENUM: new SimCapiType(5, 'Enum'),
    MATH_EXPR: new SimCapiType(6, 'MathExpression'),
    ARRAY_POINT: new SimCapiType(7, 'Point Array')
  };

  /*
   *  Returns key to enumValue map
   *   e.g., {
   *     NUMBER: 1,
   *     STRING: 2,
   *     ...
   *   }
   */
  var TYPES = Object.keys(SIMCAPI_TYPES).reduce(function(prev, key) {
    var value = SIMCAPI_TYPES[key];
    prev[key] = value.valueOf();
    return prev;
  }, {});

  /*
   * Returns enumValue to string map
   *   e.g., {
   *     1: 'Number',
   *     2: 'String',
   *     ...
   *   }
   */
  var STRING_MAP = Object.keys(SIMCAPI_TYPES).reduce(function(prev, key) {
     var value = SIMCAPI_TYPES[key];
     prev[value.valueOf()] = value.toString();
     return prev;
   }, {});

  /*
   * EnumValue to String
   *   e.g., SIMCAPI_TYPES.toString(SIMCAPI_TYPES.TYPES.STRING) returns 'String'
   */
  var toString = function(type) {
    return STRING_MAP[type];
  };

  return {
    TYPES: TYPES,
    toString: toString
  };
});