# mapmoize

[![NPM](https://img.shields.io/npm/v/mapmoize)](https://www.npmjs.com/package/mapmoize)
[![Bundle Size](https://img.shields.io/bundlephobia/min/mapmoize@*?label=bundle)](https://bundlephobia.com/package/mapmoize@*)
![Test](https://img.shields.io/github/workflow/status/ukstv/mapmoize/Test)

A memoize decorator for Typescript that uses `WeakMap`s or property replacement to memoize results.
Probably the fastest memoization decorator available.

## Installation

```
npm install --save mapmoize
```

## Usage

```typescript
@Memoize(params?: {hashFunction?: (...args: any[]) => any})
// or
@memoize(params?: {hashFunction?: (...args: any[]) => any})
```

You can use it in four ways:

- Memoize a `get` accessor,
- Memoize a method which takes no parameters,
- Memoize a method which varies based on all the parameters,
- Memoize a method which varies based on some combination of parameters

You can call memoized methods _within_ the same class, too.
This could be useful if you want to memoize the return value for an entire data set,
and also a filtered or mapped version of that same set.

## Memoize a `get` accessor, or a method which takes no parameters

These both work the same way. Subsequent calls to a memoized method without parameters, or to a `get` accessor, always return the same value.

```typescript
import { memoize } from "mapmoize";

class SimpleFoo {
  // Memoize a method without parameters
  @memoize()
  public getAllTheData() {
    // do some expensive operation to get data
    return data;
  }

  // Memoize a getter
  @memoize()
  public get someValue() {
    // do some expensive operation to calculate value
    return value;
  }
}
```

And then we call them from somewhere else in our code:

```typescript
let simpleFoo = new SimpleFoo();

// Memoizes a calculated value and returns it:
let methodVal1 = simpleFoo.getAllTheData();

// Returns memoized value
let methodVal2 = simpleFoo.getAllTheData();

// Memoizes (lazy-loads) a calculated value and returns it:
let getterVal1 = simpleFoo.someValue;

// Returns memoized value
let getterVal2 = simpleFoo.someValue;
```

## Memoize a method which varies based on all the parameters

Subsequent calls to this style of memoized method will always return the same value.
One thing to have in mind is that we prepare digest for the parameters by casting them to a string.
This could cause some issues since string representation of any object by default is `[object Object]`.
Make sure to use custom hash function (see below) or add indicative `toString` method or `Symbol.toStringTag` getter.

```typescript
import { memoize } from "mapmoize";

class ComplicatedFoo {
  // Memoize a method without parameters (just like the first example)
  @memoize()
  public getAllTheData() {
    // do some expensive operation to get data
    return data;
  }

  // Memoize a method with one parameter
  @memoize()
  public getSomeOfTheData(id: number) {
    let allTheData = this.getAllTheData(); // if you want to!
    // do some expensive operation to get data
    return data;
  }

  // Memoize a method with multiple parameters
  @memoize()
  public getGreeting(name: string, planet: string) {
    return "Hello, " + name + "! Welcome to " + planet;
  }
}
```

We call these methods from somewhere else in our code:

```typescript
let complicatedFoo = new ComplicatedFoo();

// Returns calculated value and memoizes it:
let oneParam1 = complicatedFoo.getSomeOfTheData();

// Returns memoized value
let oneParam2 = complicatedFoo.getSomeOfTheData();

// Memoizes a calculated value and returns it:
// 'Hello, Darryl! Welcome to Earth'
let greeterVal1 = complicatedFoo.getGreeting("Darryl", "Earth");

// Returns memoized value
// 'Hello, Darryl! Welcome to Earth'
let greeterVal2 = complicatedFoo.getGreeting("Darryl", "Earth");
```

## Memoize a method which varies based on some combination of parameters

Pass in a `hashFunction` which takes the same parameters as your target method, or some other custom logic.
The `hashFunction` is called in the context of the method's class.

```typescript
import { memoize } from "mampoize";

class MoreComplicatedFoo {
  // Memoize will remember values based on just the first parameter
  @memoize({
    hashFunction: (name: string, planet: string) => name,
  })
  public getBetterGreeting(name: string, planet: string) {
    return "Hello, " + name + "! Welcome to " + planet;
  }

  // Memoize based on some other logic
  @memoize({
    hashFunction: () => new Date().toISOString(),
  })
  public memoryLeak(greeting: string) {
    return greeting + "!!!!!";
  }
}
```

We call these methods from somewhere else in our code. By now you should be getting the idea:

```typescript
let moreComplicatedFoo = new MoreComplicatedFoo();

// 'Hello, Darryl! Welcome to Earth'
let greeterVal1 = moreComplicatedFoo.getBetterGreeting("Darryl", "Earth");

// The second parameter is ignored.
// 'Hello, Darryl! Welcome to Earth'
let greeterVal2 = moreComplicatedFoo.getBetterGreeting("Darryl", "Mars");

// Fill up the computer with useless greetings:
let greeting = moreComplicatedFoo.memoryLeak("Hello");
```

## Custom arguments cache

We store calculated results in a map `digest(arguments) -> result`. By default it is a vanilla JS `Map`,
which grows unbounded with different arguments. You could customise that by providing a custom map-like structure,
like [lru-map](https://www.npmjs.com/package/lru_map):

```typescript
import { memoize } from "mampoize";
import lru from "lru_map";

class MoreComplicatedFoo {
  // We remember now the most recently used 100 results.
  @memoize({
    argsCacheBuilder: () => new lru.LRUMap<string, any>(100),
  })
  public getBetterGreeting(name: string, planet: string) {
    return "Hello, " + name + "! Welcome to " + planet;
  }
}
```

# How it works

General notion of memoization is simple: calculate a value the first time a call is made, and reuse it forever,
instead of recalculating on each call. The main question is where to store the memoized value.

A decorator provided in the package is for class methods and getters only. Internally they are both functions,
as a class in JS is a syntactic sugar.

We could attach a memoized value to an instance of the function. That naive approach would lead to errors and confusion.
Class methods are not _bound_ to the class instance. The binding, i.e. providing `this`, happens through a syntax convention.
If we have a class `A` with a method `foo`, and an instance `a1` of the class, `a1.foo()` is an equivalent of `a1.foo.call(a1)`:
`this` inside `foo` is set to `a1`.

Instead of using the class method syntax, we can try to use the function directly: `const c = a1.foo; c()`. We shall see,
that `this` inside `foo` is not defined. `a1.foo` has no intrinsic knowledge about the instance `a1`.

It is clear now, if we try to attach a memoized value to a class method, treated as a function, we would share the memoized value
across all instances of the class. This is an error.

What we should do instead is to attach a memoized value to a unique pair `(function, instance)`.
And, we should make sure, that if `instance` or `function` gets garbage collected, our memoized value is gone too.
For this we use `WeakMap`, linked to an instance of a function we decorate. Keys there are all the instances.
If we decorate a method, values there are `Map<string, any>`, where `string` here is a "digest"
of the method arguments, and `any` - is the result of the method for the arguments passed.
If we decorate a getter, we store actual values in the `WeakMap`.

Here is a more visual description of the hierarchy:

- `method → WeakMap(instance → Map(arguments -> value))`
- `getter → WeakMap(instance → value)`.

This is true for what we call `REPLACE` strategy. There is another way to memoize a function. Let's start with a getter.
After a getter calculates a value, we can add a property to an object effectively replacing the getter.
This makes memoization as fast as hand-crafted native variable to hold the value.
Similar is true for functions. Instead of getting a memoization map (`arguments → value`) from `WeakMap` by class instance each time, we can replace a memoized method
with a closure that already hands the memoization map.

You can use `REPLACE` strategy by setting it as a parameter:

```ts
import { memoize, Strategy } from "mapmoize";

class SimpleFoo {
  // Memoize a method without parameters
  @memoize({ strategy: Strategy.REPLACE })
  public getAllTheData() {
    // do some expensive operation to get data
    return data;
  }

  // Memoize a getter
  @memoize({ strategy: Strategy.REPLACE })
  public get someValue() {
    // do some expensive operation to calculate value
    return value;
  }
}
```
