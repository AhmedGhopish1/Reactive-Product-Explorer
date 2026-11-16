import { Injectable, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { defer, delay, finalize, map, Observable, of, timer } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProductService {

 MockProducts: Product[]=[
  { id: 1, title: 'iPhone 15', description: 'Apple smartphone', price: 999, category: 'electronics', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500' },
  { id: 2, title: 'Galaxy S24', description: 'Samsung smartphone', price: 899, category: 'electronics', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Samsung_Galaxy_S24.jpg/500px-Samsung_Galaxy_S24.jpg' },
  { id: 3, title: 'Sony Headphones', description: 'Noise cancelling', price: 349, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { id: 4, title: 'Running Shoes', description: 'Lightweight shoes', price: 120, category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { id: 5, title: 'Leather Jacket', description: 'Genuine leather', price: 250, category: 'fashion', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' },
  { id: 6, title: 'Denim Jeans', description: 'Classic fit', price: 80, category: 'fashion', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
  { id: 7, title: 'Coffee Maker', description: 'Automatic drip', price: 70, category: 'home', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' },
  { id: 8, title: 'Desk Lamp', description: 'LED adjustable', price: 35, category: 'home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500' },
  { id: 9, title: 'JavaScript Book', description: 'Learn JS deeply', price: 40, category: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500' },
  { id: 10, title: 'Angular Handbook', description: 'Master Angular', price: 45, category: 'books', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500' },
]

private failurLeft = 0
failNextRequests(n: number) {
    this.failurLeft = n;
  }

  search(term: string):Observable<Product[]>{
    return defer(()=>{
      console.log("started",term);
      
      const delayMs = 300;

      return timer(delayMs).pipe(
        map(()=>{
          if(term=='error'||this.failurLeft>0)
          {
            if(this.failurLeft>0) this.failurLeft--;
            throw new Error('Error searching for products')
          }
          return this.MockProducts.filter(product => product.title.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
        }),
        finalize(()=>{
          console.log("finished Or Unsbscribed",term);
        })
      )

    })
  }


}
