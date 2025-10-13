import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FmodeParse } from 'fmode-ng'
FmodeParse.initialize('dev');
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('recycle-app');
}
