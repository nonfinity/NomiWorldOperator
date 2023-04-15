/**
 * this is the class that builds and maintains the inspector panel
 */
import * as nwo from './nwo_v0.0.02';

export class inspector {
  // class member declarations
    readonly parent_id: string;
    private _target: any;
    private _tgtClass: string;
  //

  constructor(parent: string) {
    
  }

  // general class methods
  //

  // line item specific logics
  //

  // class getter/setters
  get target() { return this._target; }
  set target(value: any) {
    this._target = value;
    this._tgtClass = value.constructor.name;
  }
  //

}