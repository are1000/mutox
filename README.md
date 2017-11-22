# mutox

Functional state management library inspired by and compatible with [redux](https://github.com/reactjs/redux).

It is a drop-in replacement for redux, aimed at reducing boilerplate. Similar philosophy applies,
except for the motion of _reducers_ and _actions_, which are replaced by  _mutations_. Created in mind with
small applications, that want to use state management similar to redux that seamlessly works with react,
but without all of the ceremonials that come with redux "boilerplate".

[![Travis](https://img.shields.io/travis/are1000/mutox.svg?style=flat-square)](https://travis-ci.org/are1000/mutox)
[![Version](https://img.shields.io/npm/v/mutox.svg?style=flat-square)](http://npmjs.com/package/mutox)

### Installation
To install latest version of `mutox`:

    $ npm install --save mutox
    
### Usage

```js
import { createStore, mutate, get } from 'mutex'

let store = createStore({
  counter: 0
})

store.subscribe(() => {
  console.log(store.getState())
})

const increment = x => x + 1
const decrement = x => x - 1

const counter = mutate('counter')

store.dispatch(counter(increment))
// { counter: 1 }
store.dispatch(counter(increment))
// { counter: 2 }
store.dispatch(counter(decrement))
// { counter: 1 }
```

Support for asynchrony is built-in - your mutations and all methods support `async/await`, so you can do stuff like:

```js
const MY_URL = 'https://random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new'
const getJson = url => fetch(url).then(response => response.json())

store.dispatch(
  counter(
    get('data')(
      getJson(MY_URL) // this returns a Promise<Number>
    ),
    increment
  )
)
```

### License
MIT
