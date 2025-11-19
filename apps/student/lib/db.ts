import Dexie, { Table } from "dexie"

export interface Profile { id: string; name: string; createdAt: number }
export interface Skill { id: string; level: number; updatedAt: number }
export interface Progress { id: string; lesson: string; state: string; updatedAt: number }

export class AppDB extends Dexie {
  profiles!: Table<Profile, string>
  skills!: Table<Skill, string>
  progress!: Table<Progress, string>
  constructor() {
    super("student-app-db")
    this.version(1).stores({
      profiles: "id",
      skills: "id, level",
      progress: "id, lesson"
    })
  }
}

export const db = new AppDB()