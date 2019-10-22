// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   * Wrapper type for phet/scenery-phet's UtteranceQueue
   * @param utteranceQueue
   * @param phetioID
   * @constructor
   */
  function UtteranceQueueIO( utteranceQueue, phetioID ) {
    assert && assertInstanceOf( utteranceQueue, Object );
    ObjectIO.call( this, utteranceQueue, phetioID );
  }

  phetioInherit( ObjectIO, 'UtteranceQueueIO', UtteranceQueueIO, {

    addToBack: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( textContent ) {
        return this.instance.addToBack( textContent );
      },
      documentation: 'Add the utterance (string) to the end of the queue.'
    },

    addToFront: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( textContent ) {
        return this.instance.addToFront( textContent );
      },
      documentation: 'Add the utterance (string) to the beginning of the queue.'
    },

    setMuted: {
      returnType: VoidIO,
      parameterTypes: [ BooleanIO ],
      implementation: function( muted ) {
        this.instance.muted( muted );
      },
      documentation: 'Set whether the utteranceQueue will be muted or not. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.'
    },
    getMuted: {
      returnType: BooleanIO,
      parameterTypes: [ VoidIO ],
      implementation: function() {
        return this.instance.muted();
      },
      documentation: 'Get whether the utteranceQueue is muted. If muted, utterances still move through the ' +
                     'queue but will not be read by screen readers.'
    },
    setEnabled: {
      returnType: VoidIO,
      parameterTypes: [ BooleanIO ],
      implementation: function( enabled ) {
        this.instance.enabled( enabled );
      },
      documentation: 'Set whether the utteranceQueue will be enabled or not. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.'
    },
    getEnabled: {
      returnType: BooleanIO,
      parameterTypes: [ VoidIO ],
      implementation: function() {
        return this.instance.enabled();
      },
      documentation: 'Get whether the utteranceQueue is enabled. When enabled, Utterances cannot be added to ' +
                     'the queue, and the Queue cannot be cleared. Also nothing will be sent to assistive technology.'
    }
  }, {
    documentation: 'Manages a queue of Utterances that are read in order by a screen reader.',
    events: [ 'announced' ]
  } );

  sceneryPhet.register( 'UtteranceQueueIO', UtteranceQueueIO );

  return UtteranceQueueIO;
} );
