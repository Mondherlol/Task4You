import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.css'
})
export class ProjetComponent implements OnInit{
  projects: any[] = [];
  projectForm: FormGroup;
  newMemberEmail: { [key: string]: string } = {};
  @Output() projectsLoaded = new EventEmitter<any[]>(); // Événement pour transmettre les projets
  selectedProject: any | null = null;
  @Output() projectSelected = new EventEmitter<string>();
  addMemberErrorMessage = '';
  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
      this.projectsLoaded.emit(this.projects);
    });
  }
  selectProject(project: any) {
    this.selectedProject = project;
    this.projectSelected.emit(project._id);
  }

  addProject() {
    if (this.projectForm.valid) {
      this.projectService.createProject(this.projectForm.value).subscribe(() => {
        this.getProjects();
        this.projectForm.reset();
      });
    }
  }

  deleteProject(id: string) {
    this.projectService.deleteProject(id).subscribe(() => {
      this.getProjects();
    });
  }

  addMember(projectId: string, memberEmail: string) {
    if (!projectId || !memberEmail) {
      console.error("Project ID or email is undefined!");
      return;
    }
  
    this.projectService.addMember(projectId, memberEmail).subscribe(() => {
      console.log(`Membre ${memberEmail} ajouté au projet ${projectId}`);
      this.getProjects();
    }, error => {
      this.addMemberErrorMessage = error.error.message || "Error adding member";
      console.error("Error adding member:", error.error.message);
    });
  }

  removeMember(projectId: string, memberEmail: string) {
    this.projectService.removeMember(projectId, memberEmail).subscribe(() => {
      this.getProjects();
    });
  }

  archiveProject(projectId: string) {
    if (!projectId) {
      console.error("Project ID is undefined !");
      return;
    }
    this.projectService.archiveProject(projectId).subscribe(() => {
      this.getProjects();
    }, error => {
      console.error("Error archiving project:", error);
    });
  }

  unarchiveProject(id: string) {
    this.projectService.unarchiveProject(id).subscribe(() => {
      this.getProjects();
    });
  }
}