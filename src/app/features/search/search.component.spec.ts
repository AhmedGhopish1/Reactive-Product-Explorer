import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { ProductService } from '../services/product.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let service: ProductService;

    function advance(ms: number) {
    vi.advanceTimersByTime(ms);
  }

  beforeEach(async () => {
    

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    service = TestBed.inject(ProductService);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    
    vi.useFakeTimers();

    fixture.detectChanges();
  });

    afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('shows all products in the initial state', () => {
    expect(component.state().status).toBe('initial');
    expect(component.productCount()).toBe(10);
  });

  it('filters products by category', () => {
    component.selectedCategory.set('electronics');

    const list = component.visibleProducts();
    expect(list.every((p) => p.category === 'electronics')).toBe(true);
  });



  it('sorts by price low to high', () => {
    component.selectedSort.set('price-asc');
    expect(component.visibleProducts()[0].title).toBe('Desk Lamp'); 
  });

  it('sorts by price high to low', () => {
    component.selectedSort.set('price-desc');
    expect(component.visibleProducts()[0].title).toBe('iPhone 15'); 
  });

    it('sorts by name A to Z and Z to A', () => {
    component.selectedSort.set('name-AtoZ');
    expect(component.visibleProducts()[0].title).toBe('Angular Handbook');

    component.selectedSort.set('name-ZtoA');
    expect(component.visibleProducts()[0].title).toBe('Sony Headphones');
  });

  it('resets everything when clearing filters', () => {
    component.query.set('phone');
    component.selectedCategory.set('electronics');
    component.selectedSort.set('price-desc');

    component.clearFilters();

    expect(component.query()).toBe('');
    expect(component.selectedCategory()).toBe('');
    expect(component.selectedSort()).toBe('name-AtoZ');
  });

});
