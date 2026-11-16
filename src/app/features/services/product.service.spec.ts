import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
     vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('products on success',()=>{
    let result:any[] | undefined;
    service.search('phone').subscribe((products)=>(result = products))
     vi.advanceTimersByTime(300);
    expect(result).toBeDefined();
  })

  it('empty array when nothing matches',()=>{
    let result:any[] | undefined;
    service.search('jfskdj').subscribe((products)=>(result = products));
    vi.advanceTimersByTime(300);
    expect(result).toEqual([]);
  })

  it('catch error when term or query is "error"',()=>{
    let Er : Error | undefined;
    service.search('error').subscribe({
      error:(e)=>{Er=e}
    })
     vi.advanceTimersByTime(300);
     expect(Er).toBeInstanceOf(Error)
     expect(Er!.message).toBe('Error searching for products')
  })

});
