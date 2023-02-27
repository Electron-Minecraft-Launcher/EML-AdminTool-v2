import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepManagerService {

  private step = new Subject<0 | 1 | 2 | 3 | 4>();

  updateStep(step: 0 | 1 | 2 | 3 | 4) {
    this.step.next(step);
  }

  getStep(): Observable<0 | 1 | 2 | 3 | 4> {
    return this.step.asObservable();
  }
}
