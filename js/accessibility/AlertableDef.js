// Copyright 2018, University of Colorado Boulder

/**
 * "definition" type for generalized alerts (anything that can be spoken by an
 * assistive device without requiring active focus). This includes anything
 * that can move through utteranceQueue.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );

  // constants
  var AlertableDef = {

    /**
     * Returns whether the parameter is considered to be a alertable, for use
     * in utteranceQueue.
     * @param  {*}  alertable
     * @return {boolean}
     */
    isAlertableDef: function( alertable ) {
      var isAlertable = true;

      // if array, check each item individually
      if ( Array.isArray( alertable ) ) {
        for ( var i = 0; i < alertable.length; i++ ) {
          isAlertable = isItemAlertable( alertable[ i ] );
          if ( !isAlertable ) { break; }
        }
      }
      else {
        isAlertable = isItemAlertable( alertable );
      }

      return isAlertable;
    }
  };

  /**
   * Check whether a single item is alertable.
   * @param  {[type]}  alertable [description]
   * @return {Boolean}           [description]
   */
  var isItemAlertable = function( alertable ) {
    return typeof alertable === 'string' ||
           typeof alertable === 'number' ||
           alertable instanceof Utterance;
  };

  sceneryPhet.register( 'AlertableDef', AlertableDef );

  return AlertableDef;

} );
