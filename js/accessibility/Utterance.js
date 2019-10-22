// Copyright 2017-2018, University of Colorado Boulder

/**
 * An utterance to be handed off to the AlertQueue, which manages the order of accessibility alerts
 * read by a screen reader.
 *
 * An utterance to be provided to the AlertQueue. An utterance can be one of AlertableDef or an array of items
 * that conform to AlertableDef. If using an array, alertables in the array will be anounced in order (one at a time)
 * each time this utterances is added to the utteranceQueue.
 *
 * A single Utterance can be added to the utteranceQueue multiple times. This may be so that a
 * number of alerts associated with the utterance get read in order (see alert in config). Or it
 * may be that changes are being alerted rapidly from the same source. An Utterance is considered
 * "unstable" if it is being added rapidly to the utteranceQueue. By default, utterances are only
 * announced when they are "stable", and stop getting added to the queue. This will prevent
 * a large number of alerts from the same interaction from spamming the user. See related options
 * alertStable, alertStableDelay, and alertMaximumDelay.
 *
 * @author Jesse Greenberg
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // will be a unique identifier for instance of Utterance to assist with grouping of utterances
  // in the utteranceQueue
  let instanceCount = 0;

  class Utterance {

    /**
     * @param {Object} config
     */
    constructor( config ) {
      config = _.extend( {

        /**
         * The content of the alert that this Utterance is wrapping. If it is an array, then the Utterance will
         * keep track of number of times that the Utterance has been alerted, and choose from the list "accordingly" see
         * loopingSchema for more details
         * {AlertableDef}
         * @required
         */
        alert: null,

        // if true, then the alert must be of type {Array}, and alerting will cycle through each alert, and then wrap back
        // to the beginning when complete. The default behavior (loopAlerts:false) is to repeat the last alert in the array until reset.
        loopAlerts: false,

        // @returns {boolean} - if predicate returns false, the alert content associated
        // with this utterance will not be announced by a screen reader
        predicate: function() { return true; },

        // {boolean} - if true, the alert will not be spoken until this utterance stops being added to the
        // utteranceQueue for stableDelay time, or if alertMaximumDelay time has passed while this
        // utterance has continuously changed (if it is specified).
        alertStable: true,

        // {number} - in ms, how long to wait before the utterance is considered "stable" and stops being
        // added to the queue, at which point it will be spoken if alertStable is true. Note that the alert will
        // be in the queue for at least this long or longer (depending on interval of utteranceQueue)
        alertStableDelay: 500,

        // {number} - if specified, the utterance will be spoken at least this frequently in ms
        // even if the utterance is continuously added to the queue and never becomes "stable"
        alertMaximumDelay: Number.MAX_VALUE
      }, config );

      assert && assert( config.alert, 'alert is required' );
      assert && assert( typeof config.alert === 'string' || Array.isArray( config.alert ) );
      assert && assert( typeof config.loopAlerts === 'boolean' );
      assert && assert( typeof config.predicate === 'function' );
      assert && assert( typeof config.alertStable === 'boolean' );
      assert && assert( typeof config.alertStableDelay === 'number' );
      assert && assert( typeof config.alertMaximumDelay === 'number' );
      if ( config.loopAlerts ) {
        assert && assert( Array.isArray( config.alert ), 'if loopAlerts is provided, config.alert must be an array' );
      }

      // @private
      this._alert = config.alert;
      this.numberOfTimesAlerted = 0; // keep track of the number of times alerted, this will dictate which alert to call.
      this.loopAlerts = config.loopAlerts;

      // @public (read-only, scenery-phet-internal)
      this.predicate = config.predicate;

      // @public {number} (scenery-phet-internal) - In ms, how long this utterance has been in the queue. The
      // same Utterance can be in the queue more than once (for utterance looping or while the utterance stabilizes),
      // in this case the time will be since the first time the utterance was added to the queue.
      this.timeInQueue = 0;

      // @public (scenery-phet-internal) {number}  - in ms, how long this utterance has been "stable", which
      // is the amount of time since this utterance has been added to the utteranceQueue
      this.stableTime = 0;

      // @public {boolean} - whether or not the utteranceQueue will wait alertStableDelay amount
      // of time before alerting this utterance to wait for the same utterance to stop reaching
      // the queue
      this.alertStable = config.alertStable;

      // @public (read-only, scenery-phet-internal) {number} - assign this utterance to a unique id so that
      // we can suppress duplicates of this utterance in the utteranceQueue if alertStable is true
      this.uniqueGroupId = instanceCount++;

      // @public {number} (scenery-phet-internal) - In ms, how long the utterance should remain in the queue before it
      // is read. The queue is cleared in FIFO order, but utterances are skipped until the delay time is less than the
      // amount of time the utterance has been in the queue
      this.alertStableDelay = config.alertStableDelay;

      // @public {scenery-phet-internal, read-only} {number}- in ms, the maximum amount of time that should
      // pass before this alert should be spoken, even if the utterance is rapidly added to the queue
      // and is not quite "stable"
      this.alertMaximumDelay = config.alertMaximumDelay;
    }

    /**
     * Getter for the text to be alerted for this Utterance. This should only be called when the alert is about to occur
     * because Utterance updates the number of times it has alerted based on this function, see this.numberOfTimesAlerted
     * @returns {string}
     * @public
     */
    getTextToAlert() {
      let alert;
      if ( typeof this._alert === 'string' ) {
        alert = this._alert;
      }
      else if ( this.loopAlerts ) {
        alert = this._alert[ this.numberOfTimesAlerted % this._alert.length ];
      }
      else {
        assert && assert( Array.isArray( this._alert ) ); // sanity check
        const currentAlertIndex = Math.min( this.numberOfTimesAlerted, this._alert.length - 1 );
        alert = this._alert[ currentAlertIndex ];
      }
      this.numberOfTimesAlerted++;
      return alert;
    }

    /**
     * Set the alert for the utterance
     * @param {AlertableDef} alert
     * @public
     */
    set alert( alert ) {
      this._alert = alert;
    }

    /**
     * @public
     */
    reset() {
      this.numberOfTimesAlerted = 0;
    }
  }

  return sceneryPhet.register( 'Utterance', Utterance );
} );
