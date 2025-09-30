// src/app/services/csv.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  constructor(private http: HttpClient) {}

  loadCsv(path: string): Observable<any[]> {
    return this.http.get(path, { responseType: 'text' }).pipe(
      map(csvData => {
        const parsed = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true
        });
        return parsed.data as any[];
      })
    );
  }
}
