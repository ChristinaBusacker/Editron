import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDropZone]',
})
export class DropZoneDirective {
  @Output() filesDropped = new EventEmitter<File[]>();
  @Output() filesHovered = new EventEmitter<boolean>();

  @HostBinding('class.dragging') isDragging = false;

  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.isDragging = true;
    this.filesHovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    this.isDragging = false;
    this.filesHovered.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.isDragging = false;
    this.filesHovered.emit(false);

    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      this.filesDropped.emit(Array.from(files));
    }
  }
}
