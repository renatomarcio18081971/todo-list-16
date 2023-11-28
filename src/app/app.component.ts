import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { TodoCardComponent } from './components/todo-card/todo-card.component';
import { SchoolData, SchoolService } from './services/school.service';
import { Observable, Subject, filter, from, map, of, switchMap, takeUntil, zip } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TodoCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  public students: Array<SchoolData> = [];
  public teachers: Array<SchoolData> = [];
  private zipSchoolResponses$ = zip(
    this.getStudentsDatas(),
    this.getTeachersDatas()
  )
  public title = 'todo-list-16';
  private ages =  of(20, 30, 40, 50, 60, 70, 80);
  private peopleDatas = from([
    {nome: "renato", idade: 52, profissao: "analista de sistemas"},
    {nome: "marcio", idade: 62, profissao: "cozinheiro"},
    {nome: "silva", idade: 70, profissao: "dono de restaurante"},
  ])

  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    //QUANDO FOR UTILIZAR O ZIP DESCOMENTAR ESTA LINHA PARA VERIFICAR QUE ESTÁ CHAMANDO VARIOS OBSERVABLES
    //this.getSchoolDatas();
    //this.getVariasIdades();
    // this.getProfissoes();
    //this.getNomesProfissoesFiltradas("cozinheiro");
    this.handleObterEstudante();
  }

  public handleObterEstudante(): void {
    this.getStudentsDatas()
                .pipe(switchMap((students) => this.obterEstudante(students, "1")))
                .subscribe((response) => { console.log("Estudante filtrado ", response) })
  }

  public obterEstudante(students: Array<SchoolData>, id: string): Observable<(SchoolData | undefined)[]> {
    return of([students.find((student) => student.id === id)]);
  }

  public getNomesProfissoesFiltradas(profissao: string): void {
    this.peopleDatas.pipe(
                        filter((p) => p.profissao === profissao),
                        map((p) => p.nome)
                    )
                    .subscribe({
                      next:(response) => console.log("PROFISSAO ", response)
                    })
  }

  public getProfissoes(): void {
    this.peopleDatas.pipe(map((p) => p.profissao))
                    .subscribe({
                      next:(response) => console.log("PROFISSAO ", response)
                    })
  }

  public getVariasIdades(): void {
    this.ages.pipe(takeUntil(this.destroy$),
                    map((age)=> age * age))
             .subscribe({
                next:(response) => {
                  console.log("IDADE MULTIPLICADA ", response)
                }
             })
  }

  public getSchoolDatas(): void {
    this.zipSchoolResponses$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next:(response) => {
        console.log("STUDENTS ", response[0]);
        console.log("TEACHERS ", response[1]);
      }
    })
  }

  private getStudentsDatas(): Observable<Array<SchoolData>> {
    return this.schoolService.getStudents();
  }

  private getTeachersDatas(): Observable<Array<SchoolData>> {
    return this.schoolService.getTeachers();
  }
}
