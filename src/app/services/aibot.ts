import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AIModel } from '../models/aiModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:"root"
})
export class AIBot {
    private apiURL = environment.apiUrl
    constructor(private http: HttpClient) { }

    getAIModels(): Observable<AIModel[]> {
        return this.http.get<AIModel[]>(this.apiURL + "/models",{
            withCredentials: true
        });
    }
    askAIBot(): Observable<JSON> {
        return this.http.get<JSON>(this.apiURL + "/models",{
            withCredentials: true
        });
    }
}
