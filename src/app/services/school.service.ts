import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

export interface SchoolData {
  name: string,
  id: string
}


@Injectable({
  providedIn: "root"
})

export class SchoolService {

  private students: Array<SchoolData> = [
    { id: "1", name: "renato" },
    { id: "2", name: "marcio" },
    { id: "3", name: "silva" }
  ];

  private teachers: Array<SchoolData> = [
    { id: "1", name: "maria" },
    { id: "2", name: "ana" },
    { id: "3", name: "alfredo" },
  ]

  public getStudents(): Observable<Array<SchoolData>> {
    return of(this.students);
  }

  public getTeachers(): Observable<Array<SchoolData>> {
    return of(this.teachers);
  }
}
