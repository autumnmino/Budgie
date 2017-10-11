import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ValuesFunctionsProvider {
  items = [
    "pizza",
    "medical",
    "shirt",
    "subway",
    "wine",
    "american-football"
  ];

  itemscolors = [
    '#ff0000',
    '#ff8000',
    '#ffdf00',
    '#00ff00',
    '#0080ff',
    '#8000ff',
    '#ff40ff'
  ]

  days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  types = [
    "Food", "Medical", "Clothes", "Transportation", "Entertainment", "Sports"
  ];

  constructor() {
  }

  getTypeNames(type: any) {
    return this.types[type];
  }

  getIndexFromName(name: string){
    for(let i = 0; i < this.types.length; i++) {
      if (name == this.types[i]) {
        return i;
      }
    }
  }

  convertToDateTime(mills: any) {
    let date = new Date(mills);
    return date;
  }

}
