import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FmodeParse } from 'fmode-ng'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('recycle-app');
  
  ngOnInit() {
    FmodeParse.initialize('dev');
  }
}
