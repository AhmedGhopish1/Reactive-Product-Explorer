# Reactive Product Explorer

A product search screen built with Angular 21, Signals, and RxJS.

## Signals

Signals hold all the local UI state:

- `query`: the text typed in the search box
- `selectedCategory` and `selectedSort`: the filter and sort choices
- `retryCount`: a counter that triggers a retry

`computed()` is used for everything derived from them:

- `normalizedQuery`, `categories`
- `filteredProducts`, then `visibleProducts` (filter, then sort)
- `productCount`, `showProducts`

The template only reads these values and contains no filtering or sorting logic.


## RxJS 

RxJS handles the asynchronous search. The query signal is converted with `toObservable()` and passed through:

- `debounceTime(300)`: waits 300ms after the user stops typing
- `distinctUntilChanged()`: skips repeated values
- `switchMap()`: sends the request to `ProductService`
- `catchError()`: turns failures into an error state

`toSignal()` converts the result back into a Signal, so the component has no manual `subscribe()`.

## switchMap() 
When the user types a new search, the previous request may still be running. `switchMap()` cancels it and keeps only the latest one, so an old, slow response can never overwrite newer results.
