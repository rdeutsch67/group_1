import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable, Observer} from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarUtils,
  CalendarView
} from 'angular-calendar';
import {NgIf} from "@angular/common";
import {addDays, addHours, endOfMonth, startOfDay, subDays} from "date-fns";

@Injectable()
export class PlanerdataService {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {
  }

  loadTeilnehmer(id: number): Observable<Teilnehmer[]> {

    let myUrl: string;
    if (id > 0 ) {
      myUrl = this.baseUrl + "api/teilnehmer/alle/" + id;
    }
    else {
      myUrl = this.baseUrl + "api/teilnehmer/alle/0";  // alle holen
    }

    return this.http.get<Teilnehmer[]>(myUrl);
  }

  loadAktiviaeten(id: number): Observable<Code_aktivitaet[]> {
    let myUrl: string;
    if (id > 0 ) {
      myUrl = this.baseUrl + "api/codesaktivitaeten/alle/" + id;
    }
    else {
      myUrl = this.baseUrl + "api/codesaktivitaeten/alle/0";  // alle holen
    }

    return this.http.get<Code_aktivitaet[]>(myUrl);

    /*this.http.get<Code_aktivitaet[]>(myUrl).subscribe(res => {
        this.selAktivitaeten = res;
      },
      error => console.error(error));*/
  }

  loadTermine(myID: number): Observable<Termin[]> {
    let myUrl: string;
    if (myID > 0 ) {
      myUrl = this.baseUrl + "api/termine/alle/spez/" + myID;
    }
    else {
      myUrl = this.baseUrl + "api/termine/alle/0";  // alle holen
    }

    return this.http.get<Termin[]>(myUrl);
  }

  loadPlanerCalenderEvents(myID: number): Observable<CalendarEvent[]> {


    let termine: Termin[];
    let calEvent: CalendarEvent;
    let terminEvents: CalendarEvent[];
    let myUrl: string;

    terminEvents = [];

    return Observable.create(observer => {
      setTimeout(() => {
          this.loadTermine(myID)
            .subscribe((data) => {
                termine = data;

                if (termine.length > 0) {
                  for (let i = 0; i < termine.length; i++) {
                    calEvent = <CalendarEvent>{};
                    calEvent.start = new Date(termine[i].Datum);
                    calEvent.title = 'Akt-ID: '+termine[i].IdAktivitaet;
                    var myColors: any = {
                      myTerminColor: {
                        primary: termine[i].Farbe,
                        secondary: termine[i].Farbe
                      }
                    };
                    calEvent.color = myColors.myTerminColor;
                    calEvent.title = termine[i].Bezeichnung;

                    terminEvents.push(calEvent);  // zum Array hinzufügen
                  }
                  observer.next(terminEvents);
                  observer.complete();
                }
              }
            );

        },10);
      }
    );
  }

}


