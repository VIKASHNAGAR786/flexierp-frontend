import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySearch',
  standalone: true // ✅ if you’re using standalone components
})
export class FilterBySearchPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    if (!items || !search) return items;
    const lower = search.toLowerCase();
    return items.filter(item =>
      item.key.toLowerCase().includes(lower) ||
      (item.value && item.value.toString().toLowerCase().includes(lower))
    );
  }
}