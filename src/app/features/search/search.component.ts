import { Product, SortOption } from './../../models/product.interface';
import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../services/product.service';
import { compatForm } from '@angular/forms/signals/compat';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, timer } from 'rxjs';
import {searchState} from '../../models/product.interface'

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {

  private readonly _productService = inject(ProductService);

  readonly allProducts = signal<Product[]>(this._productService.MockProducts)

  readonly query = signal('');
  readonly retryCount = signal<number>(0);

  readonly normalizeQueru = computed(()=>this.query().trim().toLocaleLowerCase());

  // private readonly query$ = toObservable(this.normalizeQueru)
  private readonly query$ = toObservable(computed(()=>({query: this.normalizeQueru(),retry:this.retryCount()})))


  private readonly searchSrates$ = this.query$.pipe(
    debounceTime(300),
    distinctUntilChanged((a,b)=>a.query===b.query && a.retry===b.retry),
    switchMap(({query})=>{
      if(query === '')
      {
        return of<searchState>({
          status:'initial'
        })
      }

      return this._productService.search(query).pipe(
        map((products):searchState=>products.length
            ? { status: 'success', products }
            : { status: 'empty' }),
        startWith<searchState>({ status: 'loading' }),
        catchError(()=>
          of<searchState>({
            status:'error',
            message:'search failed'
          })
        )
      )
    

}))

 readonly state = toSignal(this.searchSrates$,{
  initialValue:{status:'initial'}as searchState
})

readonly selectedCategory = signal('');
readonly selectedSort = signal<SortOption>('name-AtoZ');

private readonly products = computed<Product[]>(()=>{
  const st = this.state();
  switch(st.status)
  {
    case 'initial':return this.allProducts();
    case 'success':return st.products;
    default : return [];
  }
})

 readonly dynamiCategories = computed(()=>[
  ...new Set(this.products().map((p)=>p.category))
])

readonly effectiveCategory = computed(() => {
  const selected = this.selectedCategory();
  return this.dynamiCategories().includes(selected) ? selected : '';
});

 readonly filteredCategProducts = computed(()=>
{
  const category = this.selectedCategory();
  const all = this.products();
  return category?all.filter((p)=>p.category === this.selectedCategory()):all;
});

readonly visibleProducts = computed(()=>{
  const list = [...this.filteredCategProducts()];
  switch(this.selectedSort()){
    case 'price-asc':
      return list.sort((a,b)=> a.price - b.price);
    case 'price-desc': 
     return list.sort((a,b)=>b.price-a.price);
    case 'name-AtoZ': 
     return list.sort((a,b)=> a.title.localeCompare(b.title));
    case 'name-ZtoA': 
     return  list.sort((a,b)=> b.title.localeCompare(a.title));
    default: return list; 
      
  }
})

readonly productCount = computed(() => this.visibleProducts().length);

readonly showProducts = computed(()=>{
  const state = this.state().status;
  return state === 'initial' || state === 'success'
});


readonly showControls = computed(() => {
  const s = this.state().status;
  return s !== 'loading' && s !== 'error';
});


readonly noMatchesAfterFilter = computed(
  () => this.showProducts() && this.productCount() === 0
);

onSortChange(value: string){ 
  this.selectedSort.set(value as SortOption);
 }

clearFilters() {
  this.query.set('');
  this.selectedCategory.set('');
  this.selectedSort.set('name-AtoZ');
}


simulateFailureOnce() {
  this._productService.failNextRequests(1);
}

}
